<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits([
  'update:modelValue',
]);

const activeFilters = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

function remove(name, index) {
  activeFilters.value[name] = activeFilters.value[name]
    .filter((_, i) => i !== index);
}
</script>

<template>
  <div class="active-filters">
    <template
      v-for="(options, name) in activeFilters"
      :key="`${name}_${options}`"
    >
      <button
        v-for="(option, i) in options"
        class="active-filter"
        :key="`${name}_${option}_${i}`"
        type="button"
        @click="remove(name, i)"
      >
        {{ option }}
      </button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-s);
}

.active-filter {
  display: flex;
  align-items: center;
  gap: .5ch;
  padding: .75em 1em;
  border: none;
  border-radius: var(--border-radius-s);
  box-shadow:
    1px 1px 0 rgb(0 0 0 / .05) inset,
    -1px -1px 0 #fff inset;
  font-size: .75rem;
  color: #999;
  background-color: rgb(0 0 0 / .05);
  cursor: pointer;
  transition: color .2s;

  &:hover {
    color: #bb1111;
  }
}
</style>
