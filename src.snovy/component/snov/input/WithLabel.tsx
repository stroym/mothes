import React from "react"
import {LABEL} from "../../../util/classes"
import {makeClassName} from "../../../util/utils"

interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  value: string
  position?: "before" | "after"
  vertical?: boolean
  children?: Array<React.ReactElement> | React.ReactElement
}

export const WithLabel = ({children, className, value, position, vertical, ...props}: LabelProps) => {

  if (!value) {
    return (<>{children}</>)
  }

  return (
    <label {...props} className={makeClassName([LABEL, className], [["column", vertical]])}>
      {children}
      <span style={{order: !position || position == "before" ? -1 : 100}}>{value}</span>
    </label>
  )

}

export default WithLabel