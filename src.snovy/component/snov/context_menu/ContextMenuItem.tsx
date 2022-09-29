import React, {useRef, useState} from "react"
import {joinClass} from "../../../util/utils"
import {ABSOLUTE, WITH_BORDER} from "../../../util/classes"
import {useRelativePosition} from "../../../util/hooks"

export interface ContextMenuItemProps {
  icon?: string,
  text: string,
  onClick?: () => void,
  special?: { text?: string, onClick?: () => void }
  children?: Array<React.ReactElement<ContextMenuItemProps>>
}

export const ContextMenuItem = ({icon, text, onClick, special, children}: ContextMenuItemProps) => {

  const nestedRef = useRef<HTMLDivElement>(null)

  const [nested, setNested] = useState(false)
  const position = children && useRelativePosition(nestedRef, nested, {offset: 1})

  return (
    <div
      className={joinClass(["snovy-context-menu-container", WITH_BORDER, "bottom"])}
      onMouseEnter={() => {setNested(true)}}
      onMouseLeave={() => {setNested(false)}}
    >
      <div className="snovy-context-menu-item" onClick={special ? () => false : onClick}>
      <span className="snovy-context-menu-item-inner styled-hover-fill" onClick={special ? onClick : () => false}>
        {
          icon && <span className={joinClass(["context-icon", WITH_BORDER, "right"])}>{icon}</span>
        }
        <span className="context-text">
          {text}
        </span>
      </span>
        {
          special?.text &&
          <span className="context-text-special styled-hover-fill" onClick={special.onClick}>
            {special.text}
          </span>
        }
      </div>
      {
        position && nested &&
        <div
          ref={nestedRef} style={position()}
          className={joinClass(["snovy-context-menu", "nested-context-menu", "snovy-scroll", ABSOLUTE])}
        >
          {children}
        </div>
      }
    </div>
  )

}

export function makeContext(text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void) {
  return (
    <ContextMenuItem
      key={text} icon={icon} text={text} onClick={action} special={{text: specialText, onClick: specialAction}}
    />
  )
}

export function makeSharedContext(params: {
  single: { text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void },
  multiple?: { condition: boolean, text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void },
  children?: Array<React.ReactElement<ContextMenuItemProps>>,
  icon?: string
}) {

  if (params.multiple && params.multiple.condition) {
    return (
      <ContextMenuItem
        key={params.multiple.text} icon={params.single.icon ?? params.icon}
        text={params.multiple.text} onClick={params.multiple.action}
        special={{text: params.multiple.specialText, onClick: params.multiple.specialAction}}
      >
        {params.children}
      </ContextMenuItem>
    )
  } else {
    return (
      <ContextMenuItem
        key={params.single.text} icon={params.single.icon ?? params.icon}
        text={params.single.text} onClick={params.single.action}
        special={{text: params.single.specialText, onClick: params.single.specialAction}}
      >
        {params.children}
      </ContextMenuItem>
    )
  }

}

export function makeNestedContext(text: string, children: Array<React.ReactElement<ContextMenuItemProps>>, icon?: string) {
  return (
    <ContextMenuItem key={text} icon={icon} text={text}>
      {children}
    </ContextMenuItem>
  )
}

export default ContextMenuItem