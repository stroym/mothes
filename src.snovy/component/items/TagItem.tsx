import React, {useState} from "react"
import Tag from "../../data/model/Tag"
import {Button, ToggleButton} from "../snov/input/Button"
import Category from "../../data/model/Category"
import {useTheme} from "@emotion/react"
import TinyStyle from "../../util/colors"

interface BaseTagItemProps {
  mapped: Tag | Array<Tag>
  onRemove: (tag: Tag | Array<Tag>) => void
}

interface TagItemProps {
  mapped: Tag
  onRemove: (tag: Tag) => void
}

interface CategorizedTagItemProps extends BaseTagItemProps {
  category: Category
  mapped: Array<Tag>
}

export type InnerType = {
  mapped: Tag,
  tiny: TinyStyle
}

export const TagItemInner = ({mapped, tiny}: InnerType) => {

  return (
    <>
      {
        mapped.category &&
        <span className="snovy-fancy-item-part" style={tiny.lighten(20)}>
          {mapped.category.title}
        </span>
      }
      <span className="snovy-fancy-item-part" style={tiny.lighten(10)}>{mapped.title}</span>
    </>
  )

}

export const TagItem = ({mapped, onRemove}: TagItemProps) => {

  const tiny = TinyStyle.withAdjustmentFromItem(mapped, useTheme(), 10)

  return (
    <span className="snovy-tag-item snovy-fancy-item" style={tiny.makeStyle()}>
      <span className="snovy-fancy-item-part" style={tiny.lighten(10)}>{mapped.title}</span>
      <Button
        className="snovy-fancy-item-button" preset="remove" circular mono
        onClick={() => onRemove(mapped)}
      />
    </span>
  )

}

export const CategorizedTagItem = ({mapped, category, onRemove}: CategorizedTagItemProps) => {

  const tiny = TinyStyle.withAdjustmentFromItem(category, useTheme(), category.unique ? 20 : 10)

  if (category.unique) {
    return (
      <span className="snovy-tag-item snovy-fancy-item snovy-fancy-item-split" style={tiny.makeStyle()}>
        <span className="snovy-fancy-item-part" style={tiny.lighten(20)}>{category.title}</span>
        <span className="snovy-fancy-item-part" style={tiny.lighten(10)}>{mapped[0].title}</span>
        <Button
          className="snovy-fancy-item-button" preset="remove" circular mono
          onClick={() => onRemove(mapped)}
        />
      </span>
    )
  } else {

    const [collapsed, setCollapsed] = useState(false)

    return (
      <span className="snovy-tag-item snovy-fancy-item snovy-fancy-item-group" style={tiny.makeStyle()}>
        <div className="snovy-group-header">
          <ToggleButton preset="collapse" circular mono getState={setCollapsed}/>
          <span className="">{category.title}</span>
          <Button preset="remove" circular mono onClick={() => onRemove(mapped)}/>
        </div>
        {
          !collapsed &&
          <div className="snovy-fancy-container snovy-tag-container" style={tiny.lighten(50)}>
            {mapped.map(tag => <TagItem key={tag.toString()} mapped={tag} onRemove={onRemove}/>)}
          </div>
        }
      </span>
    )

  }

}