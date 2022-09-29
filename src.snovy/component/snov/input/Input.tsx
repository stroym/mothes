import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react"
import {watchOutsideClick} from "../../../util/hooks"
import {ColorHelper} from "./ColorPicker"
import {joinClass, KeyMapping, makeClassName, useKey} from "../../../util/utils"
import {Key} from "ts-key-enum"
import {ReactiveTextColor} from "../../../util/colors"
import {INPUT, STYLED_FOCUS, WITH_BORDER} from "../../../util/classes"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (str: string) => void
  border?: boolean
}

//eslint-disable-next-line react/display-name
const InputWithRef = forwardRef((
  {onValueChange, onChange, onFocus, className, border, ...props}: InputProps,
  ref?: React.Ref<HTMLInputElement>
) => {

  const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

  const handleFocus = (e) => {
    onFocus && onFocus(e)

    if (selfRef.current) {
      selfRef.current.selectionStart = selfRef.current.selectionEnd = -1
    }
  }

  return (
    <input
      {...props} ref={selfRef} type="text" autoComplete="off"
      className={makeClassName([INPUT, STYLED_FOCUS, className], [[WITH_BORDER, border]])}
      onFocus={handleFocus}
      onChange={e => {
        onChange && onChange(e)
        onValueChange && onValueChange(e.target.value)
      }}
    />
  )

})

export const SynchronizedInput = forwardRef<HTMLInputElement, InputProps>(
  function SynchronizedInput({value, onValueChange, ...props}: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const [inputValue, setInputValue] = useState(value)

    useEffect(
      () => {
        setInputValue(value)
      }, [value]
    )

    const handleChange = (text: string) => {
      setInputValue(text)
      onValueChange && onValueChange(text)
    }

    return (
      <Input ref={ref} {...props} onValueChange={handleChange} value={inputValue}/>
    )

  }
)

export const EditableInput = forwardRef<HTMLInputElement, InputProps>(
  function EditableInput(props: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)
    const [editable, , toggle] = watchOutsideClick(selfRef, {initialState: !props.onValueChange})

    const keyMap: Array<KeyMapping> = [
      {
        key: Key.Enter,
        handler: () => toggle(),
        modifiers: {shift: true}
      }
    ]

    useEffect(
      () => {
        if (props.onValueChange) {
          if (editable) {
            if (selfRef.current) {
              selfRef.current.selectionStart = selfRef.current.selectionEnd = -1
            }
          } else {
            if (selfRef.current) {
              selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
            }
          }
        }
      }, [editable]
    )

    return (
      <SynchronizedInput
        {...props} ref={selfRef} readOnly={!editable} data-editable={editable}
        onDoubleClick={() => props.onValueChange && toggle()} onKeyDown={e => useKey(e, keyMap)}
      />
    )

  }
)

export interface ColoredInputProps extends InputProps, ReactiveTextColor {
  onValueChange: (str: string) => void
  observe?: boolean
}

export const ColoredInput = (
  {
    onValueChange,
    value,
    defaultValue,
    observe,
    className,
    textColors,
    border,
    ...props
  }: ColoredInputProps
) => {

  const defaultColor = defaultValue?.toString() ?? value?.toString() ?? ""

  const [color, setColorState] = useState(value?.toString() ?? "")

  useEffect(
    () => {
      setColor(value?.toString() ?? "")
    }, [value]
  )

  useEffect(
    () => {
      if (observe) {
        getColor()
      }
    }, [color]
  )

  const setColor = (value: string) => {
    const hex = value.includes("#") ? value : "#" + value
    setColorState(hex)
  }

  //TODO check color validity
  const getColor = () => {
    if (color.length > 0) {
      onValueChange(color)
    } else {
      setColor(defaultColor)
      onValueChange(defaultColor)
    }
  }

  const keyMap: Array<KeyMapping> = [
    {key: Key.Enter, handler: getColor},
    {key: Key.Backspace, handler: () => setColor(defaultColor), condition: color.replaceAll("#", "").length == 0}
  ]

  return (
    <div className={makeClassName([INPUT, INPUT + "-color", STYLED_FOCUS, className], [[WITH_BORDER, border]])}>
      <ColorHelper
        colors={textColors ? {background: color, theme: textColors} : undefined}
        className={joinClass([STYLED_FOCUS, WITH_BORDER, "right", "snovy-inner-focus"])}
      >
        #
      </ColorHelper>
      <Input
        {...props} className="snovy-inner" value={color.replaceAll("#", "")}
        placeholder="Hex code" maxLength={8}
        onValueChange={setColor} onKeyDown={e => useKey(e, keyMap)} pattern="[a-f0-9]{6,8}"
        onBlur={() => getColor()}
      />
    </div>
  )

}

const Input = InputWithRef as (props: InputProps & { ref?: React.Ref<HTMLInputElement> }) => JSX.Element
export default Input