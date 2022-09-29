import {categoryId} from "../Database"
import {dexie} from "../../index"
import {Colored} from "./Base"

export default class Category extends Colored {

  unique: boolean

  constructor(title: string, color: string, unique = false, id?: number) {
    super(title, color, id)
    this.unique = unique
  }

  async delete() {
    return dexie.transaction("rw", dexie.categories, dexie.tags, () => {
      return Promise.all([
        dexie.tags.where(categoryId).equals(this.id).delete(),
        dexie.categories.delete(this.id)
      ]).then(_result => true).catch(_result => false)
    })
  }

  async load() {
    return Promise.all([]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.categories, () => {dexie.categories.put(this, this.id)}).then(_it => this)
  }

  async update(title: string, color: string, unique: boolean) {
    this.title = title
    this.color = color
    this.unique = unique

    await this.save()
  }

  toColonString(): string {
    return this.unique ? this.title + "::" : this.title + ":"
  }

}