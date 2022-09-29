import React, {useState} from "react"
import {useDefaultEmpty} from "../../../util/hooks"
import {ColoredCustomItem, WatchableCustomItem, WithColor, WithTitle} from "../../../util/types"
import {TextColorPair} from "../../../util/colors"
import {Button} from "../input/Button"
import {Filter, Logic} from "../../../util/query"
import {WITH_BORDER} from "../../../util/classes"
import {isArray, joinClass} from "../../../util/utils"

export interface FilterProps<T> extends React.HTMLProps<HTMLDivElement> {
  getMatches?: (matches: Array<Filter<T>>) => void
  label?: string
  filterKey: string,
  items: Array<T>,
  sort?: (a: T, B: T) => number,
  customItem?: WatchableCustomItem<T>
  selectedItemsStyle?: {
    textColors: TextColorPair
    customItem?: ColoredCustomItem<T>
    className?: string
  }
}

export type FilterGroup<T> = Filter<T> | Logic

export class FilterPart<T> {

  values: Array<T> = []
  beforeRel?: Logic
  afterRel?: Logic

  constructor(values: T | Array<T>, beforeRel?: Logic, afterRel?: Logic) {
    this.values = isArray(values) ? values : [values]
    this.beforeRel = beforeRel
    this.afterRel = afterRel
  }

}

export const FilterGroup = <T extends WithTitle & WithColor>(
    {
      items,
      selectedItemsStyle,
      label,
      getMatches,
      ...props
    }: FilterProps<T>
) => {

  const [filters, , addFilter, removeFilter, setFilterAt, updateFilter] = useDefaultEmpty<FilterPart<T>>()

  const [beforeRel, setBeforeRel] = useState<Logic | undefined>()
  const [afterRel, setAfterRel] = useState<Logic | undefined>()

  return (
      <div className={"snovy-filter-group"} {...props}>
        {
          filters.map((it, index) =>
              <>
                <div className={joinClass(["snovy-filter-unit", WITH_BORDER])} key={`filter-${index}-select`}>
                  {
                    it.beforeRel
                  }
                  {
                    it.values.map(it => it.title)
                  }
                  {
                    it.afterRel
                  }
                </div>
              </>
        )
      }
        <Button preset={"add"} border onClick={() => addFilter(new FilterPart(items.last()))}/>
    </div>
  )
}

export default FilterGroup
