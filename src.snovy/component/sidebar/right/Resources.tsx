import React from "react"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import {GenericItem} from "../../../util/types"

export interface ResourcesProps<T extends GenericItem> extends React.HTMLProps<HTMLDivElement> {
  item: T | undefined
}

const Resources = <T extends GenericItem>() => {

  return (
    <SidebarContent id="resources-view">
      {/*<List items={items} onSelect={blob => {}} selection={[]}/>*/}
    </SidebarContent>
  )

}

export default Resources