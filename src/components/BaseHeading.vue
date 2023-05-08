<script setup>
import { computed } from 'vue';

const props = defineProps({
  appearance: {
    type: Number,
    default: undefined,
    validator: (value) => (
      value >= 1
      && value <= 6
    ),
  },
  level: {
    type: Number,
    default: 1,
    validator: (value) => (
      value >= 1
      && value <= 6
    ),
  },
});

const appearance = computed(() => `h${props.appearance || props.level}`);
const component = computed(() => `h${props.level}`);
</script>

<template>
  <component
    :class="[
      'heading',
      `heading--${appearance}`,
    ]"
    :is="component"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.heading {
  margin: 0 0 .5em;
  line-height: 1.2;

  &--h1 {
    font-size: 2rem;
  }

  &--h2 {
    font-size: 1.5rem;
  }

  &--h3 {
    font-size: 1.17rem;
  }

  &--h4 {
    font-size: 1rem;
  }

  &--h5 {
    font-size: .83rem;
  }

  &--h6 {
    font-size: 67rem;
  }
}
</style>
