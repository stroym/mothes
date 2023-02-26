<script lang="ts">

  import SnovyIcon from "../helper/Icon.svelte"
  import {SnovyIconOption} from "../snovy-types"

  export let icon: SnovyIconOption
  export let iconToggled: SnovyIconOption = null

</script>

<!--export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(-->
<!--function ToggleButton(-->
<!--{onClick, getState, setState, ...props}: ToggleButtonProps,-->
<!--ref?: React.Ref<HTMLButtonElement>-->
<!--  ) {-->

<!--  const [toggled, setToggled, toggle] = useToggle()-->

<!--  useEffect(-->
<!--  () => {-->
<!--  if (setState != undefined) {-->
<!--  setToggled(setState)-->
<!--}-->
<!--}, [setState]-->
<!--  )-->

<!--  const handleClick = (e) => {-->
<!--  onClick && onClick(e)-->
<!--  getState && getState(!toggled)-->
<!--  toggle()-->
<!--}-->

<!--  return <Button {...props} ref={ref} toggled={toggled} onClick={handleClick}/>-->
<!--}-->
<!--  )-->


<label>
  {#if icon}
    <SnovyIcon name={icon}/>
  {:else if iconToggled}
    <SnovyIcon name={iconToggled}/>
  {/if}
  <input type="checkbox"/>
</label>

<style lang="scss">
</style>
