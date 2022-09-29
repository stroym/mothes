import React, {useState} from "react"
import {useDefaultEmpty, useToggle} from "../../../util/hooks"
import MultiSelect from "../input/downshift/MultiSelect"
import {ColoredCustomItem, WatchableCustomItem, WithColor, WithTitle} from "../../../util/types"
import {TextColorPair} from "../../../util/colors"
import {Button} from "../input/Button"
import RadioButtonGroup from "../input/RadioButtonGroup"
import {Filter, Logic, makeQueryPart, translateQuery} from "../../../util/query"
import {WITH_BORDER} from "../../../util/classes"
import {isType, joinClass} from "../../../util/utils"

export interface FilterContainerProps<T> extends React.HTMLProps<HTMLDivElement> {
    getMatches?: (matches: Array<Filter<T>>) => void
    label?: string
    items: Array<{ key: string, values: Array<T>, sort?: (a: T, B: T) => number, customItem?: WatchableCustomItem<T> }>
    selectedItemsStyle?: {
        textColors: TextColorPair
        customItem?: ColoredCustomItem<T>
        className?: string
    }
}

export type FilterGroup<T> = Filter<T> | Logic

export const FilterContainer = <T extends WithTitle & WithColor>(
    {
        items,
        selectedItemsStyle,
        label,
        getMatches,
        ...props
    }: FilterContainerProps<T>
) => {

    const [filters, , addFilter, removeFilter, setFilterAt, updateFilter] = useDefaultEmpty<FilterGroup<T>>()

    const [visible, , toggleVisible] = useToggle()

    const [add, setAdd] = useState("")

    const [mew, setMew] = useDefaultEmpty<T>()
    const [mewRel, setMewRel] = useState<Logic | undefined>()
    const [filterRel, setFilterRel] = useState<Logic | undefined>()

    const newFilter = () => {
        setMew([])
        setMewRel(undefined)
        setFilterRel(undefined)

        toggleVisible()
    }

    return (
        <div id="snovy-filter" {...props}>
            <Button preset={"add"} border onClick={newFilter}/>
            {
                visible &&
                <div
                    className={WITH_BORDER} style={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    backgroundColor: "black",
                    position: "absolute",
                    left: 100,
                    top: 100,
                    width: 300,
                    zIndex: 20
                }}
                >
                    <RadioButtonGroup key={"add-grp"} label={"Type:"} group="add" get={setAdd}
                                      initial={items.first()?.key}>
                        {items.map(it => it.key)}
                    </RadioButtonGroup>
                    {
                        items.filter(it => it.key == add).map(it => {
                            return <MultiSelect
                                key={it.key} items={it.values} itemSort={it.sort}
                                borders={{main: true, dropdown: true}}
                                onSelectedChange={setMew}
                                mode={{name: `${add}-grp`, get: mode => setMewRel(mode as Logic)}}
                                customItem={it.customItem} selectedItemsStyle={selectedItemsStyle}
                            />
                        })
                    }
                    {
                        !filters.isEmpty() &&
                        <RadioButtonGroup
                            style={{backgroundColor: "orange"}} label={"Mode:"}
                            group="grp" get={mode => setFilterRel(mode as Logic)} initial="OR"
                        >
                            {["AND", "OR"]}
                        </RadioButtonGroup>
                    }
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button preset="remove" onClick={() => toggleVisible()}/>
                        <Button
                            preset="confirm" onClick={() => {
                            if (filterRel) {
                                addFilter([filterRel, {key: add, logic: mewRel, matches: mew}])
                            } else {
                                addFilter({key: add, logic: mewRel, matches: mew})
                            }
                            toggleVisible()
                        }}
                        />
                    </div>
                </div>
            }
            {
                filters.map((it, index) =>
                    <>
                        <div className={joinClass(["snovy-filter", WITH_BORDER])} key={`filter-${index}-select`}>
                            <>
                                {
                                    isType<Filter<T>>(it, "matches") ?
                                        items.filter(v => v.key == it.key).map(v =>
                                            <MultiSelect
                                                key={index} items={v.values} itemSort={v.sort}
                                                borders={{main: true, dropdown: true}}
                                                selected={it.matches}
                                                onSelectedChange={values => updateFilter(values, index, "matches")}
                                                mode={{
                                                    name: `filter-${index}-mode`,
                                                    get: mode => updateFilter(mode, index, "logic"),
                                                    initial: it.logic
                                                }}
                                                customItem={v.customItem} selectedItemsStyle={selectedItemsStyle}
                                            />
                                        ) :
                                        <RadioButtonGroup
                                            key={`filter-${index}-relation`} style={{backgroundColor: "orange"}}
                                            label={"Mode:"}
                                            group={`grp-${index}`} get={mode => setFilterAt(mode as Logic, index)}
                                            initial={it}
                                        >
                                            {["AND", "OR"]}
                                        </RadioButtonGroup>
                                }
                                <Button preset="remove" circular onClick={() => removeFilter(it)}/>
                            </>
                        </div>
                    </>
                )
            }
            <Button preset="confirm" border onClick={() => translateQuery([makeQueryPart("tag", filters)])}/>
        </div>
    )
}

//TODO display mode for query view

export default FilterContainer
