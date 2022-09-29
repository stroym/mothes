import React, {useEffect, useReducer, useState} from "react"
import {Alignment, Orientation, TabMenu} from "../tab_menu/TabMenu"
import TabMenuItem, {CollapseTabMenuItem, TabMenuItemProps} from "../tab_menu/TabMenuItem"
import {WITH_BORDER} from "../../../util/classes"
import {useToggle} from "../../../util/hooks"

export type SidebarTab = Omit<TabMenuItemProps, "active"> & {
  content?: JSX.Element | Array<JSX.Element> | false
  action?: () => void
  activatePrevious?: boolean
  disabled?: boolean
}

export interface SidebarProps extends React.HTMLProps<HTMLDivElement> {
  initialTab: string
  orientation: Orientation.LEFT | Orientation.RIGHT
  children: Array<SidebarTab>
}
export const Sidebar = ({initialTab, orientation, children, ...props}: SidebarProps) => {

  const defaultTab = () => {
    return children.find(it => it.itemId == initialTab)!
  }

  const [collapsed, , toggleCollapse] = useToggle(false)

  const [previouslyActive, setPreviouslyActive] = useState<SidebarTab | undefined>()

  const [active, setActive] = useReducer(
    (prevState: SidebarTab | undefined, newState: SidebarTab): SidebarTab => {
      if (prevState?.activatePrevious && newState == prevState) {
        return previouslyActive ?? defaultTab()
      }

      setPreviouslyActive(prevState)

      return newState
    },
    defaultTab()
  )

  useEffect(
    () => {
      setActive(defaultTab())
    },
    []
  )

  const tabs =
    <TabMenu orientation={orientation} id={`${orientation}-menu`} className={"snovy-side-menu"} filterAlignment>
      {[
        ...children.map((it, index) =>
          <TabMenuItem
            key={index} alignment={it.alignment} icon={it.icon} title={it.title} itemId={it.itemId} disabled={it.disabled}
            active={active.itemId == it.itemId} onClick={() => it.action ? it.action() : setActive(it)}
          />
        ),
        <CollapseTabMenuItem
          key="collapse-item" alignment={Alignment.END} orientation={orientation} onClick={toggleCollapse}
        />
      ]}
    </TabMenu>

  return (
    <>
      {orientation == Orientation.LEFT && tabs}
      <div
        {...props}
        id={`${orientation}-sidebar`}
        className={`snovy-sidebar ${WITH_BORDER} ${orientation}`}
        style={{
          display: collapsed ? "none" : "initial",
          visibility: collapsed ? "collapse" : "visible"
        }}
      >
        {active.content}
      </div>
      {orientation == Orientation.RIGHT && tabs}
    </>
  )

}

export default Sidebar