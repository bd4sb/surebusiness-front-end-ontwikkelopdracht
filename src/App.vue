<script setup>
import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
</script>

<template>
  <header class="header">
    <BaseBreadcrumb />
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 2;
  height: var(--header-height);
  box-shadow: var(--shadow-m);
  background-color: #fff;
}
</style>
