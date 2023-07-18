<script lang="ts">

  import SnovyListItem from "./SnovyListItem.svelte"
  import type {ListChildButton, ListChildPart, ListPresets} from "../snovy-types"
  import {useMultiSelect} from "../../../util/svelte-hooks"
  import type {GenericItem} from "../../../util/types"
  import type {KeyMapping} from "../../../util/utils"
  import {useKey} from "../../../util/utils"
  import {Key} from "ts-key-enum"
  import SnovyToggle from "../input/SnovyToggle.svelte"
  import SnovyButton from "../input/SnovyButton.svelte"

  type T = $$Generic<GenericItem>

  export let preset: ListPresets = "simple"
  export let custom: ListChildPart<T>
  export let childButton: ListChildButton<T>

  export let items: Array<T> = []
  export let itemSort: (a: T, B: T) => number = undefined
  export let initial: T = null
  export let onMultiSelect: (selected: Array<T>) => void
  export let onSelect: (active: T | undefined) => void
  export let onContext: (active: T | undefined) => void
  export let onItemInput: (str: string) => void

  const {
    activeItem,
    selectedItems,
    handleItemClick,
    resetSelection
  } = useMultiSelect(itemSort ? items.sort(itemSort) : items)

  const keyMap: Array<KeyMapping> = [
    {key: Key.Escape, handler: resetSelection}
  ]

  $: {
    activeItem.set(initial)
  }

  $: onMultiSelect && onMultiSelect($selectedItems)
  $: onSelect && onSelect($activeItem)
</script>

<ol {...$$restProps} class={`snovy-list snovy-scroll ${$$restProps.class || ""}`}
    tabIndex={-1} data-disabled={!items?.length} on:keydown={e => useKey(e, keyMap)}>
  {#each (items ?? []) as item (item.id)}
    <SnovyListItem item={item} preset={preset} custom={custom}
                   data-active={$activeItem === item} data-selected={$selectedItems.includes(item)}
                   onInput={onItemInput}
                   on:click={e => {
                       if (!e.defaultPrevented) {
                          handleItemClick(item)
                       }
                   }}
                   on:contextmenu={e => onContext && onContext(item)}>
      <!--      TODO the buttons dont change icons properly on any other instance except the first-->
      <svelte:fragment slot="list-item-button">
        {#if childButton?.type === 'button'}
          <SnovyButton on:click={e => childButton.action(item)} icon={childButton.icon} circular/>
        {:else if childButton?.type === 'toggle'}
          <SnovyToggle on:click={e => {
            //FIXME i think i need to manage the fav state somewhere - i might have to pass around str refs to the field and method... but there has to be a better way
              e.preventDefault()
              e.stopPropagation()
              childButton.action(item)
          }} toggled={childButton.toggled(item)} icon={childButton.icon} iconFalse={childButton.iconFalse} circular
          />
        {/if}
      </svelte:fragment>

    </SnovyListItem>
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
