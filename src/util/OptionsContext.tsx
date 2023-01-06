//TODO svelte context/store

// import React, {useLayoutEffect, useState} from "react"
// import Options from "../data/model/options/Options"
// import {Theme} from "../data/model/options/Theme"
// import {dexie} from "../index"
// import {defaults} from "../data/model/options/Defaults"
// import {ThemeProvider} from "@emotion/react"
// import {fetchThemes} from "../data/Database"
//
// const OptionsContext = React.createContext<OptionsContextType>({
//   options: defaults.options,
//   setOptions: () => false
// })
//
// type OptionsContextType = {
//   options: Options
//   setOptions: (options: Options) => void
// }
//
// export const OptionsProvider = (props: {
//   children: Array<React.ReactElement> | React.ReactElement
// }) => {
//
//   const [options, setIntOptions] = useState<Options>(defaults.options)
//   const [theme, setTheme] = useState<Theme>(defaults.themes.first()!)
//
//   useLayoutEffect(
//     () => {
//       dexie.transaction("rw", [dexie.options, dexie.themes], async () => {
//         await fetchThemes()
//         await initOptions().then(options => setOptions(options))
//       })
//     }, []
//   )
//
//   const initOptions = async () => {
//     return await dexie.options.toArray().then(async (options) => {
//       return options.isEmpty() ? await defaults.options.save() : await options.first()!.load()
//     })
//   }
//
//   const setOptions = async (options: Options) => {
//     await dexie.themes.get(options.themeId)
//       .then(async (loaded) => {
//         if (loaded) {
//           setTheme(loaded)
//         } else {
//           throw Error(`Theme with id ${options.themeId} not found!`)
//         }
//       })
//       .catch(async (error) => {
//         console.error(`Error while fetching theme! Reverting to default theme...\n${error}`)
//
//         const backup = (await fetchThemes()).first()!
//         setTheme(backup)
//         options.themeId = backup.id
//       })
//
//     setIntOptions(await options.save())
//   }
//
//   return (
//     <OptionsContext.Provider value={{options, setOptions}}>
//       <ThemeProvider theme={theme}>
//         {props.children}
//       </ThemeProvider>
//     </OptionsContext.Provider>
//   )
// }
//
// export default OptionsContext
