import React, {useEffect, useRef, useState} from "react"
import {useCombobox, useMultipleSelection, UseMultipleSelectionReturnValue} from "downshift"
import {useDefaultEmpty} from "../../../../util/hooks"
import {combineOptions, makeClassName} from "../../../../util/utils"
import {ColoredCustomItem, GenericItem, WatchableCustomItem, WithColor} from "../../../../util/types"
import {defaultOptions, DownShiftProps, onInputChange, onIsOpenChange} from "./downshiftUtils"
import DownshiftDropdown from "./DownshiftDropdown"
import DownshiftContainer from "./DownshiftContainer"
import DownshiftLabel from "./DownshiftLabel"
import FancyItem from "../../item/FancyItem"
import {TextColorPair} from "../../../../util/colors"
import {RadioButtonGroup} from "../RadioButtonGroup"
import {STYLED_FOCUS, WITH_BORDER} from "../../../../util/classes"

export interface MultiSelectProps<T extends GenericItem & WithColor> extends DownShiftProps<T> {
  selected?: Array<T>
  onSelectedChange?: (active: Array<T>) => void
  addItem?: (inputValue: string) => T | Promise<T>
  customItem?: WatchableCustomItem<T>
  selectedItemsStyle?: {
    textColors: TextColorPair
    customItem?: ColoredCustomItem<T>
    className?: string
  }
  mode?: { name: string, get: (mode: string) => void, initial?: string }
}

//TODO move spawn up from combobox, use modes (spawn type = dropdown/below)
const MultiSelect = <T extends GenericItem & WithColor>(
  {
    items,
    itemSort,
    label,
    addItem,
    customItem,
    selectedItemsStyle,
    options: passedOptions,
    className,
    selected,
    onSelectedChange,
    mode,
    borders,
    placeholder,
    id
  }: MultiSelectProps<T>
) => {

  const options = combineOptions(passedOptions, defaultOptions)

  const [dropdownItems, setDropdownItems] = useDefaultEmpty<T>(items)
  const [dropdownDirection, setDropdownDirection] = useState<boolean>()

  const comboRef = useRef<HTMLDivElement>(null)

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    setSelectedItems
  }: UseMultipleSelectionReturnValue<T> = useMultipleSelection({
    itemToString: item => item ? item.toString() : "",
    onSelectedItemsChange: changes => onSelectedChange(changes.selectedItems)
  })

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    getComboboxProps,
    getLabelProps,
    inputValue,
    highlightedIndex,
    setInputValue,
    setHighlightedIndex,
    closeMenu,
    toggleMenu,
    reset
  } = useCombobox({
    defaultHighlightedIndex: 0,
    items: dropdownItems,
    selectedItem: null,
    itemToString: item => item ? item.toString() : "",
    onInputValueChange: changes => onInputChange(changes, items, setDropdownItems, setHighlightedIndex, addItem),
    onIsOpenChange: changes => onIsOpenChange(changes, setInputValue),
    onStateChange: ({type, selectedItem}) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue("")
            addSelectedItem(selectedItem)
          }
          break
        default:
          break
      }
    }
  })

  useEffect(
    () => {
      const filteredItems = items.filter(item => !selectedItems.find(it => it.toString() == item.toString()))

      setDropdownItems(itemSort ? filteredItems?.sort(itemSort) : filteredItems)
    }, [items, selectedItems.length]
  )

  useEffect(
    () => {
      if (selected) {
        setSelectedItems(selected)
      } else {
        reset()
      }
    }, [selected]
  )

  return (
    <>
      {
        label &&
          <DownshiftLabel getLabelProps={getLabelProps} value={label.value} title={label.title}/>
      }
      <div ref={comboRef} className={makeClassName(["snovy-multiselect", STYLED_FOCUS], [[WITH_BORDER, borders.main]])}>
        <DownshiftContainer<T>
          id={id} className={className} placeholder={placeholder}
          getContainerProps={getComboboxProps} getToggleButtonProps={getToggleButtonProps}
          getInputProps={props => getInputProps(getDropdownProps(props))}
          isOpen={isOpen} toggleMenu={toggleMenu} reset={reset}
          options={options} borders={borders} data-direction={dropdownDirection}
        />
        <div className="snovy-multiselect-container snovy-fancy-container">
          {
            selectedItems.map((selectedItem, index) => (
              <FancyItem
                {...getSelectedItemProps({selectedItem, index})} key={`selected-item-${index}`}
                item={selectedItem} onRemove={removeSelectedItem} className={selectedItemsStyle?.className}
                custom={selectedItemsStyle?.customItem} textColors={selectedItemsStyle?.textColors}
              />
            ))
          }
        </div>
        {
          mode &&
            <RadioButtonGroup label={"Mode:"} group={mode.name} get={mode.get} initial={mode.initial ?? "OR"}>
              {["AND", "OR"]}
            </RadioButtonGroup>
        }
      </div>
      <DownshiftDropdown<T>
        getMenuProps={getMenuProps} getItemProps={getItemProps} isOpen={isOpen} inputValue={inputValue}
        dropdownItems={dropdownItems} highlightedIndex={highlightedIndex} customItem={customItem} addItem={addItem}
        options={options} borders={borders} parentRef={comboRef} closeMenu={closeMenu}
        getDirection={setDropdownDirection}
      />
    </>
  )

}

export default MultiSelect