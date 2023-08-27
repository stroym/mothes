<script lang="ts">
  import "./util/augments.ts"
  import SnovySidebar from "./snovy/lib/layout/SnovySidebar.svelte"
  import SnovyTabMenu from "./snovy/lib/layout/SnovyTabMenu.svelte"
  import Selector from "./lib/sidebar/left/Selector.svelte"
  import {loadNotebooks} from "./lib/note-store"
  import NoteDetail from "./lib/sidebar/right/NoteDetail.svelte"
  import {dexie} from "./index"
  import {onMount} from "svelte"
  import Options from "./lib/sidebar/left/Options.svelte";
  import {fetchThemes} from "./data/Database";
  import {initOptions, setOptions} from "./lib/stores/options-store";

  //TODO move active tabs/tab management into a store/context
  const tabs = {
    notebooks: {id: "notebooks", title: "Notebooks", icon: "book"},
    notes: {id: "notes", title: "Notes", icon: "list"},
    favorites: {id: "favorites", title: "Favorites", icon: "favorite"},
    search: {id: "search", title: "Search", icon: "search"},
    archive: {id: "archive", title: "Archive", icon: "archived", align: "end"},
    resources: {id: "resources", title: "Resources", icon: "resources"},
    options: {id: "options", title: "Options", icon: "options", align: "end", overlay: true},
    detail: {id: "detail", title: "Detail", icon: "detail"},
    manager: {id: "manager", title: "Manager", icon: "manager"}
  }

  let leftTab = tabs.notes.id
  let rightTab = tabs.detail.id
  let leftCollapsed = false
  let rightCollapsed = false

  let optionsRef: Options = null

  // TODO there's probably a cleaner way to do this
  $: {
    if (optionsRef && leftTab != tabs.options.id) {
      optionsRef?.dialog?.close()
    }
  }

  onMount(
    async () => {
      dexie.transaction("rw", [dexie.options, dexie.themes, dexie.notebooks], async () => {
        await fetchThemes()
        await initOptions().then(options => setOptions(options))
      })

      await dexie.notebooks.toArray().then(it => loadNotebooks(it))
    }
  )
</script>

<SnovyTabMenu id="left-menu" style="grid-area: left-menu;" orientation="left" collapsible
              bind:active={leftTab} bind:collapsed={leftCollapsed}
              tabs={[tabs.notebooks, tabs.notes, tabs.favorites, tabs.search, tabs.archive, tabs.options]}
/>
<SnovySidebar id="left-sidebar" style="grid-area: left;" data-collapsed={leftCollapsed}>
  {#if leftTab === tabs.notes.id}
    <Selector/>
  {/if}
</SnovySidebar>
<div id="editor" style="grid-area: centre;"></div>
<SnovySidebar id="right-sidebar" style="grid-area: right;" data-collapsed={rightCollapsed}>
  {#if rightTab === tabs.detail.id}
    <NoteDetail/>
  {/if}
</SnovySidebar>
<SnovyTabMenu id="right-menu" style="grid-area: right-menu;" orientation="right" collapsible
              bind:active={rightTab} bind:collapsed={rightCollapsed}
              tabs={[tabs.detail, tabs.manager, tabs.resources]}
/>
{#if leftTab === tabs.options.id}
  <Options bind:this={optionsRef}/>
{/if}

<style lang="scss">
  :global( #left-sidebar .sidebar-body) {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--border-thin);
  }

  :global( #left-menu, #right-menu ) {
    width: 2vw;
  }


  :global( #left-sidebar, #right-sidebar ) {
    width: 22vw;
  }
</style>
