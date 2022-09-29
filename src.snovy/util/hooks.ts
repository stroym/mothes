import useResizeObserver from "@react-hook/resize-observer"
import React, {Dispatch, SetStateAction, useEffect, useLayoutEffect, useReducer, useState} from "react"
import {Key} from "ts-key-enum"
import {combineOptions, getChild, isArray, isDefined} from "./utils"

//region Watches

type MouseEventType = "mouseup" | "click"

export function watchOutsideClick(
  elementRef: React.RefObject<Element | null>,
  {otherRefs = [], eventType = "mouseup", initialState = false, onToggleOff = () => false}: {
    otherRefs?: Array<React.RefObject<Element | null>>,
    eventType?: MouseEventType,
    initialState?: boolean,
    onToggleOff?: () => void
  } = {}
):
  [boolean, Dispatch<SetStateAction<boolean>>, () => void] {

  const [toggled, setToggled, toggle] = useToggle(initialState)

  useEffect(
    () => {
      document.addEventListener(eventType, handleOutsideClick)
      document.addEventListener("keydown", handleKey)

      return () => {
        document.removeEventListener(eventType, handleOutsideClick)
        document.removeEventListener("keydown", handleKey)
      }
    }, []
  )

  const toggleOff = () => {
    setToggled(false)
    onToggleOff && onToggleOff()
  }

  const handleOutsideClick = (e: MouseEvent) => {
    if (!elementRef.current?.contains(e.target as Node) && !otherRefs?.find(it => it.current?.contains((e.target as Node)))) {
      toggleOff()
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key == Key.Escape) {
      toggleOff()
    }
  }

  return [toggled, setToggled, toggle]
}

export function useHideAbsolute(hide: () => void, parentRef?: React.RefObject<HTMLElement>) {

  useEffect(
    () => {
      window.addEventListener("resize", hide)
      window.addEventListener("scroll", hide)
      parentRef?.current?.addEventListener("scroll", hide)

      return () => {
        window.removeEventListener("resize", hide)
        window.removeEventListener("scroll", hide)
        parentRef?.current?.removeEventListener("scroll", hide)
      }
    }, []
  )

}

//endregion

//region Positioning

type Position = {
  left?: number,
  top?: number,
  right?: number,
  bottom?: number,
  width?: number,
  height?: number
}

export function useContextMenu(
  contextRef: React.RefObject<HTMLElement>,
  parentRef: React.RefObject<HTMLElement>,
  options?: RenderingOptions
) {

  const {offset} = combineOptions(options, defaultPositionOptions)

  const [visible, setVisible] = watchOutsideClick(contextRef)

  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)

  const [, setContextItem] = useReducer(
    (prevState: HTMLElement | null, newState: HTMLElement | null): HTMLElement | null => {
      prevState?.setAttribute("data-context", "false")
      newState?.setAttribute("data-context", "true")

      return newState
    },
    null
  )

  useHideAbsolute(() => setVisible(false), parentRef)
  useSize(contextRef, visible,
    size => setPosition({
      left: x - offset,
      top: y - offset,
      right: x + size.width,
      bottom: y + size.height
    })
  )

  useEffect(
    () => {
      parentRef.current?.addEventListener("contextmenu", handleContextMenu)

      return () => {
        parentRef.current?.removeEventListener("contextmenu", handleContextMenu)
      }
    }, []
  )

  useEffect(
    () => {
      if (!visible) {
        setContextItem(null)
      }
    }, [visible]
  )

  const [position, setPosition] = useReducer(
    (prevState: Position, newState: Position): Position => {
      if (prevState.left != newState.left || prevState.top != newState.top) {
        let newPosition = newState

        if (newState.bottom > window.innerHeight) {
          newPosition = {...newPosition, top: newState.top - (newState.bottom - newState.top)}
        }

        if (newState.right > window.innerWidth) {
          newPosition = {...newPosition, left: newState.left - (newState.right - newState.left)}
        }
        return newPosition
      } else {
        return prevState
      }
    },
    {}
  )

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()

    if (!contextRef?.current?.contains(e.target as Node)) {
      const negate = !visible

      if (parentRef.current != e.target && parentRef.current?.contains(e.target as Node)) {
        setContextItem(e.target as HTMLElement)
      }

      if (negate) {
        setX(e.pageX)
        setY(e.pageY)
      }

      setVisible(negate)
    } else {
      e.stopPropagation()
    }
  }

  const makePos = (): React.CSSProperties => {
    return {
      position: "absolute",
      top: position.top + "px",
      left: position.left + "px"
    }
  }

  return {visible, setVisible, position: makePos()}
}

export function useRelativePosition(
  elementRef: React.RefObject<HTMLElement>,
  visible: boolean,
  options?: RenderingOptions
) {

  const {offset, maxItems, itemNesting} = combineOptions(options, defaultPositionOptions)

  const [position, setPosition] = useReducer(
    (prevState: Position, newState: DOMRect): Position => {
      const overflowing = isOverflowing(newState)
      const notInitialized = !prevState.height

      if (overflowing.vertical || overflowing.horizontal || notInitialized) {
        const {top, bottom} = elementRef.current?.getBoundingClientRect() ?? {}
        const {height, flip} = calculateMaxHeight(
          {
            itemHeight: getChild(elementRef, itemNesting)?.getBoundingClientRect().height,
            space: {above: top - offset, below: window.innerHeight - bottom - offset},
            anchor: {above: top - offset, below: bottom - offset}
          },
          maxItems,
          maxItems,
          offset
        )

        if (notInitialized || flip || overflowing.vertical || overflowing.horizontal) {
          let newPosition = {...prevState, height: height}

          if (overflowing.vertical) {
            newPosition = {...newPosition, top: undefined, bottom: -1}
          }

          if (overflowing.horizontal) {
            newPosition = {...newPosition, left: undefined, right: 100}
          }

          return newPosition
        }
      } else {
        return prevState
      }
    },
    {left: 100, top: -1}
  )

  useSize(elementRef, visible, setPosition)

  return (): React.CSSProperties => {
    return {
      top: position.top != undefined ? position.top + "px" : "unset",
      bottom: position.bottom != undefined ? position.bottom + "px" : "unset",
      left: position.left != undefined ? position.left + "%" : "unset",
      right: position.right != undefined ? position.right + "%" : "unset",
      height: (position.height + offset) + "px"
    }
  }

}

type RenderingOptions = {
  offset?: number,
  itemNesting?: number,
  maxItems?: number
}

const defaultPositionOptions: RenderingOptions = {
  offset: 0,
  itemNesting: 0,
  maxItems: 8
}

type ItemFit = {
  itemHeight: number,
  space: { below: number, above: number },
  anchor: { below: number, above: number }
}

//TODO before flipping the dropdown, downsize up to prefItems/2 and only then start flipping/checking the better direction and downsizing
export function useDropdown(
  elementRef: React.RefObject<HTMLElement>,
  parentRef: React.RefObject<HTMLElement>,
  visible: boolean,
  close: () => void,
  items: number,
  options?: RenderingOptions & { useParentWidth?: boolean }
) {

  const {offset, maxItems, itemNesting} = combineOptions(options, defaultPositionOptions)

  const [position, setPosition] = useReducer(
    (prevState: Position, newState: DOMRect): Position => {
      if (!parentRef.current) {
        return prevState
      }

      const overflowing = isOverflowing(newState)
      const notInitialized = !prevState.width || !prevState.height
      const zoomChanged = Math.abs(prevState.top - newState.top) > 1

      if (overflowing.vertical || notInitialized || zoomChanged) {
        const {top, bottom, left, width, height} = parentRef.current?.getBoundingClientRect() ?? {}
        const {height: dropdownHeight, flip} = calculateMaxHeight(
          {
            itemHeight: getChild(elementRef, itemNesting)?.getBoundingClientRect().height,
            space: {above: top - offset, below: window.innerHeight - bottom - offset},
            anchor: {above: top - offset, below: bottom - offset}
          },
          items,
          maxItems,
          offset
        )

        const base = {
          top: bottom - offset,
          bottom: undefined,
          left: options.useParentWidth ? undefined : left,
          width: options.useParentWidth ? parentRef.current?.parentElement?.getBoundingClientRect()?.width : width,
          height: dropdownHeight
        }

        //TODO will this work well enough?
        if (parentRef.current?.parentElement.style.position == "absolute") {
          base.top = height + offset
          base.left = 0
        }

        if (flip) {
          base.top = top - offset - dropdownHeight
          base.bottom = top - offset
        }

        return base
      } else {
        return prevState
      }
    },
    {}
  )

  // useHideAbsolute(close)
  useSize(elementRef, visible, setPosition)

  return (): React.CSSProperties => {
    return {
      position: "absolute",
      top: position.top + "px",
      bottom: position.bottom ? position.bottom + "px" : undefined,
      left: position.left + "px",
      width: position.width + "px",
      height: position.height ? (position.height + 2 * offset) + "px" : undefined
    }
  }

}

//TODO possibly expand to handle widths and overflows, too?
export function calculateMaxHeight(
  fit: ItemFit,
  currentItems: number,
  maxItems: number,
  offset?: number
) {
  const preferredItems = currentItems > maxItems ? maxItems : currentItems
  const flip = fit.space.above > fit.space.below
  const availableSpace = window.innerHeight - (2 * offset) - (flip ? window.innerHeight - fit.anchor.above : fit.anchor.below)

  const preferredFit = fit.itemHeight * preferredItems
  const actualFit = preferredFit > availableSpace ? availableSpace - (availableSpace % fit.itemHeight) : preferredFit

  return {height: actualFit, flip: flip}
}

//TODO also probably handle top and left overflows... though those shouldn't really happen
export function isOverflowing(bounds: DOMRect, parent = {
  height: window.innerHeight,
  width: window.innerWidth
}) {
  return {vertical: bounds.bottom > parent.height, horizontal: bounds.right > parent.width}
}

export function useSize(
  elementRef: React.RefObject<HTMLElement>,
  visible?: boolean,
  onChange?: (args: DOMRect) => void
) {

  const [size, setSize] = useState<DOMRect>()

  useLayoutEffect(
    () => {
      setSize(elementRef?.current?.getBoundingClientRect())
    }, [elementRef, visible]
  )

  useLayoutEffect(
    () => {
      if (size && onChange) {
        onChange(size)
      }
    }, [size]
  )

  useResizeObserver(elementRef?.current as HTMLElement, (entry) => setSize(entry.target.getBoundingClientRect()))

  return size
}

//endregion

export type Collection<T> = Array<T> | T | null | undefined

export function useDefaultEmpty<T>(array?: Collection<T>):
  [
    Array<T>, (newState: Collection<T>) => void,
    (item: T | Array<T>, startIndex?: number) => void, (item?: T | number) => void, (item: T, index: number) => void,
    (item: unknown, index: number, propName?: string) => void
  ] {

  const [items, setItems] = useReducer(
    (prevState: Array<T>, newState: Collection<T>): Array<T> => {
      return isArray(newState) ? newState : isDefined(newState) ? [newState] : []
    },
    isArray(array) ? array : isDefined(array) ? [array] : []
  )

  const setItemsAt = (item: T, index: number) => {
    items[index] = item
    setItems([...items])
  }

  const setItemPartAt = (item: unknown, index: number, propName: string) => {
    items[index][propName] = item

    setItems([...items])
  }

  const addItem = (item: T | Array<T>, startIndex?: number) => {
    if (startIndex) {
      if (isArray(item)) {
        setItems([...items.splice(startIndex, 0, ...item)])
      } else {
        setItems([...items.splice(startIndex, 0, item)])
      }
    } else {
      if (isArray(item)) {
        setItems([...items, ...item])
      } else {
        setItems([...items, item])
      }
    }
  }

  const removeItem = (item?: T | number) => {
    if (item) {
      if (typeof item == "number") {
        setItems([...items.splice(item, 1)])
      } else {
        setItems([...items.remove(item)])
      }
    } else {
      setItems([...items.remove(items.last())])
    }
  }

  return [items, setItems, addItem, removeItem, setItemsAt, setItemPartAt]

}

export function useMultiSelect<T>(listItems: Array<T>) {

  const [ctrlMode, setCtrlMode] = useState(false)
  const [shiftMode, setShiftMode] = useState(false)

  const [selectedItems, setSelectedItems] = useReducer(
    (prevState: Array<T>, newState: Array<T>): Array<T> => {
      if (listItems.includesAll(newState)) {
        return newState
      } else {
        return prevState
      }
    },
    []
  )

  useEffect(
    () => {
      document.addEventListener("mousemove", handleKey)

      return () => {
        document.removeEventListener("mousemove", handleKey)
      }
    }, []
  )

  const handleKey = (e: MouseEvent) => {
    setShiftMode(e.shiftKey)
    setCtrlMode(e.ctrlKey)
  }

  const handleItemClick = (item: T) => {
    if (ctrlMode) {
      if (selectedItems.includes(item)) {
        if (selectedItems.length > 1) {
          setSelectedItems(Array.from(selectedItems).remove(item))
        }
      } else {
        setSelectedItems(selectedItems.concat(item))
      }
    } else if (shiftMode) {
      if (selectedItems.includes(item)) {
        setSelectedItems(listItems.slice(listItems.indexOf(selectedItems.first()!), listItems.indexOf(item) + 1))
      } else {
        const firstIndex = listItems.indexOf(selectedItems.first()!)
        const itemIndex = listItems.indexOf(item)

        if (itemIndex > firstIndex) {
          setSelectedItems(listItems.slice(firstIndex, itemIndex + 1))
        } else {
          setSelectedItems(listItems.slice(itemIndex, firstIndex + 1).reverse())
        }
      }
    } else {
      setSelectedItems([item])
    }
  }

  const resetSelection = () => {
    selectedItems.first() ? setSelectedItems([selectedItems.first()!]) : setSelectedItems([])
  }

  return {
    shiftMode,
    ctrlMode,
    selectedItems,
    setSelectedItems,
    activeItem: selectedItems.first(),
    handleItemClick,
    resetSelection
  }
}

export function useToggle(initialState?: boolean): [boolean, Dispatch<SetStateAction<boolean>>, () => void] {
  const [toggled, setToggled] = useState(initialState ?? false)

  const toggle = () => {
    setToggled(!toggled)
  }

  return [toggled, setToggled, toggle]
}

export function useTimeout(callback: () => void, timeout: number, ...watches): void {

  useEffect(
    () => {
      const timer = setTimeout(() => {callback()}, timeout)

      return () => clearTimeout(timer)
    },
    [watches]
  )

}
