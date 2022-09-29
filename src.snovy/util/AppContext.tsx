import React, {useEffect, useState} from "react"
import Notebook from "../data/model/Notebook"
import Section from "../data/model/Section"
import Note from "../data/model/Note"
import {useDefaultEmpty} from "./hooks"
import {dexie} from "../index"
import {Table} from "../data/model/Base"
import {useLiveQuery} from "dexie-react-hooks"
import Category from "../data/model/Category"
import State from "../data/model/State"
import Tag from "../data/model/Tag"

const AppContext = React.createContext<AppContextType>({
  notebooks: [],
  setNotebooks: () => false,
  activeNotebook: undefined,
  setActiveNotebook: () => false,
  activeSection: undefined,
  setActiveSection: () => false,
  activeNote: undefined,
  setActiveNote: () => false,
  tags: [],
  categories: [],
  states: [],
  forceUpdate: () => false
})

type AppContextType = {
  notebooks: Array<Notebook>
  setNotebooks: (items: Array<Notebook>) => void
  activeNotebook: Notebook | undefined
  setActiveNotebook: (item: Notebook | undefined) => void
  setActiveSection: (item: Section | undefined) => void
  activeSection: Section | undefined
  activeNote: Note | undefined
  setActiveNote: (item: Note | undefined) => void
  tags: Array<Tag>
  categories: Array<Category>
  states: Array<State>
  forceUpdate: () => void
}

export const AppProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {

  //TODO keep track of note loading, show components loading data

  const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

  const tags = useLiveQuery(() => dexie.tags.toArray().then(async tags => {
    for (const tag of tags) {
      await tag.load()
    }
    return tags
  })) ?? []

  const categories = useLiveQuery(() => dexie.categories.toArray()) ?? []
  const states = useLiveQuery(() => dexie.states.toArray()) ?? []

  const [notebooks, setNotebooks] = useDefaultEmpty<Notebook>()

  const [activeNotebook, setActiveNotebook] = useState<Notebook | undefined>()
  const [activeSection, setActiveSection] = useState<Section | undefined>()
  const [activeNote, setActiveNote] = useState<Note | undefined>()

  useEffect(
    () => {
      dexie.transaction("rw", [dexie.notebooks, dexie.sections, dexie.notes, dexie.categories, dexie.tags, dexie.states], async () => {
        await dexie.notebooks.toArray().then(async function (values) {
          const loaded = values

          setNotebooks(loaded.sort(Table.compareById))
          await selectNotebook(loaded.first())
        })
      })
    }, []
  )

  const selectNotebook = async (active: Notebook | undefined) => {
    if (active) {
      if (active != activeNotebook) {
        await active.load()
        setActiveNotebook(active)
        await selectSection(active.sections.first())
      }
    } else {
      setActiveNotebook(undefined)
      setActiveSection(undefined)
      setActiveNote(undefined)
    }
  }

  const selectSection = async (active: Section | undefined) => {
    if (active) {
      if (active != activeSection) {
        await active.load()
        setActiveSection(active)

        for (const note of active.notes) {
          await note.load()
        }

        setActiveNote(active.notes.first())
      }
    } else {
      setActiveSection(undefined)
      setActiveNote(undefined)
    }
  }

  const selectNote = async (active: | Note | undefined) => {
    if (active) {
      if (active != activeNote) {
        await active.load()
        setActiveNote(active)
      }
    } else {
      setActiveNote(undefined)
    }
  }

  return (
    <AppContext.Provider
      value={{
        notebooks, setNotebooks,
        activeNotebook, setActiveNotebook: selectNotebook,
        activeSection, setActiveSection: selectSection,
        activeNote, setActiveNote: selectNote,
        tags, categories, states,
        forceUpdate
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext