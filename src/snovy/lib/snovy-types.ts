export type ListPresets = "simple" | "editable"

export type ListChildPart<T> = {
  part: any,
  props?: any
}

export type ListChildButton<T> = {
  type: "button" | "toggle",
  action: (item: T) => void,
  icon: SnovyIconOption,
  iconFalse?: SnovyIconOption,
  toggled?: (item: T) => boolean
}

export type SnovyIconOption = "add" | "archive" | "archived" | "arrow_down" | "arrow_left" | "arrow_right" | "arrow_up" |
  "checked" | "circle" | "code_off" | "collapsed" | "detail" | "edit" | "expanded" | "export" | "favorite" |
  "favorite_fill" | "filter" | "help" | "import" | "label" | "label_new" | "manager" | "notes" | "options" |
  "remove" | "resources" | "search" | "unique"
