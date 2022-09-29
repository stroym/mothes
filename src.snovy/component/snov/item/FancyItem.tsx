import React, {forwardRef} from "react"
import {ColoredCustomItem, GenericItem, WithColor} from "../../../util/types"
import TinyStyle, {TextColorPair} from "../../../util/colors"
import {Button} from "../input/Button"
import {joinClass} from "../../../util/utils"

export interface FancyItemProps<T extends GenericItem & WithColor> extends React.HTMLProps<HTMLLIElement> {
  item: T,
  onRemove: (item: T) => void
  textColors?: TextColorPair
  custom?: ColoredCustomItem<T>
}

const FancyItem = forwardRef(<T extends GenericItem & WithColor>(
  {item, onRemove, custom, textColors, className, ...props}: FancyItemProps<T>,
  ref: React.Ref<HTMLElement>
) => {

  const tiny = textColors ? TinyStyle.withAdjustmentFromItem(item, textColors, 10) : undefined

  return (
    <span
      {...props} ref={ref} className={joinClass(["snovy-fancy-item snovy-multiselect-item", className])}
      style={tiny?.makeStyle()}
    >
      {
        custom ? custom(item, tiny) :
          <span className="snovy-fancy-item-part" style={tiny?.lighten(10)}>{item.toString()}</span>
      }
      <Button className="snovy-fancy-item-button" preset="remove" circular mono onClick={() => onRemove(item)}/>
    </span>
  )

})

FancyItem.displayName = "FancyItem"

export default FancyItem