import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouterStore } from '@/stores/router';

const paginationKey = 'page';

// eslint-disable-next-line import/prefer-default-export
export function useRoutePagination(value) {
  const route = useRoute();
  const routerStore = useRouterStore();
  const savedValue = ref(0);

  function loadSavedValue() {
    if (!(paginationKey in route.query)) {
      return;
    }

    savedValue.value = Number(route.query[paginationKey]) || 1;
  }

  function updateRoute(newvalue) {
    if (newvalue > 1) {
      routerStore.updateQueryParameter(paginationKey, newvalue);
    } else {
      routerStore.removeQueryParameter(paginationKey);
    }
  }

  watch(
    value,
    updateRoute,
  );

  onMounted(() => {
    loadSavedValue();
  });

  return {
    savedValue,
  };
}
