import React, {useRef} from "react"
import {ContextMenuItemProps} from "./ContextMenuItem"
import {joinClass} from "../../../util/utils"
import {ABSOLUTE, WITH_BORDER} from "../../../util/classes"
import {useContextMenu} from "../../../util/hooks"

export interface ContextMenuProps {
  parentRef: React.RefObject<HTMLElement>,
  children: Array<React.ReactElement<ContextMenuItemProps> | undefined> | React.ReactElement<ContextMenuItemProps>,
  onFinish?: () => void
}

const ContextMenu = ({parentRef, children, onFinish}: ContextMenuProps) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, setVisible, position} = useContextMenu(selfRef, parentRef, {offset: 1})

  return (
    <>
      {visible &&
      <div
        className={joinClass(["snovy-context-menu", ABSOLUTE, WITH_BORDER])} ref={selfRef} style={position}
        onClick={() => {
          onFinish && onFinish()
          setVisible(false)
        }}
      >
        {children}
      </div>
      }
    </>
  )

}

export default ContextMenu