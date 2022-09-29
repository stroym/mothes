import React, {useEffect, useRef, useState} from "react"
import {useDefaultEmpty} from "../../../util/hooks"
import ContextMenu from "./ContextMenu"
import {ContextMenuItemProps} from "./ContextMenuItem"
import {GenericItem} from "../../../util/types"

export interface ContextTarget<T extends GenericItem> {
  onMultiSelect: (selection: Array<T>) => void
  selected: Array<T>
  onContext: (item: T | undefined) => void
  ref: React.Ref<HTMLElement>
}

export interface ContextWrapperProps<T extends GenericItem> {
  children: React.ReactElement<ContextTarget<T>>,
  makeContextItems: (context: T | undefined, selected: Array<T>) => Array<React.ReactElement<ContextMenuItemProps> | undefined>
}

const WithContext = <T extends GenericItem>(
  {
    children,
    makeContextItems,
  }: ContextWrapperProps<T>
) => {

  const targetRef = useRef<HTMLElement>(null)

  const [contextItem, setContextItem] = useState<T | undefined>(undefined)
  const [selected, setSelected] = useDefaultEmpty<T>()

  useEffect(
    () => {
      if (contextItem && !selected.isEmpty() && !selected.includes(contextItem)) {
        setSelected([selected.first()!])
      }
    }, [contextItem]
  )

  const doctorChildren = (children: React.ReactElement<ContextTarget<T>>) => {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ref: targetRef,
        onMultiSelect: setSelected,
        selected: selected,
        onContext: setContextItem
      })
    })
  }

  return (
    <>
      <ContextMenu parentRef={targetRef} onFinish={() => setContextItem(undefined)}>
        {makeContextItems(contextItem, selected)}
      </ContextMenu>
      {doctorChildren(children)}
    </>
  )

}

export default WithContext