import React from "react"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import List from "../../snov/list/List"

const Archive = () => {

  //make archive a custom table + same for trash (except you can trash things other than just notes)

  return (
    <SidebarContent id="archive-view">
      <List items={[]} onMultiSelect={_ => false} selected={[]}/>
    </SidebarContent>
  )

}

export default Archive