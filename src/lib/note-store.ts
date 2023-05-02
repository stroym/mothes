import {get, writable} from 'svelte/store';
import type Notebook from "../data/model/Notebook";
import type Section from "../data/model/Section";
import type Note from "../data/model/Note";
import {dexie} from "../index";
import {liveQuery} from "dexie";
import type Tag from "../data/model/Tag";
import {Table} from "../data/model/Base";

export const notebooks = liveQuery(() => dexie.notebooks.toArray().then(it => loadNotebooks(it)))
export const tags = liveQuery(() => dexie.tags.toArray().then(it => loadTags(it)))
export const categories = liveQuery(() => dexie.categories.toArray())
export const states = liveQuery(() => dexie.states.toArray())

export const activeNotebook = writable<Notebook | undefined>()
export const activeSection = writable<Section | undefined>()
export const activeNote = writable<Note | undefined>()

export async function selectNotebook(active: Notebook | undefined) {
  if (active) {
    if (active != get(activeNotebook)) {
      await active.load()
      activeNotebook.set(active)
      await selectSection(active.sections.first())
    }
  } else {
    activeNotebook.set(undefined)
    activeSection.set(undefined)
    activeNote.set(undefined)
  }
}

export async function selectSection(active: Section | undefined) {
  if (active) {
    if (active != get(activeSection)) {
      await active.load()
      activeSection.set(active)

      for (const note of active.notes) {
        await note.load()
      }

      activeNote.set(active.notes.first())
    }
  } else {
    activeSection.set(undefined)
    activeNote.set(undefined)
  }
}

export async function selectNote(active: | Note | undefined) {
  console.log(active)
  if (active) {
    if (active != get(activeNote)) {
      await active.load()
      activeNote.set(active)
    }
  } else {
    activeNote.set(undefined)
  }
}

async function loadNotebooks(notebooks: Array<Notebook>) {
  const sorted = notebooks.sort(Table.compareById)

  await selectNotebook(sorted.first())

  return sorted
}

async function loadTags(tags: Array<Tag>) {
  for (const tag of tags) {
    await tag.load()
  }

  return tags
}
