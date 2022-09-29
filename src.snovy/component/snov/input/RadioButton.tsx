import React, {InputHTMLAttributes} from "react"
import WithLabel from "./WithLabel"

export interface RadioButtonProps extends InputHTMLAttributes<never> {
  label?: string
}

export const RadioButton = (
  {label, ...props}: RadioButtonProps
) => {

  return (
    <WithLabel className="snovy-radio-label" value={label}>
      <input {...props} className="snovy-radio" type="radio"/>
    </WithLabel>
  )

}

export default RadioButton