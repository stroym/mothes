import React from "react"
import {TAB_MENU, TAB_MENU_SECTION, WITH_BORDER} from "../../../util/classes"
import {joinClass} from "../../../util/utils"
import {TabMenuItemProps} from "./TabMenuItem"

export interface AlignableProps {
  alignment?: Alignment
}

export interface OrientableProps {
  orientation: Orientation
}

export interface TabMenuProps extends OrientableProps, React.HTMLProps<HTMLDivElement> {
  children: Array<React.ReactElement<TabMenuItemProps>>
  filterAlignment?: boolean
}

export const TabMenu = ({orientation, filterAlignment, className, children, ...props}: TabMenuProps) => {

  //TODO commonize with sidebar, since it's pretty much the same thing and managing tabs outside is a pain/unnecessary

  return (
    <div {...props} className={joinClass([TAB_MENU, WITH_BORDER, orientation, className])}>
      {
        filterAlignment ?
          <>
            <div className={joinClass([TAB_MENU_SECTION, Alignment.START])}>
              {children.filter(it => it.props.alignment == Alignment.START || undefined)}
            </div>
            <div className={joinClass([TAB_MENU_SECTION, Alignment.END])}>
              {children.filter(it => it.props.alignment == Alignment.END)}
            </div>
          </>
          : children
      }
    </div>
  )

}

export enum Orientation {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export enum Alignment {

  START = "start",
  END = "end"

}

export function displayTab(mapping: string, active: string): React.CSSProperties {
  return {
    display: active != mapping ? "none" : "",
    visibility: active != mapping ? "hidden" : "visible"
  }
}

export default TabMenu