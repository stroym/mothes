import Note from "./Note"
import {addTo, Ordered, removeFrom, Titled} from "./Base"
import {sectionId} from "../Database"
import {dexie} from "../../index"

export default class Section extends Ordered {

  notebookId: number

  notes = new Array<Note>()

  constructor(notebookId: number, title: string, order: number, id?: number) {
    super(title, order, id)
    this.notebookId = notebookId

    Object.defineProperties(this, {
      notes: {enumerable: false, writable: true}
    })
  }

  get itemsSortedAlphabetically() {
    return this.notes.sort(Titled.compareByTitle)
  }

  get itemsSortedByOrder() {
    return this.notes.sort(Ordered.compareByOrder)
  }

  async load() {
    return Promise.all([
      dexie.notes.where(sectionId).equals(this.id).toArray().then(notes => this.notes = notes)
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.sections, () => {
      dexie.sections.put(this, this.id)
    }).then(_it => this)
  }

  async delete() {
    return dexie.transaction("rw", dexie.sections, dexie.notes, async () => {
      dexie.notes.bulkDelete((await dexie.notes.where(sectionId).equals(this.id).toArray()).map(it => it.id))
      dexie.sections.delete(this.id)
    }).then(_result => true).catch(_result => false)
  }

  async add(order?: number) {
    return addTo(this.notes, new Note(this.id, "", order ? order : this.notes.length))
      .finally(() => this.itemsSortedByOrder)
  }

  async remove(items?: Note | Array<Note>) {
    return await removeFrom(this.notes, items)
  }

}
