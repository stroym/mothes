import React, {ButtonHTMLAttributes, forwardRef, useEffect} from "react"
import {makeClassName} from "../../../util/utils"
import {default as AddIcon} from "../../../../public/icons/add.svg"
import {default as CollapsedIcon} from "../../../../public/icons/expanded.svg"
import {default as ExpandedIcon} from "../../../../public/icons/collapsed.svg"
import {default as CheckIcon} from "../../../../public/icons/checked.svg"
import {default as RemoveIcon} from "../../../../public/icons/remove.svg"
import {default as CodeOffButton} from "../../../../public/icons/code_off.svg"
import {default as EditButton} from "../../../../public/icons/edit.svg"
import {useToggle} from "../../../util/hooks"
import {I_ACTIVE, STYLED_HOVER, STYLED_HOVER_FILL, WITH_BORDER} from "../../../util/classes"

type Presets = "provided" | "remove" | "add" | "collapse" | "check" | "confirm" | "inverted_collapse" | "source"

//TODO use htmlattributes rather than react.htmlprops everywhere
export interface ButtonProps extends ButtonHTMLAttributes<never> {
  preset?: Presets
  mono?: boolean
  circular?: boolean
  toggled?: boolean
  border?: boolean
  color?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      children,
      value,
      defaultValue,
      preset,
      mono,
      circular,
      toggled,
      color,
      border,
      type,
      style,
      ...props
    }: ButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) {

    function resolvePreset() {
      switch (preset) {
        case "add":
          return <AddIcon/>
        case "collapse":
          return toggled ? <CollapsedIcon/> : <ExpandedIcon/>
        case "inverted_collapse":
          return toggled ? <ExpandedIcon/> : <CollapsedIcon/>
        case "confirm":
          return <CheckIcon/>
        case "check":
          return toggled ? <CheckIcon/> : ""
        case "source":
          return toggled ? <CodeOffButton/> : <EditButton/>
        case "remove":
          return <RemoveIcon/>
        default:
          return children
      }
    }

    return (
      <button
        ref={ref} {...props} type={type ?? "button"}
        className={makeClassName(
          ["snovy-button", STYLED_HOVER, className],
          [
            ["snovy-button-circular", circular],
            ["snovy-color-button", color],
            ["svg-button " + preset, preset],
            [WITH_BORDER, border],
            [I_ACTIVE, toggled && !mono],
            [STYLED_HOVER_FILL, !mono]
          ]
        )}
        style={{
          color: "inherit",
          backgroundColor: color,
          ...style
        }}
      >
        {preset ? resolvePreset() : value || defaultValue || children}
      </button>
    )

  }
)

export interface ToggleButtonProps extends ButtonProps {
  getState?: (toggled: boolean) => void
  setState?: boolean
}

//TODO try to use           <input type={"checkbox"}/>
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {onClick, getState, setState, ...props}: ToggleButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) {

    const [toggled, setToggled, toggle] = useToggle()

    useEffect(
      () => {
        if (setState != undefined) {
          setToggled(setState)
        }
      }, [setState]
    )

    const handleClick = (e) => {
      onClick && onClick(e)
      getState && getState(!toggled)
      toggle()
    }

    return <Button {...props} ref={ref} toggled={toggled} onClick={handleClick}/>
  }
)
