import React from "react"
import {joinClass} from "../../util/utils"

export interface TypedTemplateProps<T> extends React.HTMLProps<HTMLDivElement> {
    items: Array<T>
}

// eslint-disable-next-line
export const TypedTemplate = <T extends unknown>(
    {
        className,
        items,
        label,
        ...props
    }: TypedTemplateProps<T>
) => {

    return (
        <div {...props} className={joinClass(["", className])}>
            {
                items.map((it, index) =>
                    <div key={index}>
                    </div>
                )
            }
        </div>
    )

}

export default TypedTemplate
