<script lang="ts" context="module">
  export type SnovyIconOption = "add" | "archive" | "archived" | "arrow_down" | "arrow_left" | "arrow_right" | "arrow_up" |
    "checked" | "circle" | "code_off" | "collapsed" | "detail" | "edit" | "expanded" | "export" | "favorite" |
    "favorite_fill" | "filter" | "help" | "import" | "label" | "label_new" | "manager" | "notes" | "options" |
    "remove" | "resources" | "search" | "unique"
</script>

<script lang="ts">

  import IconAdd from "../../assets/icons/add.svg"
  import IconArchive from "../../assets/icons/archive.svg"
  import IconArchived from "../../assets/icons/archived.svg"
  import IconArrowDown from "../../assets/icons/arrow_down.svg"
  import IconArrowLeft from "../../assets/icons/arrow_left.svg"
  import IconArrowRight from "../../assets/icons/arrow_right.svg"
  import IconBook from "../../assets/icons/book.svg"
  import IconArrowUp from "../../assets/icons/arrow_up.svg"
  import IconChecked from "../../assets/icons/checked.svg"
  import IconCircle from "../../assets/icons/circle.svg"
  import IconCodeOff from "../../assets/icons/code_off.svg"
  import IconCollapsed from "../../assets/icons/collapsed.svg"
  import IconDetail from "../../assets/icons/detail.svg"
  import IconEdit from "../../assets/icons/edit.svg"
  import IconExpanded from "../../assets/icons/expanded.svg"
  import IconExport from "../../assets/icons/export.svg"
  import IconFavorite from "../../assets/icons/favorite.svg"
  import IconFavoriteFill from "../../assets/icons/favorite_fill.svg"
  import IconFilter from "../../assets/icons/filter.svg"
  import IconHelp from "../../assets/icons/help.svg"
  import IconImport from "../../assets/icons/import.svg"
  import IconLabel from "../../assets/icons/label.svg"
  import IconLabelNew from "../../assets/icons/label_new.svg"
  import IconList from "../../assets/icons/notes.svg"
  import IconManager from "../../assets/icons/manager.svg"
  import IconOptions from "../../assets/icons/options.svg"
  import IconRemove from "../../assets/icons/remove.svg"
  import IconResources from "../../assets/icons/resources.svg"
  import IconSearch from "../../assets/icons/search.svg"
  import IconUnique from "../../assets/icons/unique.svg"

  export let name: SnovyIconOption

  //TODO enforce keys matching with the type
  const options = {
    add: IconAdd,
    archive: IconArchive,
    archived: IconArchived,
    arrow_down: IconArrowDown,
    arrow_left: IconArrowLeft,
    arrow_right: IconArrowRight,
    arrow_up: IconArrowUp,
    book: IconBook,
    checked: IconChecked,
    circle: IconCircle,
    code_off: IconCodeOff,
    collapsed: IconCollapsed,
    detail: IconDetail,
    edit: IconEdit,
    expanded: IconExpanded,
    export: IconExport,
    favorite: IconFavorite,
    favorite_fill: IconFavoriteFill,
    filter: IconFilter,
    help: IconHelp,
    import: IconImport,
    label: IconLabel,
    label_new: IconLabelNew,
    list: IconList,
    manager: IconManager,
    options: IconOptions,
    remove: IconRemove,
    resources: IconResources,
    search: IconSearch,
    unique: IconUnique,
  }

  export let wrap: boolean = false
  export let circular: boolean = false

</script>

<div class="snovy-icon" class:circular class:wrap>
  <svelte:component this={options[name]}/>
</div>
