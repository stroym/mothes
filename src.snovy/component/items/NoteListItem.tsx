import React from "react"
import Note from "../../data/model/Note"
import FavoriteButton from "../inputs/FavoriteButton"
import {SIMPLE_LI} from "../../util/classes"

export interface NoteListItemProps {
  note: Note
  favorite?: boolean
}

const NoteListItem = ({note, favorite}: NoteListItemProps) => {

  return (
    <div className="snovy-note-item" tabIndex={0}>
      <div className={SIMPLE_LI + " section-detail"}>{note.section?.title}</div>
      <div className="note-detail">
        <div className={SIMPLE_LI}>{note.title}</div>
        {
          favorite && <FavoriteButton note={note}/>
        }
      </div>
    </div>
  )

}

export default NoteListItem