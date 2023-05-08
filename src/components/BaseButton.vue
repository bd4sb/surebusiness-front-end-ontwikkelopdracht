<template>
  <button
    class="button"
    type="button"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@import '@/assets/styles/hovers';

.button {
  @include hover-scale-ease-in-out-back;
  padding: 1em 1.5em;
  border: none;
  border-radius: var(--border-radius-s);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background-color: var(--color-primary);
}
</style>
