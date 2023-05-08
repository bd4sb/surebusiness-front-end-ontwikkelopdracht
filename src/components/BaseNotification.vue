<template>
  <div class="notification">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.notification {
  display: inline-block;
  padding: 1em 1.25em;
  border-radius: var(--border-radius-m);
  box-shadow: 0 0 0 1px #e5b4b4 inset;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: pre-line;
  color: #d78787;
  background-color: #ffdddd;
}
</style>
