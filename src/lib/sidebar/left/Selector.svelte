<script lang="ts">
    import List from "../../../snovy/list/List.svelte";

    import {activeNotebook, activeSection} from "../../note-store";
</script>

<List preset="editable" items={$activeNotebook?.sections}>
</List>
<List preset="editable" items={$activeSection?.notes}>
</List>

<style lang="scss">

</style>
