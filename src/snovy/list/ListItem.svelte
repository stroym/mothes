<script lang="ts">

  export let preset: "editable" | "simple" = "simple"

  export let item: Record<string, any>

  //  pass active as a data-active
  //  pass selected as a data-active
</script>


<li {...$$restProps} class="snovy-list-item {$$restProps.class || ''}">

  {#if preset === "editable"}
    <EditableInput placeholder="Title" onValueChange={onValueChange} value={item.toString()}/>
  {:else if preset === "simple"}
    <div class="li-simple-content" tabIndex={0}>{item.toString()}</div>
  {/if}

  {item.toString()}
</li>


const ListItem =
<T extends GenericItem>(
  {
    onSelect,
      onContext,
      onValueChange,
      customItem,
      preset,
      onRemove,
    ...props
  }: ListItemProps
  <T>
    ) => {

    return (
    <li
    {...props}
    className={makeClassName([LI, STYLED_HOVER_FILL, className], [[I_SELECT, selected], [I_ACTIVE, active]])}
    onClick={e => {!e.isDefaultPrevented() && onSelect(item)}}
    onContextMenu={e => {
    e.stopPropagation()
    onContext && onContext(item)
  }}
    >
    {resolvePreset()}
    {
    customItem && customItem(item, onValueChange)
  }
    {
    onRemove &&
    <Button
    circular preset="remove" border
    onClick={e => {
    e.stopPropagation()
    onRemove(item)
  }}
    />
  }
    </li>
    )

  }

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
