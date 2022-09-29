import React from "react"
import {WithColor, WithTitle} from "../../../util/types"
import {ColorHelper} from "../input/ColorPicker"
import {joinClass} from "../../../util/utils"
import {WITH_BORDER} from "../../../util/classes"
import {useTheme} from "@emotion/react"
import {highlightSearchedText} from "../input/downshift/downshiftUtils"

export interface HighlightProps {
  item: WithTitle & WithColor
  watch?: string
}

export interface ColoredListItemProps extends HighlightProps, React.HTMLProps<HTMLDivElement> {
  colorIcon?: JSX.Element | false
}

//TODO integrate into presets for combobox/list items?

const ColoredListItem = ({item, watch, colorIcon, className, ...props}: ColoredListItemProps) => {

  return (
    <div {...props} className={joinClass(["snovy-color-list-item", className])}>
      <ColorHelper className={WITH_BORDER} colors={{background: item.color, theme: useTheme()}}>
        {colorIcon}
      </ColorHelper>
      <span className="title-helper">{highlightSearchedText(item.title, watch)}</span>
    </div>
  )

}

export default ColoredListItem