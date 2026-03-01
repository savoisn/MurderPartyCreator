<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-4xl px-4 py-4">
        <RouterLink to="/scenarios" class="text-xl font-bold text-gray-900">
          Murder Party Creator
        </RouterLink>
      </div>
    </header>
    <main class="mx-auto max-w-4xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
