import {Key} from "ts-key-enum"

export function isKeyboardEvent(e: MouseEvent | KeyboardEvent): e is KeyboardEvent {
  return e.type === "keypress"
}

export function isActionEvent(e: MouseEvent | KeyboardEvent) {
  return !isKeyboardEvent(e) || isKeyboardEvent(e) && e.key == Key.Enter
}
