import React, {forwardRef, useEffect} from "react"
import ListItem from "./ListItem"
import {areArrayContentsIdentical, combineOptions, joinClass, KeyMapping, useKey} from "../../../util/utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../../util/hooks"
import {CustomItem, GenericItem, UpdatableCustomItem} from "../../../util/types"
import {LIST} from "../../../util/classes"

export interface ListableProps<T extends GenericItem> extends Omit<React.HTMLProps<HTMLOListElement>, "onSelect" | "type" | "selected" | "label"> {
  items: Array<T> | undefined
  itemSort?: (a: T, B: T) => number
  onSelect?: (active: T | undefined) => void
  selected?: T | Array<T>
  customItem?: CustomItem<T>
  label?: { value: string, title?: string }
}

export type ListPresets = "simple" | "editable"

export type ListOptions = {
  readonly?: boolean
  useMultiSelect?: boolean
  preset?: ListPresets
}

const defaultOptions: ListOptions = {
  readonly: false,
  useMultiSelect: true,
  preset: undefined
}

//TODO arrow-key nav
//TODO on enter activate focused item
export interface ListProps<T extends GenericItem> extends ListableProps<T> {
  selected?: Array<T>
  defaultSelected?: T
  customItem?: UpdatableCustomItem<T>
  onMultiSelect?: (selected: Array<T>) => void
  onContext?: (active: T | undefined) => void
  onItemValueChange?: (str: string) => void
  onItemRemove?: (item: T) => void
  options?: ListOptions
}

//eslint-disable-next-line react/display-name
const ListWithRef = forwardRef(<T extends GenericItem>(
  {
    items,
    itemSort,
    selected,
    defaultSelected,
    onMultiSelect,
    onSelect,
    onContext,
    onItemValueChange,
    onItemRemove,
    options: passedOptions,
    customItem,
    children,
    className,
    ...props
  }: ListProps<T>,
  ref?: React.Ref<HTMLOListElement>
) => {

  const options = combineOptions(passedOptions, defaultOptions)

  const {
    activeItem,
    selectedItems,
    setSelectedItems,
    handleItemClick,
    resetSelection
  } = useMultiSelect<T>(items ? itemSort ? items?.sort(itemSort) : items : [])

  const keyMap: Array<KeyMapping> = [
    {key: Key.Escape, handler: resetSelection}
  ]

  useEffect(
    () => {
      defaultSelected && !areArrayContentsIdentical(selectedItems, [defaultSelected]) && setSelectedItems([defaultSelected])
    }, [defaultSelected]
  )

  useEffect(
    () => {
      selected && !areArrayContentsIdentical(selectedItems, selected) && setSelectedItems(selected)
    }, [selected]
  )

  useEffect(
    () => {
      onMultiSelect && !areArrayContentsIdentical(selectedItems, selected) && onMultiSelect(selectedItems)
      onSelect && activeItem != selected?.first() && onSelect(activeItem)
    }, [selectedItems]
  )

  return (
    <ol
      {...props} ref={ref} className={joinClass([LIST, "snovy-scroll", className])} tabIndex={-1}
      data-disabled={!items?.length} onKeyDown={e => useKey(e, keyMap)}
    >
      {
        items?.map((item, index) =>
          <ListItem
            key={`${index}-${item}`} item={item} preset={options.preset} customItem={customItem}
            onValueChange={onItemValueChange} onRemove={onItemRemove}
            selected={selectedItems.includes(item)} active={activeItem == item}
            onSelect={handleItemClick} onContext={onContext}
          />
        )
      }
      {children}
    </ol>
  )

})

const List = ListWithRef as <T extends GenericItem>(props: ListProps<T> & { ref?: React.Ref<HTMLOListElement> }) => JSX.Element
export default List