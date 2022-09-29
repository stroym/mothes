import React from "react"
import {joinClass} from "../../../util/utils"

export interface QueryContainerProps<T> extends React.HTMLProps<HTMLDivElement> {
    items: Array<T>
}

//T needs to be the new filter group with logic in it

export const QueryContainer = <T extends string>(
    {
        className,
        items,
        label,
        ...props
    }: QueryContainerProps<T>
) => {

    return (
        <div {...props} className={joinClass(["", className])} style={{display: "flex"}}>
            {
                items.map((it, index) =>
                    <div key={index}>
                        {it}
                    </div>
                )
            }
        </div>
    )

}

export default QueryContainer
