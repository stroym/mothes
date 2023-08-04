import Tag, {sortTags} from "./Tag"
import type State from "./State"
import {dexie} from "../../index"
import {isArray, isDefined} from "../../util/utils"
import {Ordered, type Toggleable} from "./Base"
import type Category from "./Category"
import type Section from "./Section"

export default class Note extends Ordered implements Toggleable {

  sectionId: number
  section?: Section
  stateId?: number
  state?: State
  tagIds = new Array<number>()
  tags = new Array<Tag>()

  archived = false
  favorite = false
  content = ""

  constructor(sectionId: number, title: string, order: number, id?: number) {
    super(title, order, id)
    this.sectionId = sectionId
  }

  async delete() {
    return dexie.transaction("rw", dexie.notes, () => {
      dexie.notes.delete(this.id)
    })
      .then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([
      await dexie.sections.get(this.sectionId).then(section => this.section = section),
      this.tagIds.isEmpty() ? () => false : await dexie.tags.bulkGet(this.tagIds).then(tags => this.tags = tags.filter(isDefined)),
      this.stateId ? await dexie.states.get(this.stateId).then(async state => this.state = await state?.load()) : () => false
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.notes, () => {
      dexie.notes.put(this, this.id)
    }).then(_it => this)
  }

  async updateContent(newContent: string) {
    this.content = newContent
    return await this.save()
  }

  async onTag(tag: Tag | undefined) {
    if (tag) {
      if (tag.category && tag.category.unique) {
        const currentUniqueTag = this.tags.find(it => it.categoryId == tag.category!.id)

        if (currentUniqueTag) {
          if (confirm(`This category is unique. Do you wish to replace the currently present tag ${currentUniqueTag.title}?`)) {
            this.tagIds.delete(currentUniqueTag.id)
          } else {
            return
          }
        }
      }

      this.tagIds.push(tag.id)
      this.tags.push(tag)
      await this.save()
    }
  }

  async untag(tag: Tag | Array<Tag>) {
    if (isArray(tag)) {
      this.tagIds.deleteAll(tag.map(it => it.id))
    } else {
      this.tagIds.delete(tag.id)
    }

    await this.save()
  }

  async setState(state?: State) {
    this.stateId = state?.id
    this.state = state
    await this.save()
  }

  isInState(state: State): boolean {
    return this.state?.id == state.id
  }

  async archive() {
    this.archived = true
    await this.save()
  }

  async unarchive() {
    this.archived = false
    await this.save()
  }

  async star() {
    this.favorite = !this.favorite
    await this.save()

    return this.favorite
  }

  collectTags(allTags: Array<Tag>): [Category | undefined, Array<Tag>][] {
    const grouped = new Map<Category | undefined, Array<Tag>>()

    sortTags(allTags.filter(it => this.tagIds.includes(it.id))).forEach(item => {
      const key = item?.category
      const kk = Array.from(grouped.keys()).find(it => it?.id == key?.id)

      if (kk || (grouped.get(key) && key == undefined)) {
        grouped.get(kk ?? key)?.push(item)
      } else {
        grouped.set(key, [item])
      }
    })

    return Array.from(grouped.entries())
  }

  async snvToggle() {
    return await this.star();
  }

  snvToggled() {
    return this.favorite;
  }

}
