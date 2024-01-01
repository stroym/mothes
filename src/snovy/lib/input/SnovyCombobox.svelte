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
  import SnovyList from "../list/SnovyList.svelte"

  type T = $$Generic<GenericItem>

  export let value = ""

  export let border = true
  export let options: ComboOptions = defaultOptions //TODO compositing props
  export let reset: () => void = () => false

  let isOpen: boolean = false

  export let items: Array<T> | undefined = []
  export let itemSort: (a: T, B: T) => number = undefined

  let dropdownItems: Array<T> = []

  let comboRef: HTMLDivElement = null
  let dropdownRef: HTMLDivElement = null

  let dropdownStyle = ""

  $: {
    const overflowStyle = useDropdown(dropdownRef, comboRef, isOpen, () => isOpen = false, dropdownItems.length,
      {itemNesting: 1, maxItems: 12, offset: border ? 1 : 0, useParentWidth: options.wideDropdown}
    )

    if (isOpen) {
      dropdownStyle = Object.entries(overflowStyle()).filter(it => Boolean(it[1])).join(";").replaceAll(",", ":")
    }
  }

  hideAbsoluteOnMovement(() => isOpen = false)

</script>

<!--todo on click outside-->
<!--todo keynav - most of it probabl directly on list?-->
<div {...$$restProps} class="snovy-combo-box {$$restProps.class || ''}" bind:this={comboRef}>
  <SnovyInput
    id={$$restProps.id ? $$restProps.id + "-input" : null}
    on:input on:change on:click={e => isOpen = !isOpen}
    bind:value
  />

  {#if options.allowDeselect}
    <SnovyButton icon="remove" circular fill on:click={()=> reset()}>

    </SnovyButton>
  {/if}

  <SnovyToggle bind:value={isOpen} icons={["expanded", "collapsed"]}>

  </SnovyToggle>

  <slot name="spawn-button"/>

</div>

<div
  {...$$restProps} style={dropdownStyle} data-visible={isOpen}
  class="snovy-dropdown snovy-absolute snovy-scroll {$$restProps.class || ''}" class:border
  bind:this={dropdownRef}
>
  <SnovyList class="snovy-dropdown-content" items={items}></SnovyList>
</div>

<!--TODO spawn-->

<!--TODO probably render tag groups etc. a la native optgroup = no prefixing/mixing group and tag into a single element-->

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
      &[data-direction="true"] {
        border-radius: var(--border-rad) var(--border-rad) 0 0 !important;
      }

      &[data-direction="false"] {
        border-radius: 0 0 var(--border-rad) var(--border-rad) !important;
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
      height: 1em;
    }

    :global .snovy-icon {
      height: 1em; //TODO i'd rather icons in buttons reacted to button font-size
    }

  }

  :global .snovy-dropdown-content {
    list-style: none;
    background-color: var(--color-main);
    margin: 0;
    padding: 0;
    font-size: var(--font-small) !important;
  }

</style>
