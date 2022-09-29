import React from "react"
import {Key} from "ts-key-enum"

export function isArray<T>(arg: unknown): arg is Array<T> {
  return Array.isArray(arg)
}

export function isDefined<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined && arg !== null
}

export function isType<T>(arg: unknown, prop: string): arg is T {
  return arg && arg[prop]
}

export type KeyMapping = {
  key: Key | string,
  handler: () => void,
  condition?: boolean,
  modifiers?: { ctrl?: boolean, alt?: boolean, shift?: boolean }
}

export function useKey(e: React.KeyboardEvent | KeyboardEvent, keyMappings: Array<KeyMapping>) {
  const mapping = keyMappings.find(it => it.key.toLowerCase() == e.key.toLowerCase())

  if (mapping) {
    if (mapping.modifiers &&
      (mapping.modifiers.ctrl && !e.ctrlKey ||
        mapping.modifiers.alt && e.altKey ||
        mapping.modifiers.shift && !e.shiftKey)) {
      return
    }

    if (mapping.condition == undefined || mapping.condition) {
      e.preventDefault()
      mapping.handler()
    }
  }
}

export type MaybeStrings = string | undefined | null | Array<string | undefined | null>

/**
 * Helper for conditional class name composition.
 * @param className string/result of joining to return if condition resolves positively (true for booleans, a present value otherwise)
 * @param condition
 * @return className if condition is true, blank string otherwise
 */
export function checkClass(className: MaybeStrings, condition: unknown) {
  return condition ? joinClass(className) : ""
}

/**
 * Checks value(s) for blanks and concatenates the result by leading spaces. Mainly meant for building conditionless class names.
 * @param className
 * @return a blank string if className is empty, otherwise a class name string always starting with a space
 */
export function joinClass(className: MaybeStrings) {
  if (isArray(className)) {
    return className.reduce((acc, it) => {
      if (it?.isNotBlank()) {
        return acc + " " + it
      } else {
        return acc + ""
      }
    })?.trim() ?? ""
  } else {
    return className?.isNotBlank() ? className : ""
  }
}

export function makeClassName(always: MaybeStrings, conditionals: Array<[MaybeStrings, unknown]>) {
  return joinClass(always).concat(" ", joinClass(conditionals.map(it => checkClass(it[0], it[1])))).trim()
}

/**
 * Compares if the two passed arrays contain the same elements, regardless of their order.
 * @param array1
 * @param array2
 * @return true if arrays contain the same elements, false otherwise
 */
export function areArrayContentsIdentical<T>(array1: Array<T> | null | undefined, array2: Array<T> | null | undefined) {
  if (Array.isArray(array1) && Array.isArray(array2)) {
    return array1.length == array2.length && array1.every(el => array2.includes(el))
  } else {
    return false
  }
}

export function combineOptions<T>(passedOptions: T | undefined, defaultOptions: T): T {
  return passedOptions ? {...defaultOptions, ...passedOptions} : defaultOptions
}

export function getChild(elementRef: React.RefObject<Element>, nestingLevel = 0) {
  let child = elementRef?.current

  for (let i = 0; i < nestingLevel + 1; i++) {
    child = child?.children.item(0)
  }

  return child
}