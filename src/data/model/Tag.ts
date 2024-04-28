import type Category from "./Category"
import {dexie} from "../../index"
import {Colored, Titled} from "./Base"

export default class Tag extends Colored {

  categoryId?: number

  category?: Category

  constructor(title: string, color: string, categoryId?: number, id?: number) {
    super(title, color, id)
    this.categoryId = categoryId
  }

  async delete() {
    return dexie.transaction("rw", dexie.tags, dexie.notes, async () => {
      await this.unTagAll()
      dexie.tags.delete(this.id)
    }).then(_result => true).catch(_result => false)
  }

  static compareByCategory =
    (a: Tag, b: Tag) => { return Number(a.category) - Number(b.category)}

  static compareByCategoryUnique =
    (a: Tag, b: Tag) => { return Number(a.category?.unique) - Number(b.category?.unique)}

  async unTagAll() {
    for (const note of await dexie.notes.where("tagIds").equals(this.id).toArray()) {
      await note.untag(this)
    }
  }

  async load() {
    return Promise.all([
      this.categoryId ? await dexie.categories.get(this.categoryId).then(async category => this.category = await category?.load()) : () => false
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.tags, () => {
      dexie.tags.put(this, this.id)
    }).then(_it => this)
  }

  async update(title: string, color: string, category?: Category) {
    this.title = title
    this.category = category
    this.categoryId = category?.id

    await this.updateColor(color)
  }

  async setCategory(category: Category | undefined) {
    this.categoryId = category?.id
    this.category = category
    await this.save()
  }

  isEqual(tag: Tag): boolean {
    return this.category == tag.category && this.title == tag.title
  }

  get displayValue(): string {
    return this.category ? this.category.toColonString() + this.title : super.displayValue
  }

}

export function sortTags(rawTags: Array<Tag>) {
  const categorized: Array<Tag> = []
  const simple: Array<Tag> = []

  rawTags.forEach(it => it.category ? categorized.push(it) : simple.push(it))
  categorized.sort(Tag.compareByCategoryUnique || Tag.compareByCategory || Tag.compareByTitle)
  simple.sort(Titled.compareByTitle)

  return categorized.concat(simple)
}
