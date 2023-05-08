<script setup>
import { computed, reactive } from 'vue';
import ActiveFilters from '@/components/ActiveFilters.vue';
import BaseFilter from '@/components/BaseFilter.vue';

const props = defineProps({
  filters: {
    type: Object,
    default: () => {},
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
  purpose: {
    type: String,
    default: '',
  },
});

const state = reactive({
  savedFiltersLoaded: 0,
});

const emit = defineEmits([
  'savedFiltersLoaded',
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

function savedFilterLoaded() {
  state.savedFiltersLoaded += 1;

  if (state.savedFiltersLoaded === Object.keys(props.filters).length) {
    emit('savedFiltersLoaded');
  }
}
</script>

<template>
  <form class="filters">
    <BaseFilter
      v-model="activeFilters[name]"
      v-for="({ options }, name) in props.filters"
      :key="`${name}_${options}`"
      :name="name"
      :options="options"
      :purpose="props.purpose"
      @saved-filter-loaded="savedFilterLoaded"
    />
  </form>

  <ActiveFilters
    v-if="[].concat(...Object.values(activeFilters)).length"
    v-model="activeFilters"
  />
</template>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs) var(--spacing-s);
  margin-bottom: var(--spacing-s);
}
</style>
