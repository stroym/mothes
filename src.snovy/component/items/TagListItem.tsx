import React from "react"
import Tag from "../../data/model/Tag"
import {default as UniqueIcon} from "../../../public/icons/unique.svg"
import ColoredListItem from "../snov/item/ColoredListItem"

const TagListItem = ({tag, watch}: { tag: Tag, watch?: string }) => {

  return (
    <div className="snovy-tag-list-item">
      {
        tag.category &&
        <ColoredListItem
          className="category-detail" item={tag.category} watch={watch} colorIcon={tag.category.unique && <UniqueIcon/>}
        />
      }
      <ColoredListItem className="tag-detail" item={tag} watch={watch}/>
    </div>
  )

}

export default TagListItem