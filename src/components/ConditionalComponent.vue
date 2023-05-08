<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
const props = defineProps({
  condition: {
    type: Boolean,
    required: true,
  },
  is: {
    type: [
      Object,
      String,
    ],
    required: true,
  },
});
</script>

<template>
  <component
    v-if="props.condition"
    v-bind="$attrs"
    :is="props.is"
  >
    <slot />
  </component>

  <slot v-else />
</template>
