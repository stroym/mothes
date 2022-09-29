import React from "react"
import TinyStyle from "./colors"

// eslint-disable-next-line
export type GenericItem = Record<string, any> | string

export type CustomItem<T extends GenericItem> = (item: T) => React.ReactElement

export type UpdatableCustomItem<T extends GenericItem> = (item: T, onValueChange?: (str: string) => void) => React.ReactElement

export type WatchableCustomItem<T extends GenericItem> = (item: T, watchedValue?: string) => React.ReactElement

export type ColoredCustomItem<T extends GenericItem> = (item: T, tiny: TinyStyle) => React.ReactElement

//TODO use getters (toDisplayString?) to allow for separation between toString() and display value?
export type WithTitle = {
  title: string
}

export type WithColor = {
  color: string
}
