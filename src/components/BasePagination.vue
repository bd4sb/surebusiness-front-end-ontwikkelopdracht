<script setup>
import { computed, toRefs, watch } from 'vue';
import { useRoutePagination } from '@/composables/pagination';
import IconNavigateBefore from '@/components/IconNavigateBefore.vue';
import IconNavigateNext from '@/components/IconNavigateNext.vue';
import PaginationItem from '@/components/PaginationItem.vue';

const props = defineProps({
  itemsPerPage: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: true,
  },
});

const { modelValue } = toRefs(props);

const emit = defineEmits([
  'update:modelValue',
]);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
const isOutOfRange = computed(() => totalPages.value > 7);

const currentPage = computed({
  get() {
    if (modelValue.value < 1) {
      return 1;
    }

    if (modelValue.value > totalPages.value) {
      return totalPages.value;
    }

    return modelValue.value;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const hasStartDots = computed(() => (
  currentPage.value > 4
  && isOutOfRange.value
));

const hasEndDots = computed(() => (
  (totalPages.value - currentPage.value) > 3
  && isOutOfRange.value
));

const pages = computed(() => {
  let min;
  let max;

  if (
    hasStartDots.value
    && hasEndDots.value
  ) {
    min = currentPage.value - 1;
    max = currentPage.value + 1;
  } else if (hasStartDots.value) {
    min = totalPages.value - 4;
    max = totalPages.value;
  } else if (hasEndDots.value) {
    min = 1;
    max = 5;
  } else {
    min = 1;
    max = totalPages.value;
  }

  return Array.from({
    length: (max - min) + 1,
  }, (_, i) => min + i);
});

function goTo(page) {
  currentPage.value = page;
}

function resetCurrentPage() {
  currentPage.value = 1;
}

watch(
  () => props.totalItems,
  resetCurrentPage,
);

const { savedValue } = useRoutePagination(modelValue);

watch(
  savedValue,
  (newValue) => goTo(newValue),
);
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination"
  >
    <PaginationItem
      v-if="currentPage > 1"
      class="pagination__item pagination__item--arrow"
      @click="goTo(currentPage - 1)"
    >
      <IconNavigateBefore class="pagination__icon" />
    </PaginationItem>

    <template v-if="hasStartDots">
      <PaginationItem @click="goTo(1)">
        1
      </PaginationItem>

      <PaginationItem>
        &mldr;
      </PaginationItem>
    </template>

    <template
      v-for="page in pages"
      :key="page"
    >
      <PaginationItem
        v-if="page !== currentPage"
        @click="goTo(page)"
      >
        {{ page }}
      </PaginationItem>

      <PaginationItem v-else>
        {{ page }}
      </PaginationItem>
    </template>

    <template v-if="hasEndDots">
      <PaginationItem>
        &mldr;
      </PaginationItem>

      <PaginationItem
        @click="goTo(totalPages)"
      >
        {{ totalPages }}
      </PaginationItem>
    </template>

    <PaginationItem
      v-if="currentPage < totalPages"
      class="pagination__item pagination__item--arrow"
      @click="goTo(currentPage + 1)"
    >
      <IconNavigateNext class="pagination__icon" />
    </PaginationItem>
  </nav>
</template>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints';

.pagination {
  display: flex;
  justify-content: center;

  &__item {
    &--arrow {
      @include mobile-s-and-smaller {
        display: none;
      }
    }
  }

  &__icon {
    height: 1.4em;
    margin: -.2em;
    fill: currentColor;
  }
}
</style>
