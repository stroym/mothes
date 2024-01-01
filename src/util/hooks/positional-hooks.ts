//TODO before flipping the dropdown, downsize up to prefItems/2 and only then start flipping/checking the better direction and downsizing
import {combineOptions, getChild} from "../utils"
import {install, ResizeObserver} from "resize-observer"
import {get, writable} from "svelte/store"

export function useDropdown(
  dropdownRef: HTMLElement,
  comboRef: HTMLElement,
  visible: boolean,
  close: () => void,
  items: number,
  options?: RenderingOptions & { useParentWidth?: boolean }
) {

  if (!dropdownRef || !comboRef) {
    return
  }

  const {offset, maxItems, itemNesting} = combineOptions(options, defaultPositionOptions)

  const position = writable<Position>({})

  const updatePosition = (newState: DOMRect) => {
    position.update(prevState => {
      if (!comboRef) {
        return prevState
      }

      const overflowing = isOverflowing(newState)
      const notInitialized = !prevState.width || !prevState.height
      const zoomChanged = Math.abs(prevState.top - newState.top) > 1

      if (overflowing.vertical || notInitialized || zoomChanged) {
        const {top, bottom, left, width, height} = comboRef.getBoundingClientRect()
        const {height: dropdownHeight, flip} = calculateMaxHeight(
          {
            itemHeight: getChild(dropdownRef, itemNesting)?.getBoundingClientRect().height,
            space: {above: top - offset, below: window.innerHeight - bottom - offset},
            anchor: {above: top - offset, below: bottom - offset}
          },
          items,
          maxItems,
          offset
        )

        const immediateParentRef = comboRef.parentElement
        const dialogRef = comboRef.closest("dialog") //TODO i mean, this works, but... isn't there a better way?

        const base = {
          top: bottom - offset,
          bottom: undefined,
          left: options.useParentWidth ? undefined : left - (dialogRef?.getBoundingClientRect()?.left ?? 0),
          width: options.useParentWidth ? immediateParentRef.getBoundingClientRect().width : width,
          height: dropdownHeight
        }

        //TODO will this work well enough?
        if (immediateParentRef.style.position == "absolute") {
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
    })
  }

  //TODO ideally this should work...
  // useHideAbsolute(close)
  useSize(dropdownRef, visible, updatePosition)

  return () => {
    const pos = get(position)

    return {
      position: "absolute",
      top: pos.top + "px",
      bottom: pos.bottom ? pos.bottom + "px" : undefined,
      left: pos.left + "px",
      width: pos.width + "px",
      height: pos.height ? (pos.height + 2 * offset) + "px" : undefined
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
  elementRef: HTMLElement,
  visible?: boolean,
  onChange?: (args: DOMRect) => void
) {

  if (!window.ResizeObserver) {
    install()
  }

  const size = writable<DOMRect>()

  let observer: ResizeObserver = new ResizeObserver(entry => {
    size.set(entry[0].target.getBoundingClientRect())
  })

  if (elementRef || visible) {
    observer.observe(elementRef)
    size.set(elementRef?.getBoundingClientRect())
  }

  if (size && onChange) {
    onChange(get(size))
  }

  return size
}

type Position = {
  left?: number,
  top?: number,
  right?: number,
  bottom?: number,
  width?: number,
  height?: number
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
