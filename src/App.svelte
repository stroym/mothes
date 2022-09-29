<script lang="ts">
  import Sidebar from "./snovy/layout/Sidebar.svelte"
  import TabMenu from "./snovy/layout/TabMenu.svelte"
  import List from "./snovy/list/List.svelte"

  //TODO mvoe active tabs/tab management into a store/context
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

</script>

<main>
  <div id="snovy-app">
    <TabMenu id="left-menu" orientation="left" tabs={[
      {id: "notes" },
      {id: "favorites" },
      {id: "search" },
      {id: "archive" },
      {id: "options" },
      {id: "collapse", align: "end"}
    ]}>
    </TabMenu>
    <Sidebar id="left-sidebar">
      <div slot="header">
        <div style="height: 50px; width: 100%;"></div>
      </div>
      <List items={[{title: "blob"}]}></List>
      <List></List>
    </Sidebar>
    <div id="editor"></div>
    <Sidebar id="right-sidebar">
      <div style="height: 100%; width: 100%;"></div>
    </Sidebar>
    <TabMenu id="right-menu" orientation="right" tabs={[
      {id: "manager" },
      {id: "resources", align: "end" },
      {id: "detail", align: "end" },
      {id: "collapse", align: "end"}
    ]}></TabMenu>
  </div>
</main>

<style lang="scss">
  #snovy-app {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: minmax(2vw, 1fr) 10fr 40fr 10fr minmax(2vw, 1fr);
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
