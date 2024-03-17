<script lang="ts" context="module">
  export type ComboOptions = {
    selectPreviousOnEsc?: boolean
    resetOnSelect?: boolean
    wideDropdown?: boolean
    allowDeselect?: boolean
  }

  export const defaultOptions: ComboOptions = {
    selectPreviousOnEsc: true,
    resetOnSelect: false,
    wideDropdown: false,
    allowDeselect: true
  }
</script>

<script lang="ts">

  import SnovyInput from "./SnovyInput.svelte"
  import SnovyButton from "./SnovyButton.svelte"
  import SnovyToggle from "./SnovyToggle.svelte"
  import type {GenericItem} from "../../../util/types"
  import {useDropdown} from "../../../util/hooks/positional-hooks"
  import {hideAbsoluteOnMovement} from "../../../util/hooks/misc-hooks"
  import type {ItemPart} from "../list/SnovyList.svelte"
  import {areStringsSimilar, findStringSimilarityIndex, type KeyMapping, useKey} from "../../../util/utils"
  import {Key} from "ts-key-enum"

  type T = $$Generic<GenericItem>

  // TODO multiselect
  export let border = true
  export let options: ComboOptions = defaultOptions //TODO compositing props
  export let customItem: ItemPart<T> = undefined
  export let reset: () => void = () => false

  let expanded: boolean = false

  export let inputValue = ""
  export let placeholderValue = ""
  let selectedItem: T
  let highlightedIndex: number = 0

  export let items: Array<T> | undefined = []
  export let itemSort: (a: T, B: T) => number = undefined
  export let addItem: (inputValue: string) => T | Promise<T> = undefined

  let comboRef: HTMLDivElement = null
  let dropdownRef: HTMLDivElement = null

  let dropdownItems = []
  let dropdownStyle = ""
  let dropdownDirection: "up" | "down" = "down"

  $: {
    let tempItems = []

    if (inputValue) {
      tempItems = items.filter(it => areStringsSimilar(it?.toString(), inputValue))
    } else {
      tempItems = [...items]
    }

    dropdownItems = itemSort ? tempItems?.sort(itemSort) : tempItems
  }

  $: {
    if (expanded) {
      const computeOverflowStyle = useDropdown(dropdownRef, comboRef, expanded, () => expanded = false, dropdownItems.length,
        {itemNesting: 1, maxItems: 12, offset: border ? 1 : 0, useParentWidth: options.wideDropdown}
      )

      const style = computeOverflowStyle()

      dropdownStyle = Object.entries(style).filter(it => Boolean(it[1])).join(";").replaceAll(",", ":")
      dropdownDirection = style.bottom ? "down" : "up"
    }
  }

  hideAbsoluteOnMovement(() => expanded = false)

  const keyMap: Array<KeyMapping> = [
    {
      key: Key.Escape,
      handler: () => {
        expanded = false
        inputValue = selectedItem?.toString()
      }
    },
    {
      key: Key.Enter,
      handler: () => { selectItem(dropdownItems[highlightedIndex]) },
      condition: () => expanded
    },
    {
      key: Key.Home,
      handler: () => { highlightedIndex = 0 },
      condition: () => expanded
    },
    {
      key: Key.End,
      handler: () => { highlightedIndex = dropdownItems.length - 1 },
      condition: () => expanded
    },
    {
      key: Key.ArrowDown,
      handler: () => {
        highlightedIndex++

        if (highlightedIndex > dropdownItems.length - 1) {
          highlightedIndex = 0
        }
      },
      condition: () => expanded
    },
    {
      key: Key.ArrowUp,
      handler: () => {
        highlightedIndex--

        if (highlightedIndex < 0) {
          highlightedIndex = dropdownItems.length - 1
        }
      },
      condition: () => expanded
    },
    {
      key: [Key.Enter, Key.ArrowDown],
      handler: () => {
        expanded = true
        inputValue = ""
      },
      condition: () => !expanded
    }
  ]

  function selectItem(item: T) {
    selectedItem = item
    inputValue = selectedItem?.toString() //TODO this would ideally be set reactively on select/blur-like actions
    placeholderValue = selectedItem?.toString()
    expanded = false
  }

  function handleFocusOut(e: FocusEvent) {
    if (!dropdownRef.contains(e.relatedTarget as Node)) {
      expanded = false
    }
  }

</script>

<!--todo on click outside-->
<div {...$$restProps} class="snovy-combo-box {$$restProps.class || ''}" aria-expanded={expanded} data-direction={dropdownDirection}
     bind:this={comboRef} on:keydown={e => useKey(e, keyMap)}
>
  <SnovyInput
    id={$$restProps.id ? $$restProps.id + "-input" : null}
    on:input on:change on:click={e => {
        expanded = !expanded

        if (expanded) {
            inputValue = ""
        }
    }}
    bind:value={inputValue} placeholder={placeholderValue}
  />

  {#if options.allowDeselect}
    <SnovyButton icon="remove" circular fill on:click={()=> reset()}>

    </SnovyButton>
  {/if}

  <SnovyToggle bind:value={expanded} icons={["expanded", "collapsed"]}>

  </SnovyToggle>

  <slot name="spawn-button"/>
</div>

<div
  {...$$restProps} style={dropdownStyle} data-visible={expanded}
  class="snovy-dropdown snovy-absolute snovy-scroll {$$restProps.class || ''}" class:border
  bind:this={dropdownRef} on:focusout={handleFocusOut}
>
  <ol class="snovy-dropdown-content">
    {#if inputValue?.isNotBlank() && addItem}
      <li class="snovy-dropdown-item info-dropdown-item">
        Pressing Enter will create {inputValue} ...
      </li>
    {/if}

    {#each dropdownItems as item, index}
      <li class="snovy-dropdown-item" tabIndex={0}
          data-active={item.toString() === selectedItem?.toString()} data-highlighted={index === highlightedIndex}
          on:mouseenter={e => highlightedIndex = index} on:focusin={e => highlightedIndex = index}
          on:click={e => selectItem(item)}
      >
        <!--TODO probably render tag groups etc. using/similarly to optgroup = no prefixing/mixing group and tag into a single element-->
        {#if customItem}
          <!--TODO this custom item - if I keep it - needs to also implement highlighting... somehow-->
          <svelte:component this={customItem.part} {...customItem.props} item={item}></svelte:component>
        {:else}
          <!--TODO debounce-->
          {@const text = item.toString()}
          {@const position = findStringSimilarityIndex(text, inputValue)}
          <div class="li-simple-content">
            <span>
            {#if inputValue && position > -1}<!--
              -->{text.substring(0, position)}<!--
              --><span class="snovy-highlight-helper">{text.substring(position, position + inputValue.length)}</span><!--
              -->{text.substring(position + inputValue.length)}
            {:else}
              {text}
            {/if}
            </span>
          </div>
        {/if}
      </li>
    {/each}

    {#if dropdownItems.isEmpty()}
      <li class="snovy-dropdown-item info-dropdown-item snovy-dropdown-no-match">
        No matching items found.
      </li>
    {/if}

  </ol>
</div>

<!--TODO spawn-->

<style lang="scss">
  .snovy-combo-box {
    --border-width: var(--border-thin);
    --border-rad: var(--rad-rounded);

    width: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1;
    gap: 0.2em;
    padding-right: 0.2em;

    border-radius: var(--border-rad);

    &[aria-expanded="true"] {
      &[data-direction="up"] {
        border-radius: var(--border-rad) var(--border-rad) 0 0;
      }

      &[data-direction="down"] {
        border-radius: 0 0 var(--border-rad) var(--border-rad);
      }
    }

    :global .snovy-input {
      --border-width: 0;
      flex-grow: 1;
      outline: unset !important;
    }

    :global .snovy-button {
      font-size: var(--font-small);
      border-style: unset;
    }

    :global .snovy-button,
    :global .snovy-icon {
      //TODO i'd rather icons in buttons reacted to button font-size
      height: 0.8em;
    }
  }

  :global .snovy-dropdown {
    .snovy-dropdown-content {
      list-style: none;
      background-color: var(--color-main);
      margin: 0;
      padding: 0;
      font-size: var(--font-small) !important;
    }

    .snovy-dropdown-item {
      scroll-snap-align: start;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      user-select: none;
      display: flex;
      flex-flow: column nowrap;
      place-content: flex-start center;
      padding: 0.1em 0.2em;
      flex-shrink: 0;
    }

    .snovy-dropdown-no-match {
      height: 100%;
      text-align: center;
    }

    .info-dropdown-item {
      white-space: pre-line;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
