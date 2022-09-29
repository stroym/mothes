import {default as TinyColor} from "tinycolor2"
import type {WithColor} from "./types"
import {isArray} from "./utils"

//TODO try to implement a provider that TinyStyle would use so all these things don't have to be passed everywhere...

export type ReactiveTextColor = {
  textColors?: TextColorPair
}

export type TextColorPair = {
  textPrimary: string
  textSecondary: string
}

export type Background = {
  background: string
}

export type ReactiveColor = (Background & TextColorPair) | ReactiveColorFromTheme

export type ReactiveColorFromTheme = Background & {
  theme: TextColorPair
}

function hasTheme(readable: ReactiveColor): readable is ReactiveColorFromTheme {
  return readable["theme"]
}

class TinyStyle {

  tiny: TinyColor.Instance
  maxAdjustment?: number

  primary: string
  secondary: string

  constructor(background: string, primary: string, secondary: string, maxAdjustment?: number) {
    this.tiny = new TinyColor(background)
    this.primary = primary
    this.secondary = secondary
    this.maxAdjustment = maxAdjustment
  }

  public static fromReadable(readable: ReactiveColor) {
    if (hasTheme(readable)) {
      return new TinyStyle(readable.background, readable.theme.textPrimary, readable.theme.textSecondary)
    } else {
      return new TinyStyle(readable.background, readable.textPrimary, readable.textSecondary)
    }
  }

  public static withAdjustment(background: string, theme: TextColorPair, maxAdjustment?: number) {
    return new TinyStyle(background, theme.textPrimary, theme.textSecondary, maxAdjustment)
  }

  public static withAdjustmentFromItem(item: WithColor | Array<WithColor>, theme: TextColorPair, maxAdjustment?: number) {
    const first = isArray(item) ? item.first()! : item

    return TinyStyle.withAdjustment(first.color, theme, maxAdjustment)
  }

  public evaluateText() {
    if (this.maxAdjustment) {
      const tinyClone = this.tiny.clone()

      return this.eval(this.maxAdjustment > 0 ? tinyClone.brighten(this.maxAdjustment) : tinyClone.darken(-this.maxAdjustment))
    } else {
      return this.eval(this.tiny)
    }
  }

  makeStyle() {
    return {
      "backgroundColor": this.tiny.toHex8String(),
      "color": this.evaluateText()
    }
  }

  lighten(amount: number) {
    return {backgroundColor: this.tiny.clone().brighten(amount).toHex8String()}
  }

  darken(amount: number) {
    return {backgroundColor: this.tiny.clone().darken(amount).toHex8String()}
  }

  private eval(color: TinyColor.Instance) {
    if (TinyColor.isReadable(color, this.primary) || TinyColor.readability(color, this.primary) > TinyColor.readability(color, this.secondary)) {
      return this.primary
    } else {
      return this.secondary
    }
  }

}

export function evaluateReadability(theme: TextColorPair, field: "primary" | "secondary" | "textPrimary" | "textSecondary" | "accent" | "border" | "hover" | "activeItem") {
  return new TinyStyle(theme[field], theme.textPrimary, theme.textSecondary).evaluateText()
}

export default TinyStyle
