<script lang="ts">
  import "./util/augments.ts"
  import Sidebar from "./snovy/layout/Sidebar.svelte"
  import TabMenu from "./snovy/layout/TabMenu.svelte"
  import List from "./snovy/list/List.svelte"
  import Note from "./data/model/Note.js"
  import Section from "./data/model/Section.js"

  //TODO move active tabs/tab management into a store/context
  const mappings = {
    notebooks: {id: "notebooks", title: "Notebooks", icon: "book"},
    notes: {id: "notes", title: "Notes", icon: "list"},
    favorites: {id: "favorites", title: "Favorites", icon: "favorite"},
    search: {id: "search", title: "Search", icon: "search"},
    archive: {id: "archive", title: "Archive", icon: "archive", align: "end"},
    resources: {id: "resources", title: "Resources", icon: "resources"},
    options: {id: "options", title: "Options", icon: "options", align: "end"},
    detail: {id: "detail", title: "Detail", icon: "detail"},
    manager: {id: "manager", title: "Manager", icon: "manager"}
  }

  let leftTab = mappings.notes.id
  let rightTab = mappings.detail.id
  let leftCollapsed = false
  let rightCollapsed = false

</script>

<TabMenu id="left-menu" style="grid-area: left-menu;" orientation="left" collapsible
         bind:active={leftTab} bind:collapsed={leftCollapsed}
         tabs={[mappings.notebooks, mappings.notes, mappings.favorites, mappings.search, mappings.archive, mappings.options]}
/>
<Sidebar id="left-sidebar" style="grid-area: left;" data-collapsed={leftCollapsed}>
  {#if leftTab === mappings.notes.id}
    <List preset="editable"
          items={[
          new Section(0, "sec 1", 1, 1),
          new Section(0, "sec 2", 2, 2),
          new Section(0, "sec 3", 3, 3),
        ]}>
    </List>
    <List preset="editable" onItemValueChange={async str => console.log(str)} items={[
          new Note(0, "blob 1", 1, 1),
          new Note(0, "blob 2", 2, 2),
          new Note(0, "blob 3", 3, 3),
        ]}>
    </List>
  {/if}
</Sidebar>
<div id="editor" style="grid-area: centre; width: 100%;"></div>
<Sidebar id="right-sidebar" style="grid-area: right;" data-collapsed={rightCollapsed}>
  <div style="height: 100%; width: 100%;"></div>
</Sidebar>
<TabMenu id="right-menu" style="grid-area: right-menu;" orientation="right" collapsible
         bind:active={rightTab} bind:collapsed={rightCollapsed}
         tabs={[mappings.detail, mappings.manager, mappings.resources]}
/>

<style lang="scss">
  :global( #left-sidebar .sidebar-body) {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--border-thin);
  }
</style>
