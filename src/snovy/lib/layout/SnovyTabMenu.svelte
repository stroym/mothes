<script lang="ts" context="module">

  export type Orientation = "left" | "right" | "top" | "bottom"
  export type TabItem = { id: string, align?: "start" | "middle" | "end", icon?: any, overlay?: boolean }

</script>

<script lang="ts">
  import {onMount} from "svelte"
  import SnovyTabMenuItem from "./SnovyTabMenuItem.svelte"
  import {isActionEvent} from "../utils"
  import type {SnovyIconOption} from "../helper/SnovyIcon.svelte";

  export let orientation: Orientation
  export let collapsible: boolean

  export let tabs: Array<TabItem> = []

  export let active: string = tabs[0]?.id
  export let collapsed: boolean

  let previous: string = active

  let startTabs = tabs.filter(it => !it.align || it.align === "start")
  let middleTabs = tabs.filter(it => it.align === "middle")
  let endTabs = tabs.filter(it => it.align === "end")
  let collapseIcon: SnovyIconOption

  onMount(() => {
    collapsible && collapse()
  })

  function collapse(e?: MouseEvent | KeyboardEvent) {
    if (e) {
      if (!isActionEvent(e)) {
        return
      }

      collapsed = !collapsed
    }

    switch (orientation) {
      case "top":
        collapseIcon = collapsed ? "arrow_down" : "arrow_up"
        break
      case "bottom":
        collapseIcon = collapsed ? "arrow_up" : "arrow_down"
        break
      case "left":
        collapseIcon = collapsed ? "arrow_left" : "arrow_right"
        break
      case "right":
        collapseIcon = collapsed ? "arrow_right" : "arrow_left"
        break
    }
  }

  function activate(e: MouseEvent | KeyboardEvent, tab: TabItem) {
    if (!isActionEvent(e)) {
      return
    }

    if (tab.overlay && active == tab.id) {
      active = previous
    } else {
      previous = active
      active = tab.id
    }

    if (collapsed) {
      collapse(e)
    }
  }
</script>

<div {...$$restProps} class="snovy-tab-menu color-pass {orientation} {$$restProps.class || ''}">
  <div class="tab-menu-section tab-menu-start color-pass">
    {#each startTabs as tab}
      <SnovyTabMenuItem {...tab} data-active={active === tab.id}
                        on:click={e => activate(e, tab)} on:keypress={e => activate(e, tab)}
      />
    {/each}

    {#if collapsible && !endTabs}
      <SnovyTabMenuItem id={null} icon={collapseIcon} on:click={collapse} on:keypress={collapse}/>
    {/if}
  </div>

  {#if middleTabs}
    <div class="tab-menu-section tab-menu-end color-pass">
      {#each middleTabs as tab}
        <SnovyTabMenuItem {...tab} data-active={active === tab.id}
                          on:click={e => activate(e, tab)} on:keypress={e => activate(e, tab)}
        />
      {/each}
    </div>
  {/if}

  {#if endTabs}
    <div class="tab-menu-section tab-menu-end color-pass">
      {#each endTabs as tab}
        <SnovyTabMenuItem {...tab} data-active={active === tab.id}
                          on:click={e => activate(e, tab)} on:keypress={e => activate(e, tab)}
        />
      {/each}

      {#if collapsible}
        <SnovyTabMenuItem id={null} icon={collapseIcon} on:click={collapse} on:keypress={collapse}/>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .snovy-tab-menu {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;

    &:is(.top, .bottom) {
      flex-direction: row;

      :global(.snovy-tab-menu-item) {
        padding: 0.4em 0.2em;
      }
    }

    &:is(.left, .right) {
      flex-direction: column;

      :global(.snovy-tab-menu-item) {
        padding: 0.4em 0.2em;
      }
    }
  }

  .tab-menu-section {
    display: flex;
    flex-flow: inherit;
    align-items: stretch;
    justify-content: space-evenly;
    overflow: hidden; //TODO scroll with hint arrow

    &.start {
      justify-content: flex-start;
    }

    &.end {
      justify-content: flex-end;
    }
  }
</style>
