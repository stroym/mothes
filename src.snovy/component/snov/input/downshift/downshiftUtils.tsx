import {GenericItem} from "../../../../util/types"
import {useCombobox, UseComboboxStateChange} from "downshift"
import {Collection} from "../../../../util/hooks"
import React from "react"
import {ListableProps} from "../../list/List"

export interface DownShiftProps<T extends GenericItem> extends ListableProps<T> {
  borders?: DownShiftBorders
  options?: DownShiftOptions
}

export type DownShiftBorders = {
  main?: boolean
  dropdown?: boolean
}

export type DownShiftOptions = {
  selectPreviousOnEsc?: boolean
  resetOnSelect?: boolean
  wideDropdown?: boolean
  allowDeselect?: boolean
}

export const defaultOptions: DownShiftOptions = {
  selectPreviousOnEsc: true,
  resetOnSelect: false,
  wideDropdown: false,
  allowDeselect: true
}

//TODO border options

//TODO debounce
export function highlightSearchedText(text: string, partial?: string) {
  if (partial) {
    const position = text.indexOf(partial)

    if (position != -1) {
      return (
        <span>
          {text.substring(0, position)}
          <span className="snovy-highlight-helper">{partial}</span>
          {text.substring(position + partial.length)}
        </span>
      )
    }
  }

  return text
}

export function onInputChange<T extends GenericItem>(
  changes: UseComboboxStateChange<T>,
  items: Array<T> | undefined,
  setDropdownItems: (items: Collection<T>) => void,
  setHighlightedIndex: (index: number) => void,
  addItem?: ((inputValue: string) => (Promise<T> | T)) | undefined
) {
  const {inputValue, selectedItem} = changes

  const target = inputValue ?? ""

  if (target.isBlank() && selectedItem) {
    setDropdownItems(items)
    setHighlightedIndex(items?.indexOf(selectedItem) ?? -1)
  } else {
    const filteredItems = items?.filter(item =>
      item.toString().toLowerCase().includes(target.toLowerCase().trim())
    )

    setDropdownItems(filteredItems)

    if (filteredItems && !addItem) {
      const item = filteredItems.first()

      if (item) {
        setHighlightedIndex(filteredItems.indexOf(item))
      }
    }
  }
}

export function onIsOpenChange<T extends GenericItem>(
  changes: UseComboboxStateChange<T>,
  setInputValue: (value: string) => void
) {
  const {FunctionToggleMenu} = useCombobox.stateChangeTypes
  const {isOpen, selectedItem, inputValue, type} = changes

  if (isOpen) {
    if (type == FunctionToggleMenu) {
      setInputValue("")
    } else {
      setInputValue(inputValue)
    }
  } else {
    setInputValue(selectedItem?.toString() ?? "")
  }
}

export function onSelectedItemChange<T extends GenericItem>(
  options: DownShiftOptions,
  changes: UseComboboxStateChange<T>,
  selected: T | undefined,
  closeMenu: () => void,
  reset: () => void,
  onSelect?: (item: T | undefined) => void
) {
  const {selectedItem} = changes

  if (selectedItem != selected) {
    onSelect && onSelect(selectedItem ?? undefined)
  }

  if (options.resetOnSelect) {
    reset()
  }

  closeMenu()
}
