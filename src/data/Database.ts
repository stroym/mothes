import Dexie from "dexie"
import {exportDB, importInto} from "dexie-export-import"
import Notebook from "./model/Notebook"
import State from "./model/State"
import Category from "./model/Category"
import Tag from "./model/Tag"
import Note from "./model/Note"
import Section from "./model/Section"
import Options from "./model/options/Options"
import Theme from "./model/options/Theme"
import {saveAs} from "file-saver"
import {dexie} from "../index"

export const notebookId = "notebookId"
export const sectionId = "sectionId"
export const noteId = "noteId"
export const categoryId = "categoryId"
export const tagId = "tagId"
export const stateId = "stateId"
export const themeId = "themeId"

export const title = "title"
export const order = "order"
export const color = "color"

const createdAt = "createdAt"
const updatedAt = "updatedAt"

class Database extends Dexie {

  options: Dexie.Table<Options, number>
  themes: Dexie.Table<Theme, number>
  notebooks: Dexie.Table<Notebook, number>
  sections: Dexie.Table<Section, number>
  notes: Dexie.Table<Note, number>
  tags: Dexie.Table<Tag, number>
  categories: Dexie.Table<Category, number>
  states: Dexie.Table<State, number>

  constructor() {
    super("snovyDB")

    this.version(1).stores({
      options: Database.buildColumns(["singleNotebook", themeId]),
      themes: Database.buildColumns([title,
        "primary", "secondary", "textPrimary", "textSecondary",
        "accent", "border", "hover", "activeItem"]),
      notebooks: Database.buildColumns([notebookId, title]),
      sections: Database.buildColumns([notebookId, title, order]),
      notes: Database.buildColumns([sectionId, stateId, "*tagIds", title, "content", order, "archived", "favorite"]),
      tags: Database.buildColumns([categoryId, title, color]),
      categories: Database.buildColumns(["&" + title, color]),
      states: Database.buildColumns(["&" + title, color])
    })

    this.options = this.table("options")
    this.themes = this.table("themes")
    this.notebooks = this.table("notebooks")
    this.sections = this.table("sections")
    this.notes = this.table("notes")
    this.tags = this.table("tags")
    this.categories = this.table("categories")
    this.states = this.table("states")

    this.options.mapToClass(Options)
    this.themes.mapToClass(Theme)
    this.notebooks.mapToClass(Notebook)
    this.sections.mapToClass(Section)
    this.notes.mapToClass(Note)
    this.categories.mapToClass(Category)
    this.tags.mapToClass(Tag)
    this.states.mapToClass(State)
  }

  static buildColumns(names: Array<string>) {
    return "++id,".concat(names.join(",")).concat(createdAt + ",", updatedAt)
  }

}

export const importData = async (files: FileList | null, replaceData = false) => {
  if (files && files.length > 0) {
    const blob = files.item(0)

    if (blob) {
      await importInto(dexie, blob, {overwriteValues: true, clearTablesBeforeImport: replaceData})

      window.location.reload()
    }
  }
}

export const exportData = async () => {
  saveAs(new File(
    [await exportDB(dexie, {prettyJson: true})],
    `snovy-export-\
    ${new Date().toISOString()
      .replace("T", "_")
      .replaceAll(":", "-")
      .substring(0, 19)
    }\
    .json`,
    {type: "text/json;charset=utf-8"}
  ))
}

export default Database
