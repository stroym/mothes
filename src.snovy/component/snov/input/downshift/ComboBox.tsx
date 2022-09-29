import React, {useEffect, useRef, useState} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {useDefaultEmpty, watchOutsideClick} from "../../../../util/hooks"
import {combineOptions, KeyMapping, makeClassName} from "../../../../util/utils"
import {Key} from "ts-key-enum"
import {ToggleButton} from "../Button"
import {GenericItem, WatchableCustomItem} from "../../../../util/types"
import {COMBO_SPAWN, WITH_BORDER} from "../../../../util/classes"
import {defaultOptions, onInputChange, onIsOpenChange, onSelectedItemChange} from "./downshiftUtils"
import DownshiftDropdown from "./DownshiftDropdown"
import DownshiftContainer from "./DownshiftContainer"
import {SelectProps} from "./Select"

export interface ComboBoxProps<T extends GenericItem> extends SelectProps<T> {
  addItem?: (inputValue: string) => T | Promise<T>
  customItem?: WatchableCustomItem<T>
  spawn?: (forwardValue: string, setVisible: (visible: boolean) => void) => React.ReactElement
}

const ComboBox = <T extends GenericItem>(
  {
    items,
    itemSort,
    label,
    addItem,
    customItem,
    spawn,
    options: passedOptions,
    className,
    selected,
    onSelect,
    borders,
    placeholder,
    id
  }: ComboBoxProps<T>
) => {

  const options = combineOptions(passedOptions, defaultOptions)

  const [dropdownItems, setDropdownItems, addDropdownItem] = useDefaultEmpty<T>(items)
  const [dropdownDirection, setDropdownDirection] = useState<boolean>()

  const comboRef = useRef<HTMLDivElement>(null)
  const spawnRef = useRef<HTMLDivElement>(null)

  const [spawnVisible, setSpawnVisible, toggleSpawnVisible] = watchOutsideClick(comboRef, {otherRefs: [spawnRef]})

  const stateReducer = (state: UseComboboxState<T>, stateChange: UseComboboxStateChangeOptions<T>) => {
    const {InputKeyDownEscape, FunctionToggleMenu, ToggleButtonClick, InputBlur} = useCombobox.stateChangeTypes
    const {type, changes} = stateChange

    if ((type == FunctionToggleMenu || type == ToggleButtonClick) && changes.isOpen) {
      setSpawnVisible(false)
    }

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
    defaultHighlightedIndex: 0,
    items: dropdownItems,
    itemToString: item => item ? item.toString() : "",
    stateReducer: stateReducer,
    onInputValueChange: changes => onInputChange(changes, items, setDropdownItems, setHighlightedIndex, addItem),
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
        if (addItem) {
          const newItem = await addItem(inputValue) //TODO reducer could do this, but not the async part...
          addDropdownItem(newItem)
          selectItem(newItem)
        }

        if (!dropdownItems.isEmpty()) {
          selectItem(dropdownItems[highlightedIndex])
        } else {
          if (spawn) {
            setSpawnVisible(true)
          }
        }

        closeMenu()
      },
      condition: !inputValue.isBlank()
    }
  ]

  return (
    <>
      <DownshiftContainer
        ref={comboRef} id={id} className={className} placeholder={placeholder}
        getContainerProps={getComboboxProps} getLabelProps={getLabelProps}
        getInputProps={getInputProps} getToggleButtonProps={getToggleButtonProps}
        isOpen={isOpen} selectedItem={selectedItem} toggleMenu={toggleMenu} reset={reset}
        options={options} borders={borders} keyMap={keyMap} label={label} data-direction={dropdownDirection}
      >
        {
          spawn &&
          <ToggleButton
            preset="add" circular setState={spawnVisible}
            onClick={() => {
              closeMenu()
              toggleSpawnVisible()
            }}
          />
        }
      </DownshiftContainer>
      {
        spawn && spawnVisible &&
        <div
          ref={spawnRef} id={id + "-spawn"}
          className={makeClassName([COMBO_SPAWN, className], [[WITH_BORDER, borders?.dropdown]])}
        >
          {
            spawnVisible && spawn(inputValue, setSpawnVisible)
          }
        </div>
      }
      <DownshiftDropdown
        getMenuProps={getMenuProps} getItemProps={getItemProps} isOpen={isOpen} inputValue={inputValue}
        dropdownItems={dropdownItems} selectedItem={selectedItem} highlightedIndex={highlightedIndex}
        customItem={customItem} addItem={addItem} options={options} borders={borders} parentRef={comboRef}
        closeMenu={closeMenu} getDirection={setDropdownDirection}
      />
    </>
  )

}

export default ComboBox