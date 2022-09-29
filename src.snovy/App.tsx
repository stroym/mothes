import React from "react"
import "./style/app.scss"
import "./util/augments"
import Editor from "./component/editor/Editor"
import {Alignment, Orientation} from "./component/snov/tab_menu/TabMenu"
import Selector from "./component/sidebar/left/Selector"
import Detail from "./component/sidebar/right/Detail"
import Manager from "./component/sidebar/right/Manager"
import {css, useTheme} from "@emotion/react"
import OptionsManager from "./component/options/OptionsManager"
import {Sidebar} from "./component/snov/sidebar/Sidebar"
import {Portal} from "react-portal"
import {default as OptionsIcon} from "../public/icons/options.svg"
import {default as FavoriteIcon} from "../public/icons/favorite.svg"
import {default as SearchIcon} from "../public/icons/search.svg"
import {default as ArchiveIcon} from "../public/icons/archived.svg"
import {default as NotesIcon} from "../public/icons/notes.svg"
import {default as DetailIcon} from "../public/icons/detail.svg"
import {default as ManagerIcon} from "../public/icons/manager.svg"
import {default as ResourcesIcon} from "../public/icons/resources.svg"
import {I_ACTIVE, I_HIGHLIGHT, I_SELECT} from "./util/classes"
import Favorites from "./component/sidebar/left/Favorites"
import Search from "./component/sidebar/left/Search"
import Archive from "./component/sidebar/left/Archive"
import Resources from "./component/sidebar/right/Resources"
import {evaluateReadability} from "./util/colors"
import {default as TinyColor} from "tinycolor2"

const App = () => {

  const theme = useTheme()

  const mappings = {
    notes: "Notes",
    favorites: "Favorites",
    search: "Search",
    resources: "Resources",
    archive: "Archive",
    options: "Options",
    detail: "Detail",
    manager: "Manager"
  }

  return (
    <span
      id="snovy-app"
      css={css`
        --color-focus-fill: ${new TinyColor(theme.hover).lighten(20).toHex8String()};
        --color-hover: ${theme.hover};
        --color-border: ${theme.border};
        --color-accent: ${theme.accent};
        --color-active: ${theme.activeItem};

        color: ${theme.textPrimary};

        .snovy-highlight-helper {
          color: ${theme.textSecondary};
        }

        &,
        .snovy-options,
        .snovy-absolute,
        .snovy-absolute > * {
          background-color: ${theme.primary};
        }

        .snovy-context-menu {
          background-color: ${theme.border};
        }

        .snovy-tab-menu {
          background-color: ${theme.accent};
          color: ${evaluateReadability(theme, "accent")};
        }

        .${I_ACTIVE} {
          background-color: ${theme.activeItem};
        }

        .${I_HIGHLIGHT} {
          background-color: ${theme.hover} !important;
        }

        .${I_SELECT} {
          background-color: ${new TinyColor(theme.activeItem).darken(5).toHex8String()};
        }
      `}
    >
      <Sidebar orientation={Orientation.LEFT} initialTab={mappings.notes}>
        {[
          {
            alignment: Alignment.START,
            icon: <NotesIcon/>,
            title: mappings.notes,
            itemId: mappings.notes,
            content: <Selector/>
          },
          {
            alignment: Alignment.START,
            icon: <FavoriteIcon/>,
            title: mappings.favorites,
            itemId: mappings.favorites,
            content: <Favorites/>
          },
          {
            alignment: Alignment.START,
            icon: <SearchIcon/>,
            title: mappings.search,
            itemId: mappings.search,
            content: <Search/>
          },
          {
            alignment: Alignment.END,
            icon: <ArchiveIcon/>,
            title: mappings.archive,
            itemId: mappings.archive,
            content: <Archive/>,
            disabled: true
          },
          {
            alignment: Alignment.END,
            icon: <OptionsIcon/>,
            title: mappings.options,
            itemId: mappings.options,
            activatePrevious: true,
            content: <Portal node={document.getElementById("snovy-app")}><OptionsManager/></Portal>
          }
        ]}
      </Sidebar>
      <Editor/>
      <Sidebar initialTab={mappings.detail} orientation={Orientation.RIGHT}>
        {[
          {
            alignment: Alignment.START,
            icon: <DetailIcon/>,
            title: mappings.detail,
            itemId: mappings.detail,
            content: <Detail/>
          },
          {
            alignment: Alignment.START,
            icon: <ManagerIcon/>,
            title: mappings.manager,
            itemId: mappings.manager,
            content: <Manager/>
          },
          {
            alignment: Alignment.END,
            icon: <ResourcesIcon/>,
            title: mappings.resources,
            itemId: mappings.resources,
            content: <Resources/>,
            disabled: true
          }
        ]}
      </Sidebar>
      </span>
  )
}

export default App