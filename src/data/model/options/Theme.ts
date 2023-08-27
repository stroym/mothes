import {Titled} from "../Base"
import {dexie} from "../../../index"
import type {TextColorPair} from "../../../util/colors"

export class Theme extends Titled implements TextColorPair {

  static readonly VAR_NAMES: Map<string, string> = new Map<string, string>([
    ["textPrimary", "--color-text"],
    ["textSecondary", "--color-text-complementary"],
    ["primary", "--color-main"],
    ["accent", "--color-accent"],
    ["border", "--color-border"],
    ["hover", "--color-hover"],
    ["focus", "--color-focus"],
    ["active", "--color-active"],
  ])

  textPrimary: string
  textSecondary: string

  primary: string
  accent: string //TODO currently unused - possibly to be removed
  border: string
  hover: string
  focus: string
  active: string

  constructor(title: string, textPrimary: string, textSecondary: string, primary: string, accent: string,
              border: string, hover: string, focus: string, active: string, id?: number) {
    super(title, id)
    this.textPrimary = textPrimary
    this.textSecondary = textSecondary
    this.primary = primary
    this.accent = accent
    this.border = border
    this.hover = hover
    this.focus = focus
    this.active = active
  }

  setCss() {
    let root = document.documentElement;

    root.style.setProperty(Theme.VAR_NAMES.get("textPrimary"), this.textPrimary)
    root.style.setProperty(Theme.VAR_NAMES.get("textSecondary"), this.textSecondary)
    root.style.setProperty(Theme.VAR_NAMES.get("primary"), this.primary)
    root.style.setProperty(Theme.VAR_NAMES.get("accent"), this.accent)
    root.style.setProperty(Theme.VAR_NAMES.get("border"), this.border)
    root.style.setProperty(Theme.VAR_NAMES.get("hover"), this.hover)
    root.style.setProperty(Theme.VAR_NAMES.get("focus"), this.focus)
    root.style.setProperty(Theme.VAR_NAMES.get("active"), this.active)
  }

  static makeFrom(source: Theme, title: string, colors?: {
    primary?: string
    secondary?: string
    textPrimary?: string
    textSecondary?: string
    accent?: string
    border?: string
    hover?: string
    focus?: string
    active?: string
  }) {
    return new Theme(
      title,
      colors?.textPrimary ? colors.textPrimary : source.textPrimary,
      colors?.textSecondary ? colors.textSecondary : source.textSecondary,
      colors?.primary ? colors.primary : source.primary,
      colors?.accent ? colors.accent : source.accent,
      colors?.border ? colors.border : source.border,
      colors?.hover ? colors.hover : source.hover,
      colors?.focus ? colors.focus : source.focus,
      colors?.active ? colors.active : source.active
    )
  }

  static makeEmpty() {
    return new Theme("", "", "", "", "", "", "", "", "")
  }

  async delete() {
    return dexie.transaction("rw", dexie.themes, () => {dexie.themes.delete(this.id)})
      .then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([]).then(_it => this)
  }

  async save() {
    return dexie.transaction("rw", dexie.themes, async () => {
      dexie.themes.put(this, this.id)
    }).then(_it => this)
  }

  toString(): string {
    return this.title
  }

  clone() {
    return Object.create(this)
  }

}
