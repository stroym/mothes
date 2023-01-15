<script lang="ts">
  import Sidebar from "./snovy/layout/Sidebar.svelte"
  import TabMenu from "./snovy/layout/TabMenu.svelte"
  import List from "./snovy/list/List.svelte"

  //TODO move active tabs/tab management into a store/context
  const mappings = {
    notes: {id: "notes", title: "Notes", icon: "notes"},
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

<main>
  <div id="snovy-app" {leftTab} {rightTab} {leftCollapsed} {rightCollapsed}>
    <TabMenu id="left-menu" style="grid-area: left-menu;" orientation="left" spacer collapsible
             bind:active={leftTab} bind:collapsed={leftCollapsed}
             tabs={[mappings.notes, mappings.favorites, mappings.search, mappings.archive, mappings.options]}
    />
    <Sidebar id="left-sidebar" style="grid-area: left;" data-collapsed={leftCollapsed}>
      {#if leftTab == mappings.notes.id}
        <List></List>
        <List></List>
      {/if}
    </Sidebar>
    <div id="editor" style="grid-area: centre;"></div>
    <Sidebar id="right-sidebar" style="grid-area: right;" data-collapsed={rightCollapsed}>
      <div style="height: 100%; width: 100%;"></div>
    </Sidebar>
    <TabMenu id="right-menu" style="grid-area: right-menu;" orientation="right" spacer collapsible
             bind:active={rightTab} bind:collapsed={rightCollapsed}
             tabs={[mappings.detail, mappings.manager, mappings.resources]}
    />
  </div>
</main>

<style lang="scss">
  #snovy-app {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: minmax(2vw, 1fr) 10fr 30fr 10fr minmax(2vw, 1fr);
    grid-template-rows: 100%;
    grid-template-areas: "left-menu left centre right right-menu";
    grid-gap: var(--border-thin);
    background-color: var(--color-border);

    & > * {
      background-color: var(--color-main);
    }
  }

  :global #left-sidebar .sidebar-body {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--border-thin);
  }
</style>
