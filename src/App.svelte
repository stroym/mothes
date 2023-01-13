<script lang="ts">
  import Sidebar from "./snovy/layout/Sidebar.svelte"
  import TabMenu from "./snovy/layout/TabMenu.svelte"
  import List from "./snovy/list/List.svelte"

  //TODO move active tabs/tab management into a store/context
  const mappings = {
    notes: {id: "notes", label: "Notes", icon: "notes"},
    favorites: {id: "favorites", label: "Favorites", icon: "favorite"},
    search: {id: "search", label: "Search", icon: "search"},
    archive: {id: "archive", label: "Archive", icon: "archive", align: "end"},
    resources: {id: "resources", label: "Resources", icon: "resources"},
    options: {id: "options", label: "Options", icon: "options", align: "end"},
    detail: {id: "detail", label: "Detail", icon: "detail"},
    manager: {id: "manager", label: "Manager", icon: "manager"}
  }

  let leftTab = mappings.notes.id
  let rightTab = mappings.detail.id
</script>

<main>
  <div id="snovy-app" {leftTab} {rightTab}>
    <TabMenu id="left-menu" orientation="left" bind:active={leftTab} tabs={[
      mappings.notes,
      mappings.favorites,
      mappings.search,
      mappings.archive,
      mappings.options,
      {id: "collapse", icon: "arrow_left", align: "end"}
    ]}/>
    <Sidebar id="left-sidebar">
      {#if leftTab == mappings.notes.id}
        <List></List>
        <List></List>
      {/if}
    </Sidebar>
    <div id="editor"></div>
    <Sidebar id="right-sidebar">
      <div style="height: 100%; width: 100%;"></div>
    </Sidebar>
    <TabMenu id="right-menu" orientation="right" bind:active={rightTab} tabs={[
      mappings.detail,
      mappings.manager,
      mappings.resources,
      {id: "collapse", icon: "arrow_right", align: "end"}
    ]}/>
  </div>
</main>

<style lang="scss">
  #snovy-app {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: minmax(2vw, 1fr) 10fr 30fr 10fr minmax(2vw, 1fr);
    grid-template-rows: 100%;
    grid-template-areas: "leftmenu left centre right rightmenu";
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
