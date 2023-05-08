<script setup>
const props = defineProps({
  onClick: {
    type: Function,
    default: undefined,
  },
});
</script>

<template>
  <button
    v-if="typeof props.onClick === 'function'"
    class="pagination-item pagination-item--button"
    type="button"
    @click="props.onClick"
  >
    <slot />
  </button>

  <span
    v-else
    class="pagination-item"
  >
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints';

.pagination-item {
  --padding-x: .5em;
  padding: .5em var(--padding-x);
  border-radius: var(--border-radius-s);
  font-size: .875rem;
  font-weight: 700;

  @include mobile-l-and-larger {
    --padding-x: .7em;
  }

  @include tablet-and-larger {
    --padding-x: 1em;
  }

  &--button {
    display: grid;
    place-items: center;
    border: none;
    color: var(--color-primary);
    background-color: transparent;
    cursor: pointer;
    transition-property: scale, translate;
    transition-duration: .2s;

    &:hover {
      scale: 1.2;
      translate: 0 -.25em;
    }
  }
}
</style>
