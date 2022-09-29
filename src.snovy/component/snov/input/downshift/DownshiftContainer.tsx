import React, {forwardRef} from "react"
import {KeyMapping, makeClassName, useKey} from "../../../../util/utils"
import {COMBO_BOX, STYLED_FOCUS, WITH_BORDER} from "../../../../util/classes"
import {
  GetPropsCommonOptions,
  UseComboboxGetComboboxPropsOptions,
  UseComboboxGetInputPropsOptions,
  UseComboboxGetLabelPropsOptions,
  UseComboboxGetToggleButtonPropsOptions
} from "downshift"
import {GenericItem} from "../../../../util/types"
import Input, {InputProps} from "../Input"
import {Button, ToggleButton} from "../Button"
import {DownShiftBorders, DownShiftOptions} from "./downshiftUtils"
import DownshiftLabel from "./DownshiftLabel"

export interface ContainerProps<T extends GenericItem> extends React.HTMLAttributes<HTMLDivElement> {
  getContainerProps: (options?: (UseComboboxGetComboboxPropsOptions | undefined), otherOptions?: (GetPropsCommonOptions | undefined)) => unknown
  getLabelProps?: (options?: (UseComboboxGetLabelPropsOptions | undefined)) => unknown
  getInputProps: (options?: (UseComboboxGetInputPropsOptions | undefined), otherOptions?: (GetPropsCommonOptions | undefined)) => unknown
  getToggleButtonProps: (options?: (UseComboboxGetToggleButtonPropsOptions | undefined)) => unknown
  isOpen: boolean
  selectedItem?: T
  keyMap?: Array<KeyMapping>
  borders?: DownShiftBorders //TODO default options (true, true)
  options: DownShiftOptions
  label?: { value: string, title?: string }
  toggleMenu: () => void
  reset: () => void
}

const DownshiftContainerWithRef = forwardRef(<T extends GenericItem>(
  {
    id,
    className,
    placeholder,
    children,
    getContainerProps,
    getLabelProps,
    getInputProps,
    getToggleButtonProps,
    isOpen,
    selectedItem,
    borders,
    options,
    keyMap,
    toggleMenu,
    reset,
    label,
    ...props
  }: ContainerProps<T>,
  ref?: React.Ref<HTMLDivElement>
) => {

  return (
    <>
      {
        label &&
        <DownshiftLabel id={id && id + "-label"} getLabelProps={getLabelProps} value={label.value} title={label.title}/>
      }
      <div
        {...props} {...getContainerProps({ref: ref})} id={id}
        className={makeClassName([COMBO_BOX, STYLED_FOCUS, className], [[WITH_BORDER, borders?.main]])}
      >
        <Input
          {...getInputProps({
            placeholder: placeholder,
            onKeyDown: e => keyMap ? useKey(e, keyMap) : e,
            onClick: toggleMenu
          }) as InputProps}
        />
        {
          options.allowDeselect && selectedItem && <Button preset="remove" circular onClick={reset}/>
        }
        <ToggleButton
          {...getToggleButtonProps()} preset="collapse" circular setState={isOpen} tabIndex={0} aria-label="toggle menu"
        />
        {
          children
        }
      </div>
    </>
  )

})

DownshiftContainerWithRef.displayName = "DownshiftContainerWithRef"

const DownshiftContainer = DownshiftContainerWithRef as <T extends GenericItem>(props: ContainerProps<T> & { ref?: React.Ref<HTMLDivElement> }) => JSX.Element
export default DownshiftContainer
