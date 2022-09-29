import React, {useEffect, useState} from "react"
import Input from "../snov/input/Input"
import ColorPicker from "../snov/input/ColorPicker"
import {Button} from "../snov/input/Button"
import {useTheme} from "@emotion/react"
import {WithColor, WithTitle} from "../../util/types"
import {joinClass} from "../../util/utils"
import {FORM} from "../../util/classes"

type FormOptions = {
  trapFocus?: boolean
}

export const defaultOptions: FormOptions = {
  trapFocus: true
}

export interface PassedFormProps<T extends WithTitle & WithColor> extends Omit<React.InputHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  selected?: T
  inputValue?: string
  onSubmit?: () => void,
}

export interface FormProps<T extends WithTitle & WithColor> extends PassedFormProps<T> {
  options?: FormOptions
  onAdd?: (item: T) => Promise<void>,
  onCreate?: (title: string, color: string) => Promise<T>,
  onUpdate?: (item: T | undefined) => Promise<T | undefined>,
  watches?: Array<string>
}

const SimpleForm = <T extends WithTitle & WithColor>(
  {
    className,
    selected,
    inputValue,
    onAdd,
    onCreate,
    onUpdate,
    onSubmit,
    watches,
    ...props
  }: FormProps<T>
) => {

  const [item, setItem] = useState<T | undefined>()
  const [title, setTitle] = useState(inputValue ?? "")
  const [color, setColor] = useState("")

  useEffect(
    () => {
      setItem(selected)
    }, [selected]
  )

  useEffect(
    () => {
      setTitle(item?.title ?? "")
      setColor(item?.color ?? "")
    }, [item]
  )

  useEffect(
    () => {
      if (item) {
        item.title = title
      }
    }, [title]
  )

  useEffect(
    () => {
      if (item) {
        item.color = color
      }
    }, [color]
  )

  const canSubmit = (isEdit = false) => {
    const notBlank = title.isNotBlank() && color.isNotBlank()

    if (isEdit) {
      return item && notBlank
    } else {
      return !watches.includes(title) && notBlank
    }
  }

  return (
    <form
      {...props} className={joinClass([FORM, "simple-form", className])} //tabIndex={-1}
      onSubmit={e => {
        e.preventDefault()
        onSubmit && onSubmit()
      }}
    >
      <ColorPicker
        selected={color} pick={setColor} textColors={useTheme()} options={{includeButton: true, absolute: true}}
      />
      <Input
        className={"title-input"} border placeholder="Title" onValueChange={setTitle} defaultValue={title}
      />
      <div className="snovy-form-buttons">
        {
          onAdd && onCreate &&
          <Button
            id="add-button" value="Create & apply" type="submit" disabled={!canSubmit()} border
            onClick={async () => await onAdd(await onCreate(title, color))}
          />
        }
        {
          onUpdate &&
          <Button
            id="save-button" value="Save" type="submit" disabled={!canSubmit(true)} border
            onClick={async () => await onUpdate(item)}
          />
        }
        {
          onCreate && !onAdd &&
          <Button
            id="create-button" value="Create" type="submit" disabled={!canSubmit()} border
            onClick={async () => await onCreate(title, color)}
          />
        }
      </div>
    </form>
  )

}

export default SimpleForm