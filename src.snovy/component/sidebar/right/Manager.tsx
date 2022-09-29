import React, {useContext, useEffect, useState} from "react"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import TabMenu, {Orientation} from "../../snov/tab_menu/TabMenu"
import List from "../../snov/list/List"
import TabMenuItem from "../../snov/tab_menu/TabMenuItem"
import AppContext from "../../../util/AppContext"
import {useDefaultEmpty} from "../../../util/hooks"
import State from "../../../data/model/State"
import Tag, {sortTags} from "../../../data/model/Tag"
import Category from "../../../data/model/Category"
import TagListItem from "../../items/TagListItem"
import ColoredListItem from "../../snov/item/ColoredListItem"
import {Titled} from "../../../data/model/Base"
import TagForm from "../../inputs/TagForm"
import SimpleForm from "../../inputs/SimpleForm"

type Managed = Tag | Category | State

const Manager = () => {

  const appContext = useContext(AppContext)

  const mappings = {
    tags: "Tags",
    categories: "Categories",
    states: "States"
  }

  const [active, setActive] = useState(mappings.tags)
  const [currentItems, setCurrentItems, addItem, removeItem] = useDefaultEmpty<Managed>()
  const [selected, setSelected] = useState<Managed | undefined>()

  //TODO prompt to delete category when all tags belonging to it are deleted
  // offer options as to what to do with tags on category delete (attempt to migrate to plain/another category, or delete)

  //TODO add notebook?

  useEffect(
    () => {
      if (active == mappings.tags) {
        setCurrentItems(sortTags(appContext.tags))
      } else if (active == mappings.categories) {
        setCurrentItems(appContext.categories.sort(Titled.compareByTitle))
      } else if (active == mappings.states) {
        setCurrentItems(appContext.states.sort(Titled.compareByTitle))
      } else {
        setCurrentItems([])
      }

      setSelected(undefined)
    }, [active]
  )

  return (
    <SidebarContent
      id="manager-view"
      heading={
        <TabMenu orientation={Orientation.TOP}>
          <TabMenuItem
            itemId={mappings.tags} active={active == mappings.tags} onClick={() => setActive(mappings.tags)}
          />
          <TabMenuItem
            itemId={mappings.categories} active={active == mappings.categories}
            onClick={() => setActive(mappings.categories)}
          />
          <TabMenuItem
            itemId={mappings.states} active={active == mappings.states} onClick={() => setActive(mappings.states)}
          />
        </TabMenu>
      }
      footing={
        <List
          items={currentItems} onSelect={setSelected} selected={selected ? [selected] : []}
          customItem={active == mappings.tags ? item => <TagListItem tag={item as Tag}/> :
            item => <ColoredListItem item={item}/>
          }
          onItemRemove={async item => {
            removeItem(item)
            await item.delete()
          }}
        />
      }
    >
      {
        active == mappings.tags && <TagForm selected={selected as Tag} onCreate={addItem}/>
      }
      {
        active == mappings.categories &&
        <SimpleForm<Category>
          selected={selected as Category}
          watches={appContext.categories.map(it => it.toString())}
          onCreate={async (title, color) => await new Category(title, color).save()}
          onUpdate={async (item) => await item?.save()}
        />
      }
      {
        active == mappings.states &&
        <SimpleForm<State>
          selected={selected as State}
          watches={appContext.states.map(it => it.toString())}
          onCreate={async (title, color) => await new State(title, color).save()}
          onUpdate={async (item) => await item?.save()}
        />
      }
    </SidebarContent>
  )

}

export default Manager