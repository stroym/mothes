import React, {forwardRef} from "react"
import {LABEL} from "../../../../util/classes"
import {UseComboboxGetLabelPropsOptions} from "downshift"
import {default as HelpIcon} from "../../../../../public/icons/help.svg"

export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  value: string
  getLabelProps: (options?: (UseComboboxGetLabelPropsOptions | undefined)) => unknown
}

const DownshiftLabel = forwardRef((
  {id, value, title, getLabelProps}: LabelProps,
  ref: React.Ref<HTMLLabelElement>
) => {

  return (

    <label {...getLabelProps()} ref={ref} id={id} className={LABEL} title={title}>
      {value}
      {title && <HelpIcon/>}
    </label>
  )

})

DownshiftLabel.displayName = "DownshiftLabel"

export default DownshiftLabel
