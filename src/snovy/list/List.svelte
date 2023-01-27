<script lang="ts">

  // type T = $$Generic<GenericItem>

  import ListItem from "./ListItem.svelte"

  export let preset: "editable" | "simple" = "simple"
  export let button: { component: any, action: (e) => {} }
  export let custom: { component: any, props: { onAction: (args) => {} } }

  export let items: Array<unknown> = []
</script>

<ol {...$$restProps} class={`snovy-list snovy-scroll ${$$restProps.class || ""}`}
    tabIndex={-1} data-disabled={!items?.length}>
  {#each items as item (item.id)}
    <ListItem item={item} preset={preset} button={button} custom={custom}/>
  {/each}
  <slot></slot>
</ol>

<style lang="scss">
  .snovy-list {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
