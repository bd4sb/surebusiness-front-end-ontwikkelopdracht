import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useRouterStore = defineStore('router', () => {
  const route = useRoute();
  const router = useRouter();
  const queryParameters = ref(route.query);

  function updateQueryParameter(name, value) {
    queryParameters.value = {
      ...queryParameters.value,
      [name]: value,
    };
  }

  function removeQueryParameter(name) {
    const newValue = { ...queryParameters.value };
    delete newValue[name];
    queryParameters.value = newValue;
  }

  function updateRoute(newValue) {
    router.replace({
      query: {
        ...newValue,
      },
    });
  }

  watch(
    queryParameters,
    updateRoute,
  );

  return {
    removeQueryParameter,
    updateQueryParameter,
  };
});
