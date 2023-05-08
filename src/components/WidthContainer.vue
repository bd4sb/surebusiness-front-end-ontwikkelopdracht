<script setup>
const props = defineProps({
  is: {
    type: String,
    default: 'div',
  },
});
</script>

<template>
  <component
    class="width-container"
    :is="props.is"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints';

.width-container {
  --spacing: var(--spacing-s);
  max-width: var(--max-width-site);
  padding: 0 var(--spacing);
  margin: 0 auto;
  box-sizing: border-box;

  @include mobile-m-and-larger {
    --spacing: var(--spacing-m);
  }
}
</style>
