<script lang="ts">
</script>

<div {...$$restProps} class={`snovy-sidebar ${$$restProps.class || ""}`}>
  {#if $$slots["header"]}
    <div class="sidebar-header color-pass">
      <slot name="header"></slot>
    </div>
  {/if}

  <div class="sidebar-body color-pass">
    <slot></slot>
  </div>

  {#if $$slots["footer"]}
    <div class="sidebar-footer color-pass">
      <slot name="footer"></slot>
    </div>
  {/if}
</div>

<style lang="scss">
  .snovy-sidebar {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex-flow: column nowrap;
    gap: var(--border-thin);
  }

  .sidebar-header,
  .sidebar-footer {
    flex: 1 1 auto;
  }

  .sidebar-body {
    //flex: 1 1 100%;
    height: 100%;
  }
</style>
