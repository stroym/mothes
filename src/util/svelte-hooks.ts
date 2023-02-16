import "./augments.ts"
import {onMount} from "svelte"
import type {Writable} from "svelte/store"
import {get, writable} from "svelte/store"
import {Key} from "ts-key-enum"

type MouseEventType = "mouseup" | "click"

export function watchOutsideClick(
  element: HTMLElement,
  {otherElements = [], eventType = "mouseup", initialState = false, onToggleOff = () => false}: {
    otherElements?: Array<HTMLElement>,
    eventType?: MouseEventType,
    initialState?: boolean,
    onToggleOff?: () => void
  } = {}
): [Writable<boolean>, () => void] {

  const [toggled, toggle] = useToggle(initialState)

  onMount(
    () => {
      document.addEventListener(eventType, handleOutsideClick)
      document.addEventListener("keydown", handleKey)

      return () => {
        document.removeEventListener(eventType, handleOutsideClick)
        document.removeEventListener("keydown", handleKey)
      }
    }
  )

  const toggleOff = () => {
    toggled.set(false)
    onToggleOff && onToggleOff()
  }

  const handleOutsideClick = (e: MouseEvent) => {
    if (!element?.contains(e.target as Node) && !otherElements?.find(it => it?.contains((e.target as Node)))) {
      toggleOff()
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key == Key.Escape) {
      toggleOff()
    }
  }

  return [toggled, toggle]
}

export function useMultiSelect<T>(listItems: Array<T>) {

  let ctrlMode = writable(false)
  let shiftMode = writable(false)

  let selectedItems: Writable<Array<T>> = writable([listItems.first()])

  onMount(
    () => {
      document.addEventListener("mousemove", handleKey)

      return () => {
        document.removeEventListener("mousemove", handleKey)
      }
    }
  )

  const handleKey = (e: MouseEvent) => {
    shiftMode.set(e.shiftKey)
    ctrlMode.set(e.ctrlKey)
  }

  const handleItemClick = (item: T) => {
    selectedItems.update(currentItems => {
      if (get(ctrlMode)) {
        if (currentItems.includes(item)) {
          if (currentItems.length > 1) {
            return Array.from(currentItems).remove(item)
          }
        } else {
          return currentItems.concat(item)
        }
      } else if (get(shiftMode)) {
        if (currentItems.includes(item)) {
          return listItems.slice(listItems.indexOf(currentItems.first()!), listItems.indexOf(item) + 1)
        } else {
          const firstIndex = listItems.indexOf(currentItems.first()!)
          const itemIndex = listItems.indexOf(item)

          if (itemIndex > firstIndex) {
            return listItems.slice(firstIndex, itemIndex + 1)
          } else {
            return listItems.slice(itemIndex, firstIndex + 1).reverse()
          }
        }
      } else {
        return [item]
      }

      return currentItems
    })
  }

  const resetSelection = () => {
    console.log("reset")
    selectedItems.update(it => [it.first()] ?? [])
  }

  return {
    shiftMode,
    ctrlMode,
    selectedItems,
    handleItemClick,
    resetSelection
  }

}

export function useToggle(initialState?: boolean): [Writable<boolean>, () => void] {
  let toggled = writable(initialState)

  const toggle = () => {
    toggled.update(current => !current)
  }

  return [toggled, toggle]
}
