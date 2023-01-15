<script lang="ts">
  import {onMount} from "svelte"
  import TabMenuItem from "./TabMenuItem.svelte"
  import {isActionEvent} from "../utils"

  export type Orientation = "left" | "right" | "top" | "bottom"
  export type TabItem = { id: string, align?: "start" | "end", icon?: any }

  export let orientation: Orientation
  export let spacer: boolean
  export let collapsible: boolean

  export let tabs: Array<TabItem> = []

  export let active: string = tabs[0]?.id
  export let collapsed: boolean

  let startTabs = tabs.filter(it => !it.align || it.align === "start")
  let endTabs = tabs.filter(it => it.align === "end")
  let collapseIcon: string

  onMount(() => {collapsible && collapse()})

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

  function setAsActive(e: MouseEvent | KeyboardEvent, tabId: string) {
    if (!isActionEvent(e)) {
      return
    }

    active = tabId

    if (collapsed) {
      collapse(e)
    }
  }
</script>

<div {...$$restProps} class="snovy-tab-menu color-pass {orientation} {$$restProps.class || ''}">
  <div class="tab-menu-section tab-menu-start color-pass">
    {#each startTabs as tab}
      <TabMenuItem id={tab.id} icon={tab.icon} title={tab.title} data-active={active === tab.id}
                   on:click={e => setAsActive(e, tab.id)} on:keypress={e => setAsActive(e, tab.id)}>
      </TabMenuItem>
    {/each}

    {#if collapsible && !endTabs}
      <TabMenuItem on:click={collapse} on:keypress={collapse} icon={collapseIcon}></TabMenuItem>
    {/if}
  </div>

  {#if spacer}
    <div class="tab-menu-spacer"></div>
  {/if}

  {#if endTabs}
    <div class="tab-menu-section tab-menu-end color-pass">
      {#each endTabs as tab}
        <TabMenuItem id={tab.id} icon={tab.icon} title={tab.title} data-active={active === tab.id}
                     on:click={e => setAsActive(e, tab.id)} on:keypress={e => setAsActive(e, tab.id)}>
        </TabMenuItem>
      {/each}

      {#if collapsible}
        <TabMenuItem on:click={collapse} on:keypress={collapse} icon={collapseIcon}></TabMenuItem>
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

      :global .snovy-tab-menu-item {
        padding: 0.4em 0.6em;
      }
    }

    &:is(.left, .right) {
      flex-direction: column;

      :global .snovy-tab-menu-item {
        padding: 0.6em 0.2em;
      }
    }
  }

  .tab-menu-section {
    //display: flex;
    //flex-flow: inherit;
    //align-items: stretch;
    //justify-content: space-evenly;
    // overflow: hidden;
    // gap: var(--border-thin);

    &.start {
      justify-content: flex-start;
    }

    &.end {
      justify-content: flex-end;
    }
  }

  .tab-menu-spacer {
    flex: 1 1 max-content;
    background-color: var(--color-main);
  }
</style>
