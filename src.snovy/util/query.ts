import {isArray} from "./utils"

export type Logic = "OR" | "AND"

export type Filter<T> = { key: string, logic: Logic, matches: Array<T> }

export type ParamType = "TEXT" | "TITLE" | "BODY" | "STATE" | "CATEGORY" | "TAG"

export type Query = Array<Logic | Record<ParamType, string>>

//TODO this is more or less sufficient for L1 filtering
// L2 = user insertable brackets
// L3 = nesting

export function translateQuery(rawQuery: Array<Array<string> | string>): Query {
  //[ [TAG] OR [TITLE] ]

  console.log(rawQuery)

  const query = []

  rawQuery.forEach(it => {
    let part = ""
    let type = ""

    if (!isArray(it)) {
      query.push([it])
    } else {
      it.forEach(it => {
        if (it == "AND" || it == "OR") {
          part += " " + it + " "
        } else if (it.includes("Q_TYPE=")) {
          type = it.substring(7, it.indexOf(";")).toUpperCase()
        } else if (it.includes("Q_REL=")) {
          const typeEnd = it.indexOf(";")
          const rel = it.substring(6, typeEnd)
          const parts = it.substring(typeEnd + 1).split(",")

          part += "(" + parts.map(it => it + (parts.indexOf(it) != parts.length - 1 ? " " + rel + " " : "")).join("") + ")"
        }
      })

      query.push({type, part})
    }
  })

  console.log(query)

  return query
}

export function filterQuery(query: Query) {

}

export function makeQueryPart(type: string, filters: Array<Filter<unknown> | Logic>) {
  return [
    `Q_TYPE=${type};`, ...filters.map(it => {
      if (typeof it == "string") {
        return it
      } else {
        return "Q_REL=" + it.logic + ";" + it.matches.map(it => it["id"])
      }
    })
  ]
}