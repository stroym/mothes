<script lang="ts">

  import SnovyInput from "./SnovyInput.svelte";
  import SnovyButton from "./SnovyButton.svelte";
  import SnovyToggle from "./SnovyToggle.svelte";

  export let value = ""

  export let border = true
  export let options: { allowDeselect?: boolean } = {}
  export let reset: () => void = () => false

  let isOpen: boolean = false

  const onClick = (e) => {
    console.log(e)

    isOpen = !isOpen
  }

  const onFocus = (e) => {
    console.log(e)

    isOpen = !isOpen
  }

  const onBlur = (e) => {
    console.log(e)

    isOpen = false
  }

</script>

<div {...$$restProps} class="snovy-combo-box {$$restProps.class || ''}">
  <SnovyInput
    id={$$restProps.id ? $$restProps.id + "-input" : null}
    on:input on:change
    on:click={onClick} on:focus={onFocus} on:blur={onBlur}
    bind:value
  />

  <!--{#if options.allowDeselect}-->
    <SnovyButton icon="remove" circular fill on:click={()=> reset()}>

    </SnovyButton>
  <!--{/if}-->

  <SnovyToggle value={isOpen} icons={["expanded", "collapsed"]}>

  </SnovyToggle>

  <slot name="spawn-button"/>

</div>

<div
  {...$$restProps}
  class="snovy-dropdown snovy-absolute snovy-scroll {$$restProps.class || ''}" class:border
  data-visible={isOpen}
>
  <ol>

  </ol>
</div>

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
</style>
