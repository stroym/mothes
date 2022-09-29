import React, {useContext, useLayoutEffect, useRef, useState} from "react"
import OptionsContext from "../../util/OptionsContext"
import {Button} from "../snov/input/Button"
import ThemeManager from "./ThemeManager"
import {Theme} from "../../data/model/options/Theme"
import {dexie} from "../../index"
import {defaults} from "../../data/model/options/Defaults"
import {exportData, fetchThemes, importData} from "../../data/Database"
import WithLabel from "../snov/input/WithLabel"
import {default as ExportIcon} from "../../../public/icons/import.svg"
import {default as ImportIcon} from "../../../public/icons/export.svg"
import {default as RemoveIcon} from "../../../public/icons/remove.svg"
import {default as AddIcon} from "../../../public/icons/add.svg"
import generate from "../../data/Generator"

//TODO make this a modal?
const OptionsManager = () => {

  const importRef = useRef<HTMLInputElement>(null)

  const context = useContext(OptionsContext)

  const [unsavedChanges, setUnsavedChanges] = useState(false) //TODO track changes...

  const [options, setOptions] = useState(context.options.clone())
  const [theme, setTheme] = useState<Theme | undefined>()

  const [themes, setThemes] = useState<Array<Theme>>([])

  useLayoutEffect(
    () => {
      getThemes()

      return () => {
        if (unsavedChanges) {
          if ((confirm("You have unsaved changes. Would you like to save them?"))) {
            submit()
          } else {
            cancel()
          }
        }
      }
    }, []
  )

  async function getThemes() {
    const themes = await fetchThemes()

    setThemes(themes)
    setTheme(themes.find(it => it.id == options.themeId)!)
  }

  const fetchTheme = async () => {
    setTheme((await dexie.themes.get(options.themeId))!)
  }

  const submit = async () => {
    await theme?.save()
    options.themeId = theme?.id
    context.setOptions(await options.save())
    //update current options etc.
  }

  const restore = async () => {
    await dexie.transaction("rw", dexie.themes, dexie.options, async () => {
      await dexie.themes.clear()
      await dexie.themes.bulkAdd(defaults.themes)

      const options = defaults.options
      const newThemes = await dexie.themes.toArray()
      const firstTheme = newThemes.first()!
      options.themeId = firstTheme.id

      await dexie.options.clear()
      await dexie.options.add(options)

      context.setOptions(options)

      setOptions(options)
      setThemes(newThemes)
      setTheme(firstTheme)
    })
  }

  const cancel = async () => {
    await getThemes()

    const options = context.options.clone()
    setUnsavedChanges(false)
    setOptions(options)
    await fetchTheme()
  }

  return (
    <div className="snovy-options">
      <div id="import-export" className="snovy-options-container">
        <WithLabel value="Import">
          <Button preset="provided" border onClick={() => importRef.current?.click()}>
            <ImportIcon/>
          </Button>
          <input ref={importRef} type="file" onChange={e => importData(e.target.files)} style={{display: "none"}}/>
        </WithLabel>
        <WithLabel value="Export">
          <Button preset="provided" border onClick={exportData}>
            <ExportIcon/>
          </Button>
        </WithLabel>
        <WithLabel value="Mock">
          <Button
            preset="provided" border
            onClick={async () => {
              await generate()
              location.reload()
            }}
          >
            <AddIcon/>
          </Button>
        </WithLabel>
        <WithLabel value="Drop">
          <Button
            preset="provided" border
            onClick={async () => {
              await dexie.delete()
              location.reload()
            }}
          >
            <RemoveIcon/>
          </Button>
        </WithLabel>
      </div>
      <ThemeManager themes={themes} setThemes={setThemes} currentTheme={theme} setCurrentTheme={setTheme}/>
      <div id="control-buttons">
        <Button value="Restore defaults" border onClick={restore}/>
        <Button value="Cancel" border onClick={cancel}/>
        <Button type="submit" value="Save" border onClick={submit}/>
      </div>
    </div>
  )

}

export default OptionsManager