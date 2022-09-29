import {EditorState, liftListItem, MarkType, redo, sinkListItem, TextSelection, undo, wrapIn} from "@milkdown/prose"
import {Theme} from "../../data/model/options/Theme"
import {default as TinyColor} from "tinycolor2"
import {defaultValueCtx, Editor as MilkyEditor, editorViewOptionsCtx, rootCtx, themeFactory} from "@milkdown/core"
import {listener, listenerCtx} from "@milkdown/plugin-listener"
import {gfm} from "@milkdown/preset-gfm"
import {cursor} from "@milkdown/plugin-cursor"
import {diagram} from "@milkdown/plugin-diagram"
import {history} from "@milkdown/plugin-history"
import {menu} from "@milkdown/plugin-menu"
import {setBlockType} from "prosemirror-commands"

export const createEditor = (
  root: HTMLElement | null,
  theme: Theme,
  defaultValue: string,
  onChange?: (markdown: string) => void,
  readOnly?: boolean
) => {

  //TODO probably don't bother with size/color since I have to override half the things anyway...
  const milkTheme = themeFactory(_ => ({
      size: {
        lineWidth: "2px",
        radius: "5px"
      },
      color: {
        shadow: "#ff0000",
        primary: theme.textPrimary,
        secondary: theme.accent,
        neutral: new TinyColor(theme.accent).lighten(20).toHexString(),
        solid: theme.textPrimary,
        line: theme.border,
        background: new TinyColor(theme.primary).darken(5).toHexString(),
        surface: new TinyColor(theme.primary).darken(10).toHexString()
      },
      slots: () => ({
        icon: (id) => {
          const span = document.createElement("span")
          span.className = "icon material-icons-round"

          const mapping = iconMapping[id]

          span.textContent = mapping?.icon

          if (mapping?.label) {
            span.title = mapping?.label
          }

          return span
        }
      })
    }
  ))

  const editor = MilkyEditor.make().config(ctx => {
    ctx.set(rootCtx, root)
    ctx.set(defaultValueCtx, defaultValue)
    ctx.set(editorViewOptionsCtx, {editable: () => !readOnly})

    onChange && ctx.get(listenerCtx).markdownUpdated((_, markdown) => onChange(markdown))
  })
    .use(milkTheme)
    .use(listener)
    .use(cursor)
    .use(history)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .use(gfm).use(diagram)

  if (!readOnly) {
    // @ts-ignore
    editor.use(menu({config: menuConfig}))
  }

  return editor
}

export const menuConfig = [
  [
    {
      type: "select",
      text: "Heading",
      options: [
        {id: "1", text: "H1"},
        {id: "2", text: "H2"},
        {id: "3", text: "H3"},
        {id: "4", text: "H4"},
        {id: "5", text: "H5"},
        {id: "6", text: "H6"},
        {id: "0", text: "Text"}
      ],
      disabled: view => {
        const setToHeading = (level: number) => setBlockType(view.state.schema.nodes.heading, {level})(view.state)
        return (
          !(view.state.selection instanceof TextSelection) || ![1, 2, 3, 4, 5, 6].find(it => setToHeading(it))
        )
      },
      onSelect: (id) => (id ? ["TurnIntoHeading", Number(id)] : ["TurnIntoText", null])
    }
  ],
  [
    {
      type: "button",
      icon: "bold",
      key: "ToggleBold",
      active: view => hasMark(view.state, view.state.schema.marks.strong),
      disabled: view => !view.state.schema.marks.strong
    },
    {
      type: "button",
      icon: "italic",
      key: "ToggleItalic",
      active: view => hasMark(view.state, view.state.schema.marks.em),
      disabled: view => !view.state.schema.marks.em
    },
    {
      type: "button",
      icon: "strikeThrough",
      key: "ToggleStrikeThrough",
      active: view => hasMark(view.state, view.state.schema.marks.strike_through),
      disabled: view => !view.state.schema.marks.strike_through
    }
  ],
  [
    {
      type: "button",
      icon: "link",
      key: "ToggleLink",
      active: view => hasMark(view.state, view.state.schema.marks.link)
    },
    {
      type: "button",
      icon: "image",
      key: "InsertImage"
    }
  ],
  [
    {
      type: "button",
      icon: "quote",
      key: "WrapInBlockquote"
    },
    {
      type: "button",
      icon: "divider",
      key: "InsertHr"
    },
    {
      type: "button",
      icon: "table",
      key: "InsertTable"
    },
    {
      type: "button",
      icon: "code",
      key: "TurnIntoCodeFence"
    }
  ],
  [
    {
      type: "button",
      icon: "bulletList",
      key: "WrapInBulletList",
      disabled: view => !wrapIn(view.state.schema.nodes.bullet_list)(view.state)
    },
    {
      type: "button",
      icon: "orderedList",
      key: "WrapInOrderedList",
      disabled: view => !wrapIn(view.state.schema.nodes.ordered_list)(view.state)
    },
    {
      type: "button",
      icon: "taskList",
      key: "TurnIntoTaskList",
      disabled: view => !wrapIn(view.state.schema.nodes.task_list_item)(view.state)
    },
    {
      type: "button",
      icon: "liftList",
      key: "LiftListItem",
      disabled: view => !liftListItem(view.state.schema.nodes.list_item)(view.state)
    },
    {
      type: "button",
      icon: "sinkList",
      key: "SinkListItem",
      disabled: view => !sinkListItem(view.state.schema.nodes.list_item)(view.state)
    }
  ],
  [
    {
      type: "button",
      icon: "undo",
      key: "Undo",
      disabled: view => !undo(view.state)
    },
    {
      type: "button",
      icon: "redo",
      key: "Redo",
      disabled: view => !redo(view.state)
    },
  ]
]

export const iconMapping: Record<string, { label?: string, icon: string }> = {
  t: {
    label: "Text",
    icon: "title"
  },
  h1: {
    label: "Heading 1",
    icon: "looks_one"
  },
  h2: {
    label: "Heading 2",
    icon: "looks_two"
  },
  h3: {
    label: "Heading 3",
    icon: "looks_3"
  },
  h4: {
    label: "Heading 4",
    icon: "looks_4"
  },
  h5: {
    label: "Heading 5",
    icon: "looks_5"
  },
  h6: {
    label: "Heading 6",
    icon: "looks_6"
  },
  loading: {
    icon: "hourglass_empty"
  },
  quote: {
    label: "Quote block",
    icon: "format_quote"
  },
  code: {
    label: "Code block",
    icon: "code"
  },
  table: {
    label: "Table",
    icon: "table_chart"
  },
  divider: {
    label: "Divider",
    icon: "horizontal_rule"
  },
  image: {
    label: "Image",
    icon: "image"
  },
  brokenImage: {
    label: "Broken image",
    icon: "broken_image"
  },
  bulletList: {
    label: "Bullet list",
    icon: "format_list_bulleted"
  },
  orderedList: {
    label: "Ordered list",
    icon: "format_list_numbered"
  },
  taskList: {
    label: "Check list",
    icon: "checklist"
  },
  bold: {
    label: "Bold",
    icon: "format_bold"
  },
  italic: {
    label: "Italic",
    icon: "format_italic"
  },
  inlineCode: {
    label: "Code",
    icon: "code"
  },
  strikeThrough: {
    label: "Strikethrough",
    icon: "strikethrough_s"
  },
  link: {
    label: "Link",
    icon: "link"
  },
  leftArrow: {
    icon: "chevron_left"
  },
  rightArrow: {
    icon: "chevron_right"
  },
  upArrow: {
    icon: "expand_less"
  },
  downArrow: {
    icon: "expand_more"
  },
  alignLeft: {
    icon: "format_align_left"
  },
  alignRight: {
    icon: "format_align_right"
  },
  alignCenter: {
    icon: "format_align_center"
  },
  delete: {
    label: "Delete",
    icon: "delete"
  },
  select: {
    label: "Select",
    icon: "select_all"
  },
  unchecked: {
    icon: "check_box_outline_blank"
  },
  checked: {
    icon: "check_box"
  },
  undo: {
    label: "Undo",
    icon: "turn_left"
  },
  redo: {
    label: "Redo",
    icon: "turn_right"
  },
  liftList: {
    label: "Indent -",
    icon: "format_indent_decrease"
  },
  sinkList: {
    label: "Indent +",
    icon: "format_indent_increase"
  }
}

const hasMark = (state: EditorState, type: MarkType): boolean => {
  if (!type) {
    return false
  }

  const {from, $from, to, empty} = state.selection

  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks())
  }

  return state.doc.rangeHasMark(from, to, type)
}