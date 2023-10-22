import Theme from "./Theme"
import Options from "./Options"

const options = new Options(-1, false)

const plainDark = new Theme(
  "Plain Dark",
  "#f8f8ff",
  "#000000",
  "#282424",
  "#a9a9a9",
  "#5f5858",
  "#d3d3d3",
  "#d3d3d3",
  "#c0c0c0"
)

const plainLight = new Theme(
  "Plain Light",
  "#000000",
  "#f8f8ff",
  "#b0a1a1",
  "#a9a9a9",
  "#5f5858",
  "#d3d3d3",
  "#d3d3d3",
  "#c0c0c0"
)

const tealDark =  new Theme(
  "Teal Dark",
  "#f8f8ff",
  "#000000",
  "#282424",
  "#000000",
  "#5f5858",
  "#40e0d0",
  "#008080",
  "#87ceeb"
)

const greenDark = Theme.makeFrom(
  plainDark,
  "Dark Green",
  {
    accent: "#556b2f",
    hover: "#6a6a00",
    active: "#9b9b00"
  }
)

const getJinxed = Theme.makeFrom(
  plainDark,
  "Get Jinxed",
  {
    accent: "#4397c5",
    border: "#54bed1",
    hover: "#b991d1",
    active: "#8c5797",
    textPrimary: "#54bed1",
    textSecondary: "#76265e"
  }
)

export const defaults = {
  options: options,
  themes: [tealDark, greenDark, getJinxed, plainDark, plainLight]
}
