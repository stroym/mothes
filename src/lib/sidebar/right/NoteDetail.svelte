<script lang="ts">
  import List from "../../../snovy/list/List.svelte";

  import {activeNote} from "../../note-store";
</script>

<List preset="editable" items={$activeNote?.tags}>
</List>

<style lang="scss">

</style>
