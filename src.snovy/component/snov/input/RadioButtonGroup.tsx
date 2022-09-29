import React, {useEffect, useState} from "react"
import {BaseTabMenuItemProps} from "../tab_menu/TabMenuItem"
import WithLabel from "./WithLabel"
import {joinClass} from "../../../util/utils"
import {WITH_BORDER} from "../../../util/classes"
import RadioButton from "./RadioButton"

export type RadioButtonT = BaseTabMenuItemProps & {
  value: string
}

export interface RadioButtonGroupProps extends React.HTMLProps<HTMLDivElement> {
  group: string
  get: (mode: string) => void
  initial?: string
  children: Array<RadioButtonT | string>
}

export const RadioButtonGroup = (
  {
    label,
    className,
    group,
    get,
    initial,
    children,
    ...props
  }: RadioButtonGroupProps
) => {

  const [active, setActive] = useState(initial)

  useEffect(
    () => {
      setActive(initial)
      get && get(initial)
    },
    []
  )

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.value)
    get && get(e.target.value)
  }

  return (
    <div {...props} className={joinClass(["snovy-radio-group", WITH_BORDER, className])}>
      <WithLabel value={label}>
        {
          children.map((it, index) =>
            <RadioButton
              key={`${group}-${index}`} label={it["label"] ?? it["value"] ?? it} value={it["value"] ?? it}
              name={group} title={it["title"]} disabled={it["disabled"]}
              defaultChecked={active == (it["value"] ?? it)} onChange={update}
            />
          )
        }
      </WithLabel>
    </div>
  )

}

export default RadioButtonGroup