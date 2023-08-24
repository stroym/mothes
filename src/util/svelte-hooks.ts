import "./augments.ts"
import {onMount} from "svelte"
import type {Writable} from "svelte/store"
import {get, writable} from "svelte/store"
import {Key} from "ts-key-enum"

type MouseEventType = "mouseup" | "click"

export function watchOutsideClick(
  element: HTMLElement,
  {otherElements = [], eventType = "mouseup", initialState = false, onToggleOff = () => false, watch = true}: {
    otherElements?: Array<HTMLElement>,
    eventType?: MouseEventType,
    initialState?: boolean,
    onToggleOff?: () => void,
    watch?: boolean
  } = {}
): [Writable<boolean>, () => void] {

  const [toggled, toggle] = useToggle(!watch || initialState)

  onMount(
    () => {
      if (watch) {
        document.addEventListener(eventType, handleOutsideClick)
        document.addEventListener("keydown", handleKey)
      }

      return () => {
        if (watch) {
          document.removeEventListener(eventType, handleOutsideClick)
          document.removeEventListener("keydown", handleKey)
        }
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

  let selectedItems: Writable<Array<T>> = writable(listItems?.isEmpty() ? [] : [listItems.first()])
  let activeItem: Writable<T> = writable(listItems?.first())

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
    //TODO do not update when one item is active and it is clicked
    selectedItems.update(current => {
      if (get(ctrlMode)) {
        if (current.includes(item)) {
          if (current.length > 1) {
            return Array.from(current).remove(item)
          }
        } else {
          return current.concat(item)
        }
      } else if (get(shiftMode)) {
        if (current.includes(item)) {
          return listItems.slice(listItems.indexOf(current.first()!), listItems.indexOf(item) + 1)
        } else {
          const firstIndex = listItems.indexOf(current.first()!)
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

      return current
    })

    activeItem.set(get(selectedItems).first())
  }

  const resetSelection = () => {
    selectedItems.update(it => [it.first()] ?? [])
  }

  return {
    shiftMode,
    ctrlMode,
    activeItem,
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
