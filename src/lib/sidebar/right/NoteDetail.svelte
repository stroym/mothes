<script lang="ts">
  import SnovyList from "../../../snovy/lib/list/SnovyList.svelte";

  import {activeNote} from "../../note-store";
</script>

<SnovyList preset="editable" items={$activeNote?.tags}>
</SnovyList>

<style lang="scss">

</style>
