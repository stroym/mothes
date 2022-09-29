import React, {useContext, useState} from "react"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import List from "../../snov/list/List"
import AppContext from "../../../util/AppContext"
import TabMenu, {displayTab, Orientation} from "../../snov/tab_menu/TabMenu"
import TabMenuItem from "../../snov/tab_menu/TabMenuItem"
import WithLabel from "../../snov/input/WithLabel"
import Input from "../../snov/input/Input"
import Tag, {sortTags} from "../../../data/model/Tag"
import TagListItem from "../../items/TagListItem"
import {Button} from "../../snov/input/Button"
import ColoredListItem from "../../snov/item/ColoredListItem"
import MultiSelect from "../../snov/input/downshift/MultiSelect"
import {WITH_BORDER} from "../../../util/classes"
import {useDefaultEmpty} from "../../../util/hooks"
import State from "../../../data/model/State"
import {dexie} from "../../../index"
import {useLiveQuery} from "dexie-react-hooks"
import Note from "../../../data/model/Note"
import {useTheme} from "@emotion/react"
import {TagItemInner} from "../../items/TagItem"
import NoteListItem from "../../items/NoteListItem"
import Category from "../../../data/model/Category"
import FilterGroup from "../../snov/filter/FilterGroup"
import RadioButtonGroup from "../../snov/input/RadioButtonGroup"

const Search = () => {

  const appContext = useContext(AppContext)

  const theme = useTheme()

  const mappings = {
    test: "Test",
    filters: "Filters",
    results: "Results"
  }

  const [active, setActive] = useState(mappings.filters)

  const [query, setQuery] = useState<string>()
  const [text, setText] = useState<string>()
  const [textMode, setTextMode] = useState("ALL")
  const [selectedStates, setSelectedStates] = useDefaultEmpty<State>()
  const [selectedCategories, setSelectedCategories] = useDefaultEmpty<Category>()
  const [selectedTags, setSelectedTags] = useDefaultEmpty<Tag>()
  const [categoryMode, setCategoryMode] = useState("OR")
  const [tagMode, setTagMode] = useState("OR")

  const notes = useLiveQuery(() => dexie.notes.toArray().then(async notes => {
    const loadedNotes = new Array<Note>()

    for (const note of notes) {
      loadedNotes.push(await note.load())
    }

    return loadedNotes
  })) ?? []

  const [filtered, setFiltered] = useDefaultEmpty<Note>()

  const filterNotes = () => {
    setFiltered(notes.filter(it => textMatch(it) && (stateMatch(it) || categoryMatch(it) || tagMatch(it))))

    setActive(mappings.results)
  }

  const textMatch = (it: Note) => {
    if (!text) {
      return true
    } else {
      if (textMode == "TITLE") {
        return it.title.toLowerCase().includes(text.toLowerCase())
      } else if (textMode == "CONTENT") {
        return it.content.toLowerCase().includes(text.toLowerCase())
      } else {
        return it.title.toLowerCase().includes(text.toLowerCase()) || it.content.toLowerCase().includes(text.toLowerCase())
      }
    }
  }

  const stateMatch = (it: Note) => {
    if (selectedStates.isEmpty()) {
      return true
    } else {
      return selectedStates.map(it => it.id).includes(it.stateId)
    }
  }

  const categoryMatch = (it: Note) => {
    if (selectedCategories.isEmpty()) {
      return true
    } else {
      return categoryMode == "OR" ?
        it.tags.some(it => selectedCategories.map(it => it.id).includes(it.categoryId)) :
        selectedCategories.map(it => it.id).every(catId => it.tags.some(tag => tag.categoryId == catId))
    }
  }

  const tagMatch = (it: Note) => {
    if (selectedTags.isEmpty()) {
      return true
    } else {
      return tagMode == "OR" ?
        it.tagIds.some(it => selectedTags.map(it => it.id).includes(it)) :
        selectedTags.map(it => it.id).every(itt => it.tagIds.includes(itt))
    }
  }

  //TODO snovy style options object = customItem, selectedItemsStyle
  //TODO like this you lose the unique category information, which may or may not be an issue
  const itemStyle = {
    className: "snovy-fancy-item-split",
    textColors: theme,
    customItem: (item, tiny) => <TagItemInner mapped={item} tiny={tiny}/>
  }

  return (
    <SidebarContent
      id="search-view" bodyClass={"snovy-scroll"}
      heading={
        <TabMenu orientation={Orientation.TOP}>
          <TabMenuItem
            itemId={mappings.filters} active={active == mappings.filters} onClick={() => setActive(mappings.filters)}
          />
          <TabMenuItem
            itemId={mappings.test} active={active == mappings.test} onClick={() => setActive(mappings.test)}
          />
          <TabMenuItem
            itemId={mappings.results} active={active == mappings.results} onClick={() => setActive(mappings.results)}
          />
        </TabMenu>
      }
    >
      <form
        id="search-form" className="snovy-form" tabIndex={-1} onSubmit={e => e.preventDefault()}
        style={displayTab(mappings.filters, active)}
      >
        {/*TODO if you really want to do this, make it a textArea*/}
        <WithLabel value="Query" vertical>
          <Input className={WITH_BORDER} disabled onValueChange={setQuery}/>
        </WithLabel>
        <WithLabel value="Text" vertical>
          <Input className={WITH_BORDER} onValueChange={setText}/>
          <RadioButtonGroup
            style={{backgroundColor: theme.accent, color: theme.textSecondary}} label="Mode:"
            group="grp-text-type" get={setTextMode} initial="ALL"
          >
            {[
              {value: "ALL", label: "All"},
              {value: "TITLE", label: "Title"},
              {value: "CONTENT", label: "Content"},
            ]}
          </RadioButtonGroup>
        </WithLabel>
        <MultiSelect
          items={appContext.states} label={{value: "States"}}
          borders={{main: true, dropdown: true}} onSelectedChange={setSelectedStates}
          customItem={item => <ColoredListItem item={item}/>}
          selectedItemsStyle={{textColors: theme}}
        />
        <MultiSelect
          items={appContext.categories} label={{value: "Categories", title: "Matches any tag belonging to a category"}}
          borders={{main: true, dropdown: true}} onSelectedChange={setSelectedCategories}
          customItem={item => <ColoredListItem item={item}/>}
          selectedItemsStyle={{textColors: theme}} mode={{name: "category-mode", get: setCategoryMode}}
        />
        <MultiSelect
          items={sortTags(appContext.tags)} label={{value: "Tags"}}
          borders={{main: true, dropdown: true}} onSelectedChange={setSelectedTags}
          customItem={item => <TagListItem tag={item}/>} mode={{name: "tag-mode", get: setTagMode}}
          selectedItemsStyle={itemStyle}
        />
        <div className="snovy-form-buttons">
          <Button border>Reset</Button>
          <Button border onClick={filterNotes}>Search</Button>
        </div>
      </form>
      {/*TODO render match*/}
      <List
          items={filtered} customItem={item => <NoteListItem note={item}/>}
          style={displayTab(mappings.results, active)}
      />
      <FilterGroup
          filterKey="TAG" items={sortTags(appContext.tags)} customItem={item => <TagListItem tag={item}/>}
          style={displayTab(mappings.test, active)} selectedItemsStyle={itemStyle}
      />
      {/*<FilterContainer<Tag | State>*/}
      {/*  items={[*/}
      {/*    {*/}
      {/*      key: "TAG",*/}
      {/*      values: sortTags(appContext.tags),*/}
      {/*      customItem: item => <TagListItem tag={item as Tag}/>*/}
      {/*    },*/}
      {/*    {*/}
      {/*      key: "STATE",*/}
      {/*      values: appContext.states,*/}
      {/*      sort: Titled.compareByTitle,*/}
      {/*      customItem: item => <ColoredListItem item={item}/>*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*  style={displayTab(mappings.test, active)} selectedItemsStyle={itemStyle}*/}
      {/*/>*/}
    </SidebarContent>
  )

}

export default Search
