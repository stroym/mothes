import React, {useContext, useEffect} from "react"
import Tag, {sortTags} from "../../../data/model/Tag"
import {CategorizedTagItem, TagItem} from "../../items/TagItem"
import Category from "../../../data/model/Category"
import TagForm from "../../inputs/TagForm"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import ComboBox from "../../snov/input/downshift/ComboBox"
import TagListItem from "../../items/TagListItem"
import AppContext from "../../../util/AppContext"
import State from "../../../data/model/State"
import {Titled} from "../../../data/model/Base"
import ColoredListItem from "../../snov/item/ColoredListItem"
import {useDefaultEmpty} from "../../../util/hooks"
import SimpleForm from "../../inputs/SimpleForm"

const Detail = () => {

  const appContext = useContext(AppContext)

  const [availableTags, setAvailableTags] = useDefaultEmpty<Tag>()

  useEffect(
    () => {
      updateTags()
    }, [appContext.tags, appContext.activeNote]
  )

  const updateTags = () => setAvailableTags(sortTags(appContext.tags.filter(it => !appContext.activeNote?.tagIds.includes(it.id))))

  return (
    <SidebarContent
      id="snovy-note-detail" bodyClass={"snovy-scroll invisible"}
      heading={
        <>
          <ComboBox<Tag>
            id="tag-combo"
            items={availableTags}
            spawn={(forwardValue, setVisible) =>
              <TagForm inputValue={forwardValue} onSubmit={() => setVisible(false)}/>
            }
            options={{selectPreviousOnEsc: false, resetOnSelect: true, wideDropdown: true}}
            borders={{dropdown: true}}
            onSelect={async tag => {
              await appContext.activeNote?.onTag(tag)
              updateTags()
            }}
            customItem={(item, watch) => <TagListItem tag={item} watch={watch}/>}
            label={{value: "Tags"}}
          />
          <ComboBox<State>
            id="state-combo"
            items={appContext.states} itemSort={Titled.compareByTitle}
            spawn={(forwardValue, setVisible) =>
              <SimpleForm<State>
                inputValue={forwardValue} onSubmit={() => setVisible(false)}
                watches={appContext.states.map(it => it.toString())}
                onAdd={async (item) => await appContext.activeNote?.setState(item)}
                onCreate={async (title, color) => await new State(title, color).save()}
              />
            }
            options={{selectPreviousOnEsc: false, wideDropdown: true}}
            borders={{dropdown: true}}
            selected={appContext.activeNote?.state}
            onSelect={async state => {
              await appContext.activeNote?.setState(state)
              appContext.forceUpdate()
            }}
            customItem={(item, watch) => <ColoredListItem item={item} watch={watch}/>}
            label={{value: "State"}}
          />
        </>
      }
    >
      {
        appContext.activeNote && mapTagsToTagItems(
          appContext.activeNote.collectTags(appContext.tags),
          async (tag: Tag | Array<Tag>) => {
            await appContext.activeNote!.untag(tag)
            updateTags()
          })
      }
    </SidebarContent>
  )

}

const mapTagsToTagItems = (tags: Array<[Category | undefined, Tag[]]>, remove: (tag: Tag | Array<Tag>) => void) => {
  return tags.map(([category, tags]: [Category | undefined, Tag[]]) => category ?
    <CategorizedTagItem key={category.title} category={category} mapped={tags} onRemove={remove}/> :
    tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>
    )
  )
}

export default Detail

