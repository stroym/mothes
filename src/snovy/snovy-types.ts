export type ListPresets = "simple" | "editable"

export type CustomizableChild = {
  component?: any, props?: { onAction: (args) => {} }
  icon?: { icon: SnovyIconOption, color?: string }
  button?: { icon: SnovyIconOption, action: (e: MouseEvent | KeyboardEvent) => {} }
}

export type SnovyIconOption = "add" | "archive" | "archived" | "arrow_down" | "arrow_left" | "arrow_right" | "arrow_up" |
  "checked" | "circle" | "code_off" | "collapsed" | "detail" | "edit" | "expanded" | "export" | "favorite" |
  "favorite_fill" | "filter" | "help" | "import" | "label" | "label_new" | "manager" | "notes" | "options" |
  "remove" | "resources" | "search" | "unique"
