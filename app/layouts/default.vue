<template>
  <div class="h-screen flex">
    <!-- Sidebar -->
    <NavSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <NavHeader />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
