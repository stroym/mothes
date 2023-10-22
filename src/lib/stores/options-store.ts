import {get, writable} from "svelte/store";
import {dexie} from "../../index";
import {defaults} from "../../data/model/options/Defaults";
import {loadNotebooks} from "../note-store";
import type Options from "../../data/model/options/Options";
import type Theme from "../../data/model/options/Theme";

export const activeOptions = writable(defaults.options)
export const activeTheme = writable(defaults.themes.first())

export const availableThemes = writable([])

//TODO actually use the transaction... or don't bother with it at all
export const loadDexie = async () => {
  await dexie.transaction("rw", [dexie.options, dexie.themes], async () => {
    availableThemes.set(await fetchThemes())

    await fetchOptions().then(async options => {
      get(availableThemes).find(theme => theme.id === options.themeId).load().then(theme => {
        if (theme) {
          theme.setCss()
          activeTheme.set(theme)
        } else {
          throw Error(`Theme with id ${options.themeId} not found!`)
        }

        activeOptions.set(options)
      }).catch(async (error) => {
        console.error(`Error while fetching theme! Reverting to default theme...\n${error}`)

        const backup = (await fetchThemes()).first()!
        backup.setCss()
        activeTheme.set(backup)
        options.themeId = backup.id
        activeOptions.set(await options.save())
      })
    })
  })

  await dexie.notebooks.toArray().then(it => loadNotebooks(it))
}


export const fetchOptions: () => Promise<Options> = async () => {
  return dexie.options.toArray().then(async (options) => {
    return options.isEmpty() ? await defaults.options.save() : await options.first().load()
  })
}

export const fetchThemes: () => Promise<Array<Theme>> = async () => {
  return dexie.themes.toArray().then(async (loadedThemes) => {
    if (loadedThemes.isEmpty()) {
      for (const theme of defaults.themes) {
        await theme.save()
      }

      return dexie.themes.toArray()
    } else {
      return loadedThemes
    }
  })
}
