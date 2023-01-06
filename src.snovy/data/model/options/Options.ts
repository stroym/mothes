import {Table} from "../Base"
import {dexie} from "../../../index"

export default class Options extends Table {

  themeId: number

  singleNotebook: boolean

  constructor(themeId: number, singleNotebook: boolean, id?: number) {
    super(id)
    this.singleNotebook = singleNotebook
    this.themeId = themeId
  }

  //useless
  async delete() {
    return false
  }

  async load() {
    return Promise.all([
      this.themeId == -1 ? await dexie.themes.toArray().then(themes => {
        if (!themes.isEmpty()) {
          this.themeId = themes.first()!.id
        }
      }) : () => false
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.options, async () => {
      await dexie.options.clear()

      dexie.options.put(this, this.id)
    }).then(_it => this)
  }

  clone() {
    return Object.create(this)
  }

}