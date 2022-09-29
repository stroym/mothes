<script lang="ts">
  export let title: string
</script>

<li class="snovy-list-item">
  {title}
</li>

<style lang="scss">
  .snovy-list-item {
    width: 100%;
    padding: 0.1em;
    scroll-snap-align: start;
    border-radius: unset;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;

    &, & > * {
      cursor: default;
      user-select: none;
    }

    & > :first-child {
      outline: none !important;
    }
  }
</style>
