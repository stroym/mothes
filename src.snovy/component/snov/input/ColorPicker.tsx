import React, {useEffect, useRef, useState} from "react"

import {Button} from "./Button"
import {watchOutsideClick} from "../../../util/hooks"
import {ColoredInput} from "./Input"
import FocusTrap from "focus-trap-react"
import {combineOptions, joinClass, makeClassName} from "../../../util/utils"
import {ABSOLUTE, COLOR_PICKER, WITH_BORDER} from "../../../util/classes"
import TinyStyle, {ReactiveColor, ReactiveTextColor} from "../../../util/colors"

type PickerOptions = {
  includeButton?: boolean
  absolute?: boolean
  colors?: Array<string>
}

const defaultOptions: PickerOptions = {
  includeButton: false,
  absolute: false,
  colors: [
    "#8f00ff", "#4B0082", "#0000ff",
    "#00ff00", "#40e0d0", "#ffff00",
    "#964B00", "#ffa500", "#ff0000",
    "#ffffff", "#888888", "#000000"
  ]
}

interface PickerProps extends Omit<React.HTMLProps<HTMLSpanElement>, "selected">, ReactiveTextColor {
  selected: string | undefined
  pick: (hex: string) => void
  options?: PickerOptions
}

export const ColorPicker = (
  {
    selected,
    pick,
    options: passedOptions,
    textColors,
    disabled,
    ...props
  }: PickerProps
) => {

  const options = combineOptions(passedOptions, defaultOptions)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , toggle] = watchOutsideClick(buttonRef, {
    otherRefs: [pickerRef],
    eventType: "click",
    onToggleOff: () => setIntColor("")
  })

  //TODO hook to position picker (spawn from button event, most likely), prevent it from going out of bounds

  const [intColor, setIntColor] = useState<string>(selected ?? "")

  useEffect(
    () => {
      setIntColor(selected ?? "")
    }, [selected]
  )

  return (
    <>
      {
        options.includeButton &&
        <Button
          ref={buttonRef} id={props.id + "-button"} disabled={disabled} className="color-picker-button" border circular
          onClick={toggle} color={selected}
        />
      }
      {
        visible &&
        <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true, escapeDeactivates: true}}>
        <span
          {...props} ref={pickerRef}
          className={makeClassName(COLOR_PICKER, [[[ABSOLUTE, WITH_BORDER], options.absolute]])}
          style={options.absolute ? {position: "absolute"} : props.style}
        >
          <div className="color-container">
            {options.colors?.map((color, index) =>
              <ColorItem key={index} onClick={setIntColor} color={color}/>
            )}
          </div>
          <div className="color-controls">
          <Button preset="remove" circular border onClick={toggle}/>
          <ColoredInput value={intColor} onValueChange={setIntColor} textColors={textColors} border/>
          <Button
            preset="confirm" circular border
            onClick={() => {
              pick(intColor)
              toggle()
            }}
          />
          </div>
        </span>
        </FocusTrap>
      }
    </>
  )

}

const ColorItem = (props: {
  onClick: (hex: string) => void,
  color: string
}) => {

  return <Button
    className="color-item" border onClick={() => {props.onClick(props.color)}} color={props.color} circular
  />

}

export interface ColorHelperProps extends React.HTMLProps<HTMLSpanElement> {
  colors?: ReactiveColor
}

export const ColorHelper = ({colors, children, style, className}: ColorHelperProps) => {

  const computedStyle = colors ? {...TinyStyle.fromReadable(colors).makeStyle(), ...style} : style

  return <span className={joinClass(["color-helper", className])} style={computedStyle}>
    {children}
  </span>

}

export default ColorPicker