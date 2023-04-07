<script lang="ts">

  import ListItem from "./ListItem.svelte"
  import type {CustomizableChild, ListPresets} from "../snovy-types"
  import {useMultiSelect} from "../../util/svelte-hooks"
  import type {GenericItem} from "../../util/types"
  import type {KeyMapping} from "../../util/utils"
  import {areArrayContentsIdentical, isArray} from "../../util/utils"
  import {Key} from "ts-key-enum"
  import {useKey} from "../../util/utils.js"

  type T = $$Generic<GenericItem>

  export let preset: ListPresets = "simple"
  export let custom: CustomizableChild

  export let items: Array<T> = []
  export let itemSort: (a: T, B: T) => number = undefined
  export let selected: T | Array<T> = undefined
  export let defaultSelected: T
  export let onMultiSelect: (selected: Array<T>) => void
  export let onSelect: (active: T | undefined) => void
  export let onContext: (active: T | undefined) => void
  export let onItemInput: (str: string) => void
  export let onItemRemove: (item: T) => void

  const {selectedItems, handleItemClick, resetSelection} = useMultiSelect(itemSort ? items.sort(itemSort) : items)

  const keyMap: Array<KeyMapping> = [
    {key: Key.Escape, handler: resetSelection}
  ]

  $: activeItem = $selectedItems.first()

  $: if (defaultSelected && !areArrayContentsIdentical($selectedItems, [defaultSelected])) {
    selectedItems.set([defaultSelected])
  }

  $: if (selected && isArray(selected) && !areArrayContentsIdentical($selectedItems, selected)) {
    selectedItems.set(selected)
  }

  $: if (isArray(selected)) {
    if (onMultiSelect && !areArrayContentsIdentical($selectedItems, selected)) {
      onMultiSelect($selectedItems)
    }

    if (onSelect && activeItem != selected?.first()) {
      console.log("select")
      onSelect(activeItem)
    }
  }

</script>

<ol {...$$restProps} class={`snovy-list snovy-scroll ${$$restProps.class || ""}`}
    tabIndex={-1} data-disabled={!items?.length} on:keydown={e => useKey(e, keyMap)}>
  {#each items as item (item.id)}
    <ListItem item={item} preset={preset} custom={custom}
              data-active={activeItem?.id === item.id} data-selected={$selectedItems.includes(item)}
              onInput={onItemInput}
              on:click={e => !e.defaultPrevented && handleItemClick(item)}
              on:contextmenu={e => e.stopPropagation() && onContext && onContext(item)}>
      <svelte:fragment slot="remove-button">
        {#if onItemRemove}
          <button on:click|stopPropagation={e => onItemRemove(item)}>
          </button>
        {/if}
      </svelte:fragment>
    </ListItem>
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
    //align-items: flex-start;
    justify-content: flex-start;
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
