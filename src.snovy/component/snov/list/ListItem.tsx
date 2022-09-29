import React, {useCallback} from "react"
import {EditableInput} from "../input/Input"
import {GenericItem, UpdatableCustomItem} from "../../../util/types"
import {makeClassName} from "../../../util/utils"
import {I_ACTIVE, I_SELECT, LI, SIMPLE_LI, STYLED_HOVER_FILL} from "../../../util/classes"
import {ListPresets} from "./List"
import {Button} from "../input/Button"

export interface ListItemProps<T extends GenericItem> extends Omit<React.HTMLProps<HTMLLIElement>, "onSelect"> {
  item: T
  active: boolean
  selected: boolean
  onSelect: (item: T) => void
  onContext?: (item: T) => void
  onValueChange?: (str: string) => void
  onRemove?: (item: T) => void
  preset?: ListPresets
  customItem?: UpdatableCustomItem<T>
}

const ListItem = <T extends GenericItem>(
  {
    className,
    item,
    active,
    selected,
    onSelect,
    onContext,
    onValueChange,
    customItem,
    preset,
    onRemove,
    ...props
  }: ListItemProps<T>
) => {

  const resolvePreset = useCallback(
    () => {
      switch (preset) {
        case "editable":
          return <EditableInput placeholder="Title" onValueChange={onValueChange} value={item.toString()}/>
        case "simple":
          return <div className={SIMPLE_LI} tabIndex={0}>{item.toString()}</div>
      }
    }, [preset]
  )

  return (
    <li
      {...props}
      className={makeClassName([LI, STYLED_HOVER_FILL, className], [[I_SELECT, selected], [I_ACTIVE, active]])}
      onClick={e => {!e.isDefaultPrevented() && onSelect(item)}}
      onContextMenu={e => {
        e.stopPropagation()
        onContext && onContext(item)
      }}
    >
      {resolvePreset()}
      {
        customItem && customItem(item, onValueChange)
      }
      {
        onRemove &&
        <Button
          circular preset="remove" border
          onClick={e => {
            e.stopPropagation()
            onRemove(item)
          }}
        />
      }
    </li>
  )

}

export default ListItem