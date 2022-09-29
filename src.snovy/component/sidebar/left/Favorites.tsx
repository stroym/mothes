import React from "react"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import List from "../../snov/list/List"
import {dexie} from "../../../index"
import {useLiveQuery} from "dexie-react-hooks"
import NoteListItem from "../../items/NoteListItem"
import Note from "../../../data/model/Note"

export const Favorites = () => {

  const favoriteNotes = useLiveQuery(() => dexie.notes.toArray().then(notes => {
    return notes.filter(it => it.favorite)
  }).then(async notes => {
    const loadedNotes = new Array<Note>()

    for (const note of notes) {
      loadedNotes.push(await note.load())
    }

    return loadedNotes
  })) ?? []

  return (
    <SidebarContent id="favorites-view">
      <List<Note> items={favoriteNotes} customItem={note => <NoteListItem note={note} favorite/>}/>
    </SidebarContent>
  )

}

export default Favorites