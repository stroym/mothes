<script lang="ts">

  export let value: string
  export let column: boolean = false

</script>

<label {...$$restProps} class={`snovy-label ${$$restProps.class || ""}`} class:column>
  <slot name="before"/>
  <span>{value}</span>
  <slot name="after"/>
</label>

<style lang="scss">
  .snovy-label {
    padding: 0 0.2em;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
    justify-self: flex-start;
    align-items: center;
    justify-content: space-between;
    gap: 0.2em;

    &:is(.column) {
      flex-flow: column nowrap;

      span {
        align-self: flex-start;
      }
    }

    :global svg {
      margin: 0 0.2em;
      height: 1em;
      width: 1em;
    }
  }
</style>
