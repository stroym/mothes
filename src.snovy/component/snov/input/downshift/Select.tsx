import React, {useEffect, useRef, useState} from "react"
import {GenericItem} from "../../../../util/types"
import DownshiftContainer from "./DownshiftContainer"
import {combineOptions, joinClass, KeyMapping} from "../../../../util/utils"
import {COMBO_BOX} from "../../../../util/classes"
import DownshiftDropdown from "./DownshiftDropdown"
import {useDefaultEmpty} from "../../../../util/hooks"
import {defaultOptions, DownShiftProps, onInputChange, onIsOpenChange, onSelectedItemChange} from "./downshiftUtils"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {Key} from "ts-key-enum"

export interface SelectProps<T extends GenericItem> extends DownShiftProps<T> {
  selected?: T
}

const Select = <T extends GenericItem>(
  {
    items,
    itemSort,
    label,
    customItem,
    options: passedOptions,
    className,
    selected,
    onSelect,
    borders,
    placeholder,
    id
  }: SelectProps<T>
) => {

  const options = combineOptions(passedOptions, defaultOptions)

  const [dropdownItems, setDropdownItems] = useDefaultEmpty<T>(items)
  const [dropdownDirection, setDropdownDirection] = useState<boolean>()

  const comboRef = useRef<HTMLDivElement>(null)

  const stateReducer = (state: UseComboboxState<T>, stateChange: UseComboboxStateChangeOptions<T>) => {
    const {InputKeyDownEscape, InputBlur} = useCombobox.stateChangeTypes
    const {type, changes} = stateChange

    if (options.selectPreviousOnEsc && type == InputKeyDownEscape) {
      return {...changes, selectedItem: state.selectedItem, inputValue: state.inputValue}
    } else if (changes.selectedItem !== undefined && type == InputBlur) {
      return {...changes, selectedItem: selectedItem}
    }

    return changes
  }

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    getLabelProps,
    inputValue,
    selectedItem,
    highlightedIndex,
    selectItem,
    setInputValue,
    setHighlightedIndex,
    closeMenu,
    toggleMenu,
    reset
  } = useCombobox({
    items: dropdownItems,
    itemToString: item => item ? item.toString() : "",
    stateReducer: stateReducer,
    onInputValueChange: changes => onInputChange(changes, items, setDropdownItems, setHighlightedIndex),
    onIsOpenChange: changes => onIsOpenChange(changes, setInputValue),
    onSelectedItemChange: changes => onSelectedItemChange(options, changes, selected, closeMenu, reset, onSelect)
  })

  useEffect(
    () => {
      setDropdownItems(itemSort ? items?.sort(itemSort) : items)
    }, [items]
  )

  useEffect(
    () => {
      if (selected) {
        selectItem(selected)
      } else {
        reset()
      }
    }, [selected]
  )

  const keyMap: Array<KeyMapping> = [
    {
      key: Key.Enter,
      handler: async () => {
        if (!dropdownItems.isEmpty()) {
          selectItem(dropdownItems[highlightedIndex])
        }

        closeMenu()
      },
      condition: !inputValue.isBlank()
    }
  ]

  return (
    <>
      <DownshiftContainer
        ref={comboRef} id={id} className={joinClass([COMBO_BOX, className])} placeholder={placeholder}
        getContainerProps={getComboboxProps} getLabelProps={getLabelProps}
        getInputProps={getInputProps} getToggleButtonProps={getToggleButtonProps}
        isOpen={isOpen} selectedItem={selectedItem} toggleMenu={toggleMenu} reset={reset}
        options={options} borders={borders} keyMap={keyMap} label={label} data-direction={dropdownDirection}
      >
      </DownshiftContainer>
      <DownshiftDropdown
        getMenuProps={getMenuProps} getItemProps={getItemProps} isOpen={isOpen} inputValue={inputValue}
        dropdownItems={dropdownItems} selectedItem={selectedItem} highlightedIndex={highlightedIndex}
        customItem={customItem} options={options} borders={borders} parentRef={comboRef} closeMenu={closeMenu}
        getDirection={setDropdownDirection}
      />
    </>
  )

}

export default Select