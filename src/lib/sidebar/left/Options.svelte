<script lang="ts">

  import SnovyButton from "../../../snovy/lib/input/SnovyButton.svelte";
  import SnovyLabel from "../../../snovy/lib/input/SnovyLabel.svelte";
  import {dexie} from "../../../index";
  import generate from "../../../data/Generator";
  import {exportData, fetchThemes, importData} from "../../../data/Database";
  import {onMount} from "svelte";
  import {Theme} from "../../../data/model/options/Theme";
  import {defaults} from "../../../data/model/options/Defaults";
  import {activeOptions, activeTheme} from "../../stores/options-store";
  import type Options from "../../../data/model/options/Options";
  import SnovyInput from "../../../snovy/lib/input/SnovyInput.svelte";
  import SnovyCombobox from "../../../snovy/lib/input/SnovyCombobox.svelte";

  export let dialog: HTMLDialogElement = null
  let importInput: HTMLInputElement = null

  let themes: Array<Theme> = []
  let options: Options = $activeOptions.clone()
  let theme: Theme = undefined

  onMount(
    async () => {
      themes = await fetchThemes()

      theme = themes.find(it => it.id == options.themeId)

      return () => {
        if (JSON.stringify($activeOptions) !== JSON.stringify(options)) {
          if ((confirm("You have unsaved changes. Would you like to save them?"))) {
            submit()
          } else {
            cancel()
          }
        }
      }
    }
  )

  const submit = async () => {
    theme = await theme.save()
    options.themeId = theme.id
    activeOptions.set(await options.save())
    activeTheme.set(theme)
  }

  const restore = async () => {
    await dexie.transaction("rw", dexie.themes, dexie.options, async () => {
      await dexie.themes.clear()
      await dexie.themes.bulkAdd(defaults.themes)

      const defaultOptions = defaults.options
      const newThemes = await dexie.themes.toArray()
      const firstTheme = newThemes.first()!
      defaultOptions.themeId = firstTheme.id

      await dexie.options.clear()
      await dexie.options.add(defaultOptions)

      activeOptions.set(defaultOptions)

      options = defaultOptions
      themes = newThemes
      setActiveTheme(firstTheme)
    })
  }

  const cancel = async () => {
    themes = await fetchThemes()

    options = $activeOptions.clone()
    setActiveTheme(themes.find(it => it.id === options.themeId))
  }

  const mockData = async () => {
    await generate()
    location.reload()
  }

  const purgeData = async () => {
    await dexie.delete()
    location.reload()
  }

  const deleteTheme = () => {
    // const tempThemes = Array.from(themes)
    // setCurrentTheme(tempThemes.deleteAndGet(currentTheme)!)
    // setThemes(tempThemes)
  }

  const setActiveTheme = (th: Theme) => {
    theme = th
    theme.setCss()
  }

  let root = document.documentElement;

  const updateThemeVar = (name: string, e: any) => {
    theme[name] = e.target.value
    root.style.setProperty(Theme.VAR_NAMES.get(name), e.target.value)
  }

</script>

<svelte:options accessors/>

<dialog id="app-options" open bind:this={dialog}>
  <div id="import-export" class="options-container">
    <SnovyLabel value="Import">
      <svelte:fragment slot="after">
        <SnovyButton icon="import" on:click={() => importInput?.click()}/>
        <input bind:this={importInput} type="file" accept="application/json" on:change={e => importData(e.target.files)}/>
      </svelte:fragment>
    </SnovyLabel>
    <SnovyLabel value="Export">
      <SnovyButton slot="after" icon="export" on:click={exportData}/>
    </SnovyLabel>
    <SnovyLabel value="Mock">
      <SnovyButton slot="after" icon="add" on:click={mockData}/>
    </SnovyLabel>
    <SnovyLabel value="Drop">
      <SnovyButton slot="after" icon="remove" on:click={purgeData}/>
    </SnovyLabel>
  </div>

  <form id="theme-options" class="snovy-options-container snovy-scroll" on:submit={e => e.preventDefault()} tabIndex={-1}>
    <div class="snovy-input-group">
      {#if theme}
        <!--        <ComboBox<Theme>-->
        <!--        label={{value: "Active theme"}} items={themes} selected={currentTheme}-->
        <!--        onSelect={value => value && setCurrentTheme(value)}-->
        <!--        options={{allowDeselect: false}}-->
        <!--        borders={{main: true, dropdown: true}}-->
        <!--        />-->

        <SnovyLabel for="theme-title-input" value="Theme title"/>
        <SnovyCombobox id="theme-title" value={theme.title} on:change={e => theme.title = e.target.value}/>

        <SnovyLabel for="theme-text-color-1" value="Primary text color"/>
        <SnovyInput id="theme-text-color-1" mode="color" value={theme.textPrimary} on:change={e => updateThemeVar("textPrimary", e)}/>

        <SnovyLabel for="theme-text-color-2" value="Secondary text color"/>
        <SnovyInput id="theme-text-color-2" mode="color" value={theme.textSecondary} on:change={e => updateThemeVar("textSecondary", e)}/>

        <SnovyLabel for="theme-color-1" value="Primary color"/>
        <SnovyInput id="theme-color-1" mode="color" value={theme.primary} on:change={e => updateThemeVar("primary", e)}/>

        <SnovyLabel for="theme-color-2" value="Accent color"/>
        <SnovyInput id="theme-color-2" mode="color" value={theme.accent} on:change={e => updateThemeVar("accent", e)}/>

        <SnovyLabel for="theme-color-3" value="Border color"/>
        <SnovyInput id="theme-color-3" mode="color" value={theme.border} on:change={e => updateThemeVar("border", e)}/>

        <SnovyLabel for="theme-color-4" value="Hover color"/>
        <SnovyInput id="theme-color-4" mode="color" value={theme.hover} on:change={e => updateThemeVar("hover", e)}/>

        <SnovyLabel for="theme-color-5" value="Focus color"/>
        <SnovyInput id="theme-color-5" mode="color" value={theme.focus} on:change={e => updateThemeVar("focus", e)}/>

        <SnovyLabel for="theme-color-6" value="Active Color"/>
        <SnovyInput id="theme-color-6" mode="color" value={theme.active} on:change={e => updateThemeVar("activeItem", e)}/>
      {/if}
    </div>
    <div class="snovy-button-group">
      <SnovyButton type="submit" value="Create" on:click={() => dexie.themes.put(Theme.makeFrom(theme, theme.title))}/>
      <SnovyButton value="Delete" on:click={() => deleteTheme()}/>
      <SnovyButton
        value="Restore"
        disabled={theme && defaults.themes.every(it => it.title !== theme.title)}
        on:click={() => setActiveTheme(defaults.themes.find(it => it.title === theme.title))}
      />
    </div>
  </form>

  <div id="control-buttons">
    <SnovyButton value="Restore defaults" on:click={async () => await restore()}/>
    <SnovyButton value="Cancel" on:click={async () => await cancel()}/>
    <SnovyButton type="submit" value="Save" on:click={async () => await submit()}/>
  </div>
</dialog>

<style lang="scss">
  #app-options {
    width: calc(98vw - var(--border-thin));
    height: 100%;
    margin-inline: auto 0;
    z-index: 100;

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 1fr 10%;
    gap: 0.5em 1em;
    justify-items: center;
    align-items: start;

    #import-export {
      grid-area: 1 / 1 / span 1 / span 1;
      display: grid;
      grid-template-columns: min-content 50%;
      grid-auto-rows: min-content;
      gap: 0.5em;

      :global .snovy-label {
        width: 100%;
      }
    }

    #theme-options {
      grid-area: 1 / 3 / span 1 / span 2;
      display: grid;
      grid-template-areas: "combo" "inputs" "buttons";
      gap: 1em;
      padding: 0 1em;
      max-height: 100%;
      width: 100%;

      .snovy-input-group {
        grid-area: inputs;
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-auto-rows: min-content;
        gap: 0.5em;
        justify-content: space-between;

        .snovy-input-color {
          width: unset;
        }

        :global .snovy-input {
          font-size: var(--font-small);
        }
      }

      .snovy-button-group {
        grid-area: buttons;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5em;
      }
    }

    #control-buttons {
      grid-area: 2 / 5 / span 1 / span 2;
      justify-self: end;
      align-self: center;
      gap: 1em;

      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
