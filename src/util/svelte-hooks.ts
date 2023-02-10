import "./augments.ts"
import {onMount} from "svelte"
import type {Writable} from "svelte/store"
import {get, writable} from "svelte/store"

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
