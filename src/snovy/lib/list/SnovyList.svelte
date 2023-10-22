<script lang="ts" context="module">

  import type {SnovyIconOption} from "../helper/SnovyIcon.svelte";

  export type ListPresets = "simple" | "editable"

  export type ItemPart = {
    part: any,
    props?: any
  }

  export type ItemButton = {
    type: "button" | "toggle",
    icon: SnovyIconOption | Array<SnovyIconOption>,
    action?: (item: unknown) => void,
    props?: any
  }
</script>

<script lang="ts">

  import {Key} from "ts-key-enum"
  import SnovyListItem from "./SnovyListItem.svelte"
  import SnovyToggle from "../input/SnovyToggle.svelte"
  import SnovyButton from "../input/SnovyButton.svelte"
  import {useMultiSelect} from "../../../util/svelte-hooks"
  import type {GenericItem} from "../../../util/types"
  import type {KeyMapping} from "../../../util/utils"
  import {isArray, useKey} from "../../../util/utils"

  type T = $$Generic<GenericItem>

  export let preset: ListPresets = "simple"
  export let custom: ItemPart
  export let buttonOptions: ItemButton

  export let items: Array<T> = []
  export let itemSort: (a: T, B: T) => number = undefined
  export let initial: T = undefined
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
  {#each (items ?? []) as item, i (`${i}-${item}`)}
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
        {#if buttonOptions?.type === 'button' && !isArray(buttonOptions.icon)}
          <SnovyButton {...buttonOptions.props} on:click={e => buttonOptions.action(item)} icon={buttonOptions.icon} circular/>
        {:else if buttonOptions?.type === 'toggle' && isArray(buttonOptions.icon)}
          <SnovyToggle {...buttonOptions.props} target={item} icons={buttonOptions.icon}/>
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
