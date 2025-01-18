<template>
  <div class="flex flex-col min-h-screen h-screen">
    <header class="flex justify-center items-center p-4 border-b border-neutral-200 dark:border-neutral-800">
      <!-- Placeholder for future logo -->
      <Logo class="h-10" />
    </header>
    <main class="flex justify-center items-center flex-1">
      <slot />
    </main>
  </div>
</template>
