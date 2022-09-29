<script lang="ts">

  // type T = $$Generic<GenericItem>

  import ListItem from "./ListItem.svelte"

  export let items: Array<unknown> = []
</script>

<ol {...$$restProps} class="snovy-list snovy-scroll {$$restProps.class || ''}" tabIndex={-1}
    data-disabled={!items?.length}>
  {#each items as {id, title}}
    <ListItem name={id} title={title}/>
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
