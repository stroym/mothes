import type TinyStyle from "./colors"

export type GenericItem = Record<string, any> | string

export type CustomItem<T extends GenericItem> = (item: T) => HTMLElement

export type UpdatableCustomItem<T extends GenericItem> = (item: T, onValueChange?: (str: string) => void) => HTMLElement

export type WatchableCustomItem<T extends GenericItem> = (item: T, watchedValue?: string) => HTMLElement

export type ColoredCustomItem<T extends GenericItem> = (item: T, tiny: TinyStyle) => HTMLElement

export type Listable = {

  get displayValue(): string

  get itemId(): string

}

export type WithColor = {
  color: string
}
