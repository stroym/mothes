import React, {useEffect, useRef} from "react"
import {joinClass, makeClassName} from "../../../../util/utils"
import {ABSOLUTE, DROPDOWN, I_ACTIVE, I_HIGHLIGHT, SIMPLE_LI, WITH_BORDER} from "../../../../util/classes"
import {DownShiftBorders, DownShiftOptions, highlightSearchedText} from "./downshiftUtils"
import {useDropdown} from "../../../../util/hooks"
import {GetPropsCommonOptions, UseComboboxGetItemPropsOptions, UseComboboxGetMenuPropsOptions} from "downshift"
import {GenericItem, WatchableCustomItem} from "../../../../util/types"
import memoize from "fast-memoize"

export interface DropdownProps<T extends GenericItem> extends React.HTMLAttributes<HTMLDivElement> {
  getMenuProps: (options?: UseComboboxGetMenuPropsOptions, otherOptions?: GetPropsCommonOptions) => unknown
  getItemProps: (options: UseComboboxGetItemPropsOptions<T>) => unknown
  isOpen: boolean
  closeMenu: () => void
  inputValue: string
  dropdownItems: Array<T>
  selectedItem?: T
  highlightedIndex: number
  addItem?: (inputValue: string) => T | Promise<T>
  customItem?: WatchableCustomItem<T>,
  borders?: DownShiftBorders
  parentRef: React.RefObject<HTMLDivElement>
  options: DownShiftOptions
  getDirection?: (direction: boolean) => void
}

const DownshiftDropdown = <T extends GenericItem>(
  {
    className,
    getMenuProps,
    getItemProps,
    isOpen,
    inputValue,
    selectedItem,
    highlightedIndex,
    dropdownItems,
    addItem,
    customItem,
    borders,
    closeMenu,
    parentRef,
    options,
    getDirection
  }: DropdownProps<T>
) => {

  const selfRef = useRef(null)
  const getItemPropsMemoRef = useRef(getItemProps)

  const overflowStyle = useDropdown(selfRef, parentRef, isOpen, closeMenu, dropdownItems.length,
    {itemNesting: 1, maxItems: 12, offset: borders?.dropdown ? 1 : 0, useParentWidth: options.wideDropdown}
  )

  useEffect(
    () => {
      getItemPropsMemoRef.current = memoize(getItemProps, {
        serializer: args => {
          return `it${args["item"]}:ind${args["index"]}`
        }
      })
    }, [dropdownItems]
  )

  const makeInfoItem = (value: string, ...className: Array<string>) => (
    <li className={joinClass(["snovy-dropdown-item", "info-dropdown-item", ...className])}>
      {value}
    </li>
  )

  const getStyle = () => {
    const style = overflowStyle()

    useEffect(
      () => {
        getDirection && getDirection(!style.bottom)
      }, [isOpen]
    )

    return style
  }

  //FIXME keys when there are multiple selects with the same items in dom
  return (
    <div
      {...getMenuProps({ref: selfRef})} data-visible={isOpen} style={getStyle()}
      className={makeClassName([DROPDOWN, ABSOLUTE, "snovy-scroll", className], [[WITH_BORDER, borders?.dropdown]])}
    >
      <ol className={DROPDOWN + "-content"}>
        {
          !inputValue.isBlank() && addItem && makeInfoItem("Pressing Enter will create " + inputValue + "...")
        }
        {
          dropdownItems.map((item, index) => (
            <li {...getItemPropsMemoRef.current({item, index})} key={`${index}-${item}`}
                className={makeClassName(
                  [DROPDOWN + "-item"],
                  [
                    [I_HIGHLIGHT, index == highlightedIndex],
                    [I_ACTIVE, item.toString() == selectedItem?.toString()] //FIXME this technically works, but...
                  ]
                )}
            >
              {
                customItem ?
                  customItem(item, inputValue) :
                  <div className={SIMPLE_LI} tabIndex={0}>
                    {highlightSearchedText(item.toString(), inputValue)}
                  </div>
              }
            </li>
          ))
        }
        {
          dropdownItems.isEmpty() && makeInfoItem("No matching items found", "snovy-dropdown-no-match")
        }
      </ol>
    </div>
  )

}

export default DownshiftDropdown