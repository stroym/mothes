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

  export let dialog: HTMLDialogElement = null
  let importInput: HTMLInputElement = null

  let themes: Array<Theme> = []
  let options: Options = $activeOptions.clone()
  let theme: Theme = undefined

  onMount(
    () => {
      getThemes()

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

  async function getThemes() {
    themes = await fetchThemes()

    theme = themes.find(it => it.id == options.themeId)
  }

  const fetchTheme = async () => {
    theme = await dexie.themes.get(options.themeId)
  }

  const submit = async () => {
    await theme?.save()
    options.themeId = theme?.id
    activeOptions.set(await options.save())
    //update current options etc.
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
      theme = firstTheme
    })
  }

  const cancel = async () => {
    await getThemes()

    options = $activeOptions.clone()
    await fetchTheme()
  }

  const mockData = async () => {
    await generate()
    location.reload()
  }

  const purgeData = async () => {
    await dexie.delete()
    location.reload()
  }

  let root = document.documentElement;

  const updateVar = (name: string, varName: string, value: string) => {
    $activeTheme[name] = value
    root.style.setProperty(name, value)
  }

  const themeInputs = [
    {
      label: "Primary text color",
      currentColor: $activeTheme.textPrimary,
      setColor: value => updateVar("textPrimary", "", value)
    },
    {
      label: "Secondary text color",
      currentColor: $activeTheme.textSecondary,
      setColor: value => updateVar("textSecondary", "", value)
    },
    {
      label: "Primary color",
      currentColor: $activeTheme.primary,
      setColor: value => updateVar("primary", "", value)
    },
    {
      label: "Accent color",
      currentColor: $activeTheme.accent,
      setColor: value => updateVar("accent", "", value)
    },
    {
      label: "Border color",
      currentColor: $activeTheme.border,
      setColor: value => updateVar("border", "", value)
    },
    {
      label: "Hover color",
      currentColor: $activeTheme.hover,
      setColor: value => updateVar("hover", "", value)
    },
    {
      label: "Active Color",
      currentColor: $activeTheme.activeItem,
      setColor: value => updateVar("activeItem", "", value)
    },
  ]

  let currentTitle: string

  const createTheme = () => {
    dexie.themes.put(Theme.makeFrom($activeTheme, currentTitle))
  }

  const deleteTheme = () => {
    // const tempThemes = Array.from(themes)
    // setCurrentTheme(tempThemes.deleteAndGet(currentTheme)!)
    // setThemes(tempThemes)
  }

</script>

<svelte:options accessors/>

<dialog id="app-options" open bind:this={dialog}>
  <div id="import-export" class="options-container">
    <SnovyLabel value="Import">
      <svelte:fragment slot="after">
        <SnovyButton icon="import" on:click={() => importInput?.click()}/>
        <input bind:this={importInput} type="file" accept="application/json"
               on:change={e => importData(e.target.files)}
        />
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

  <form id="theme-options" class="snovy-options-container snovy-scroll" on:submit={e => e.preventDefault()}
        tabIndex={-1}>
    <div class="snovy-input-group">
      <!--        <ComboBox<Theme>-->
      <!--        label={{value: "Active theme"}} items={themes} selected={currentTheme}-->
      <!--        onSelect={value => value && setCurrentTheme(value)}-->
      <!--        options={{allowDeselect: false}}-->
      <!--        borders={{main: true, dropdown: true}}-->
      <!--        />-->

      <SnovyLabel value="Theme title"/>
      <SnovyInput value={currentTitle}/>

      {#each themeInputs as ti}
        <SnovyLabel value={ti.label}/>
        <SnovyInput mode="color" value={ti.currentColor} on:change={e => ti.setColor(e.target.value)}/>
      {/each}
    </div>
    <div class="snovy-button-group">
      <SnovyButton value="Delete theme" on:click={() => deleteTheme()}/>
      <SnovyButton value="Reset theme" on:click={() => false}/>
      <SnovyButton
        type="submit" value="Save theme"
        onClick={async () => await $activeTheme.updateTitle(currentTitle)}
      />
      <SnovyButton type="submit" value="Create theme" on:click={() => createTheme()}/>
    </div>
  </form>

  <div id="control-buttons">
    <SnovyButton value="Restore defaults" onClick={restore}/>
    <SnovyButton value="Cancel" onClick={cancel}/>
    <SnovyButton type="submit" value="Save" onClick={submit}/>
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
        grid-template-columns: min-content 50%;
        grid-auto-rows: min-content;
        gap: 0.5em;
        justify-content: space-between;

        .snovy-input-color {
          width: unset;
        }
      }

      .snovy-button-group {
        grid-area: buttons;
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        .snovy-button {
          margin: 0.2em;
        }
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
