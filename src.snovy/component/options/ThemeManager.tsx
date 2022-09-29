import React, {useEffect, useState} from "react"
import {Theme} from "../../data/model/options/Theme"
import ComboBox from "../snov/input/downshift/ComboBox"
import {Button} from "../snov/input/Button"
import FocusTrap from "focus-trap-react"
import Input, {ColoredInput} from "../snov/input/Input"
import {LABEL} from "../../util/classes"
import {joinClass} from "../../util/utils"
import WithLabel from "../snov/input/WithLabel"

interface ThemeProps {
  currentTheme: Theme | undefined
  setCurrentTheme: (theme: Theme) => void
  themes: Array<Theme>
  setThemes: (themes: Array<Theme>) => void
}

const ThemeManager = ({themes, setThemes, currentTheme, setCurrentTheme}: ThemeProps) => {

  if (!currentTheme) {
    return null
  }

  const [currentTitle, setCurrentTitle] = useState<string>(currentTheme.title)

  useEffect(
    () => {
      currentTheme && setCurrentTitle(currentTheme.title)
    }, [currentTheme]
  )

  const createTheme = () => {
    setThemes([...Array.from(themes), Theme.makeFrom(currentTheme, currentTitle)])
  }

  const deleteTheme = () => {
    const tempThemes = Array.from(themes)
    setCurrentTheme(tempThemes.deleteAndGet(currentTheme)!)
    setThemes(tempThemes)
  }

  const templates = [
    {
      label: "Primary text color",
      currentColor: currentTheme.textPrimary,
      setColor: value => currentTheme.textPrimary = value
    },
    {
      label: "Secondary text color",
      currentColor: currentTheme.textSecondary,
      setColor: value => currentTheme.textSecondary = value
    },
    {
      label: "Primary color",
      currentColor: currentTheme.primary,
      setColor: value => currentTheme.primary = value
    },
    {
      label: "Accent color",
      currentColor: currentTheme.accent,
      setColor: value => currentTheme.accent = value
    },
    {
      label: "Border color",
      currentColor: currentTheme.border,
      setColor: value => currentTheme.border = value
    },
    {
      label: "Hover color",
      currentColor: currentTheme.hover,
      setColor: value => currentTheme.hover = value
    },
    {
      label: "Active Color",
      currentColor: currentTheme.activeItem,
      setColor: value => currentTheme.activeItem = value
    },
  ]

  return (
    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true, escapeDeactivates: true}}>
      <form id="theme-options" className={joinClass(["snovy-options-container", "snovy-scroll"])}
            onSubmit={e => e.preventDefault()} tabIndex={-1}>
        <div className="snovy-input-group">
          <ComboBox<Theme>
            label={{value: "Active theme"}} items={themes} selected={currentTheme}
            onSelect={value => value && setCurrentTheme(value)}
            options={{allowDeselect: false}}
            borders={{main: true, dropdown: true}}
          />
          <label className={LABEL}>{"Theme title"}</label>
          <Input onValueChange={setCurrentTitle} value={currentTitle} border/>
          {
            templates.map((it, index) =>
              <>
                <WithLabel key={`${index}-label`} value={it.label}/>
                <ColoredInput
                  key={`${index}-input`}
                  value={it.currentColor} onValueChange={it.setColor} textColors={currentTheme} observe border
                />
              </>
            )
          }
        </div>
        <div className="snovy-button-group">
          <Button value="Delete theme" border onClick={() => deleteTheme()}/>
          <Button value="Reset theme" border onClick={() => false}/>
          <Button
            type="submit" value="Save theme" border
            onClick={async () => {
              await currentTheme.updateTitle(currentTitle)
            }}
          />
          <Button type="submit" value="Create theme" border onClick={() => createTheme()}/>
        </div>
      </form>
    </FocusTrap>
  )

}

export default ThemeManager