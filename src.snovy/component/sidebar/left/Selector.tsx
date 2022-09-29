import React, {useContext} from "react"
import ComboBox from "../../snov/input/downshift/ComboBox"
import Notebook from "../../../data/model/Notebook"
import List from "../../snov/list/List"
import {makeContext, makeSharedContext} from "../../snov/context_menu/ContextMenuItem"
import SidebarContent from "../../snov/sidebar/SidebarContent"
import AppContext from "../../../util/AppContext"
import {WITH_BORDER} from "../../../util/classes"
import WithContext from "../../snov/context_menu/WithContext"
import Note from "../../../data/model/Note"
import Section from "../../../data/model/Section"
import {Ordered} from "../../../data/model/Base"
import FavoriteButton from "../../inputs/FavoriteButton"

export const Selector = () => {

  const appContext = useContext(AppContext)

  return (
    <SidebarContent
      id="notes-selector"
      heading={
        <ComboBox
          id="notebook-selector"
          items={appContext.notebooks} selected={appContext.activeNotebook} onSelect={appContext.setActiveNotebook}
          options={{allowDeselect: false}}
          borders={{dropdown: true}}
          addItem={async (title: string) => {
            const newItem = await new Notebook(title).save()
            appContext.notebooks.push(newItem)
            return newItem
          }}
        />
      }
    >
      <WithContext<Section>
        makeContextItems={(con, sel) => {
          return [
            makeContext(
              "New section",
              async () => appContext.setActiveSection(con ? await appContext.activeNotebook?.add(con.order + 1) : await appContext.activeNotebook?.add()),
              "+",
              " (as last)",
              async () => appContext.setActiveSection(await appContext.activeNotebook?.add())
            ),
            con && makeSharedContext({
              single: {
                text: "Delete section",
                action: async () => {
                  const activeWillBeDeleted = sel.includes(con)
                  const result = await appContext.activeNotebook?.remove(con)

                  activeWillBeDeleted && appContext.setActiveSection(result)
                }
              },
              multiple: {
                condition: sel.hasMore(),
                text: `Delete ${sel.length} sections`,
                action: async () => appContext.setActiveSection(await appContext.activeNotebook?.remove(sel))
              },
              icon: "×"
            })
          ]
        }}
      >
        <List<Section>
          id="snovy-list-section" className={WITH_BORDER} options={{preset: "editable"}}
          items={appContext.activeNotebook?.sections} itemSort={Ordered.compareByOrder}
          onSelect={appContext.setActiveSection} defaultSelected={appContext.activeSection}
          onItemValueChange={async str => await appContext.activeSection?.updateTitle(str)}
        />
      </WithContext>
      <WithContext<Note>
        makeContextItems={(con, sel) => {
          return [
            makeContext(
              "New note",
              async () => appContext.setActiveNote(con ? await appContext.activeSection?.add(con.order + 1) : await appContext.activeSection?.add()),
              "+",
              "(as last)",
              async () => appContext.setActiveNote(await appContext.activeSection?.add())
            ),
            con && makeSharedContext({
              single: {
                text: "Delete note",
                action: async () => {
                  const activeWillBeDeleted = sel.includes(con)
                  const result = await appContext.activeSection?.remove(con)

                  activeWillBeDeleted && appContext.setActiveNote(result)
                }
              },
              multiple: {
                condition: sel.hasMore(),
                text: `Delete ${sel.length} notes`,
                action: async () => appContext.setActiveNote(await appContext.activeSection?.remove(sel))
              },
              icon: "×"
            })
          ]
        }}
      >
        <List<Note>
          id="snovy-list-note" className={WITH_BORDER} options={{preset: "editable"}}
          items={appContext.activeSection?.notes} itemSort={Ordered.compareByOrder}
          onSelect={appContext.setActiveNote} defaultSelected={appContext.activeNote}
          onItemValueChange={async str => await appContext.activeNote?.updateTitle(str)}
          customItem={item => <FavoriteButton note={item}/>}
        />
      </WithContext>
    </SidebarContent>
  )

}

export default Selector