import React from "react"
import {WITH_BORDER} from "../../../util/classes"
import {joinClass} from "../../../util/utils"

export interface SidebarContentProps extends React.HTMLProps<HTMLDivElement> {
  bodyClass?: string
  heading?: React.ReactNode
  footing?: React.ReactNode
}

export const SidebarContent = ({children, heading, footing, className, bodyClass, ...props}: SidebarContentProps) => {

  return (
    <div {...props} className={joinClass(["sidebar-content", className])}>
      {
        heading &&
          <div className={joinClass(["sidebar-heading", WITH_BORDER, "bottom"])}>
            {heading}
          </div>
      }
      <div className={joinClass(["sidebar-body", bodyClass])} tabIndex={-1}>
        {children}
      </div>
      {
        footing &&
          <div className={joinClass(["sidebar-footing", WITH_BORDER, "top"])}>
            {footing}
          </div>
      }
    </div>
  )

}

export default SidebarContent