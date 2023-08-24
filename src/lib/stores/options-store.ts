import {writable} from 'svelte/store';
import {dexie} from "../../index";
import {fetchThemes} from "../../data/Database";
import {defaults} from "../../data/model/options/Defaults";
import type Options from "../../data/model/options/Options";

export const activeOptions = writable(defaults.options)
export const activeTheme = writable(defaults.themes.first())

export const initOptions = async () => {
  return dexie.options.toArray().then(async (options) => {
    return options.isEmpty() ? await defaults.options.save() : await options.first()!.load()
  });
}

export const setOptions = async (newOptions: Options) => {
  await dexie.themes.get(newOptions.themeId)
    .then(async (loaded) => {
      if (loaded) {
        activeTheme.set(loaded)
      } else {
        throw Error(`Theme with id ${newOptions.themeId} not found!`)
      }
    })
    .catch(async (error) => {
      console.error(`Error while fetching theme! Reverting to default theme...\n${error}`)

      const backup = (await fetchThemes()).first()!
      activeTheme.set(backup)
      newOptions.themeId = backup.id
    })

  activeOptions.set(await newOptions.save())
}