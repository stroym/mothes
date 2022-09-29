<script lang="ts">

  import TabMenuItem from "./TabMenuItem.svelte"

  export type Orientation = "left" | "right" | "top" | "bottom"
  export type TabItem = { id: string, align?: "start" | "end", icon?: any }

  export let orientation: Orientation
  export let spacer: boolean = true
  export let tabs: Array<TabItem> = []

  export let onActiveChange: (active: string) => void

  let activeTab: string = tabs[0]?.id

</script>

<div class="snovy-tab-menu color-pass {orientation}">
  <div class="tab-menu-section tab-menu-start color-pass">
    {#each tabs.filter(it => !it.align || it.align == "start") as tab}
      <TabMenuItem id={tab.id} icon={tab.icon} active={activeTab == tab.id} on:click={()=>activeTab = tab.id}>
      </TabMenuItem>
    {/each}
    <slot></slot>
  </div>

  {#if spacer}
    <div class="tab-menu-spacer"></div>
  {/if}

  {#if $$slots['end'] || tabs.find(it => it.align == "end")}
    <div class="tab-menu-section tab-menu-end color-pass">
      {#each tabs.filter(it => it.align == "end") as tab}
        <TabMenuItem id={tab.id} icon={tab.icon} active={activeTab == tab.id} on:click={()=>activeTab = tab.id}>
        </TabMenuItem>
      {/each}
      <slot name="end"></slot>
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
    gap: var(--border-thin);

    &:is(.top, .bottom) {
      flex-direction: row;
    }

    &:is(.left, .right) {
      flex-direction: column;
    }
  }

  .tab-menu-section {
  //display: flex; flex-flow: inherit; align-items: stretch; justify-content: space-evenly; overflow: hidden; gap: var(--border-thin);

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
