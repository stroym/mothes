import React, {useContext, useEffect, useReducer, useRef, useState} from "react"
import AppContext from "../../util/AppContext"
import {useTimeout} from "../../util/hooks"
import {KeyMapping, useKey} from "../../util/utils"
import Note from "../../data/model/Note"
import {EditorRef, ReactEditor, useEditor} from "@milkdown/react"
import {useTheme} from "@emotion/react"
import {ToggleButton} from "../snov/input/Button"
import {createEditor} from "./milkdown-config"

const Editor = () => {

  const appContext = useContext(AppContext)

  const editorRef = useRef<EditorRef>(null)

  const [value, setValue] = useState("")
  const [edit, setEdit] = useState(false)

  const [current, setCurrent] = useReducer(
    (prevState: Note | undefined, newState: Note | undefined): Note | undefined => {
      if (prevState && prevState.id != newState?.id) {
        saveNote(prevState, value)
      }

      setValue(newState?.content ?? "")
      return newState
    },
    undefined
  )

  useEffect(
    () => {
      setCurrent(appContext.activeNote)
    }, [appContext.activeNote]
  )

  const save = async () => {
    return await saveNote(current, value)
  }

  useTimeout(save, 5000, [value])

  const keyMap: Array<KeyMapping> = [
    {key: "S", handler: save, modifiers: {ctrl: true}}
  ]

  const theme = useTheme()

  const editor = useEditor(
    (root) => {
      root.className = "editor-content"

      return createEditor(root, theme, current?.content ?? "", setValue, !current)
    },
    [current]
  )

  const toggleEdit = async (state: boolean) => {
    if (!state) {
      const saved = await save()

      if (saved) {
        setCurrent(saved)
      }
    }

    setEdit(state)
  }

  return (
    <div className="snovy-editor" onKeyDown={e => useKey(e, keyMap)} data-disabled={!current}>
      <ToggleButton
        id="source-mode-button" preset="source" setState={edit} getState={toggleEdit} tabIndex={-1} title="Source mode"
        disabled={!current}
      />
      {
        edit ? <textarea
            className="editor-content source-view" defaultValue={value} onChange={e => setValue(e.target.value)}
          /> :
          <ReactEditor ref={editorRef} editor={editor}/>
      }
    </div>
  )

}

const saveNote = async (note: Note | undefined, value: string) => {
  if (note && note.content != value) {
    return await note.updateContent(value.replaceAll(/  +/g, " "))
  }
}

export default Editor