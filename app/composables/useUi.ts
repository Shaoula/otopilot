export const useUiState = defineStore('ui', () => {
  const showSidebar = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const colorMode = useColorMode()

  async function toggleSidebar(value?: boolean) {
    if (typeof value === 'boolean')
      showSidebar.value = value
    else
      showSidebar.value = !showSidebar.value
  }

  function setTheme(value: typeof theme.value) {
    theme.value = value
  }

  async function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    showSidebar,
    toggleSidebar,
    theme,
    setTheme,
    toggleTheme,
  }
}, { persist: true })

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUiState, import.meta.hot))
