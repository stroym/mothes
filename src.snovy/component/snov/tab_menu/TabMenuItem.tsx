import React from "react"
import {AlignableProps, OrientableProps, Orientation} from "./TabMenu"
import {default as UpArrow} from "../../../../public/icons/arrows/up.svg"
import {default as RightArrow} from "../../../../public/icons/arrows/right.svg"
import {default as DownArrow} from "../../../../public/icons/arrows/down.svg"
import {default as LeftArrow} from "../../../../public/icons/arrows/left.svg"
import {checkClass, makeClassName} from "../../../util/utils"
import {I_ACTIVE, STYLED_HOVER_FILL, TAB_MENU_ITEM} from "../../../util/classes"
import {useToggle} from "../../../util/hooks"

export interface BaseTabMenuItemProps extends AlignableProps, Omit<React.HTMLProps<HTMLButtonElement>, "action" | "content"> {
  itemId?: string
  icon?: JSX.Element
}

export const BaseTabMenuItem = (
  {
    alignment,
    itemId,
    icon,
    className,
    ...props
  }: BaseTabMenuItemProps
) => {

  return (
    <button
      {...props} type="button" tabIndex={0}
      className={makeClassName([TAB_MENU_ITEM, STYLED_HOVER_FILL, alignment, className], [["icon", icon]])}
    >
      {icon ?? itemId}
    </button>
  )

}

export interface TabMenuItemProps extends BaseTabMenuItemProps {
  itemId: string
  active: boolean
}

const TabMenuItem = ({active, ...props}: TabMenuItemProps) => {

  return <BaseTabMenuItem {...props} className={checkClass(I_ACTIVE, active)}/>

}

export const CollapseTabMenuItem = ({orientation, onClick, ...props}: BaseTabMenuItemProps & OrientableProps) => {

  const [toggled, , toggle] = useToggle()

  const getIcon = () => {
    switch (orientation) {
      case Orientation.TOP:
        return toggled ? <DownArrow/> : <UpArrow/>
      case Orientation.BOTTOM:
        return toggled ? <UpArrow/> : <DownArrow/>
      case Orientation.LEFT:
        return toggled ? <LeftArrow/> : <RightArrow/>
      case Orientation.RIGHT:
        return toggled ? <RightArrow/> : <LeftArrow/>
    }
  }

  return <BaseTabMenuItem
    {...props}
    icon={getIcon()}
    title={toggled ? "Expand" : "Collapse"}
    onClick={e => {
      toggle()
      onClick && onClick(e)
    }}
  />

}

export default TabMenuItem