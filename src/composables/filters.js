import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useRouterStore } from '@/stores/router';

export function useFilters(objects, filterProperties, activeFilters) {
  const parseOptions = (options) => (
    options
      .filter((option, index, array) => (
        array.indexOf(option) === index
        && option?.length
      ))
      .sort()
  );

  const parseSinglePropertyOptions = (property) => parseOptions(
    objects.value
      .map((object) => object[property]),
  );

  const parseMultiplePropertiesOptions = (properties) => parseOptions(
    objects.value
      .reduce(
        (accumulator, currentValue) => {
          properties.forEach((property) => {
            accumulator.push(currentValue[property]);
          });

          return accumulator;
        },
        [],
      ),
  );

  const filters = computed(() => (
    Object.entries(filterProperties)
      .reduce(
        (accumulator, [name, property]) => {
          let options;

          if (typeof property === 'string') {
            options = parseSinglePropertyOptions(property);
          } else if (Array.isArray(property)) {
            options = parseMultiplePropertiesOptions(property);
          } else {
            options = [];
          }

          if (options.length > 1) {
            accumulator[name] = {
              options,
              property,
            };
          }

          return accumulator;
        },
        {},
      )
  ));

  const applyActiveFilters = (object) => (
    Object.entries(activeFilters.value)
      .filter((filterEntry) => filterEntry[1]?.length)
      .map(([filterName, options]) => {
        const { property } = filters.value[filterName];

        if (typeof property === 'string') {
          return options.includes(object[property]);
        }

        if (Array.isArray(property)) {
          return property.some((propertyName) => options.includes(object[propertyName]));
        }

        return true;
      })
      .every((filterConditionIsMet) => filterConditionIsMet)
  );

  const filteredObjects = computed(() => (
    objects.value
      .filter(applyActiveFilters)
  ));

  return {
    filteredObjects,
    filters,
  };
}

export function useRouteFilter(name, values) {
  const route = useRoute();
  const routerStore = useRouterStore();
  const hasSavedValues = computed(() => name.value in route.query);
  const savedValues = ref([]);
  const savedValuesLoaded = ref(false);

  function loadSavedValues() {
    if (!hasSavedValues.value) {
      savedValuesLoaded.value = true;
      return;
    }

    let routeQueryValues = route.query[name.value];

    if (!Array.isArray(routeQueryValues)) {
      routeQueryValues = [routeQueryValues];
    }

    savedValues.value = routeQueryValues;
    savedValuesLoaded.value = true;
  }

  function updateRoute(newValue) {
    routerStore.updateQueryParameter(name.value, newValue);
  }

  watch(
    values,
    updateRoute,
  );

  onMounted(() => {
    loadSavedValues();
  });

  return {
    hasSavedValues,
    savedValues,
    savedValuesLoaded,
  };
}

export function useStorageFilter(name, values, purpose, loadSaved = true) {
  const localStorageKey = `${purpose.value}Filters`;
  const savedValues = ref([]);

  function updateLocalStorage(newValue) {
    const localStorageFilters = JSON.parse(localStorage.getItem(localStorageKey)) || {};

    if (newValue.length) {
      localStorageFilters[name.value] = newValue;
    } else {
      delete localStorageFilters[name.value];
    }

    if (Object.keys(localStorageFilters).length) {
      localStorage.setItem(localStorageKey, JSON.stringify(localStorageFilters));
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }

  function loadSavedValue() {
    if (!loadSaved) {
      return;
    }

    const localStorageFilters = JSON.parse(localStorage.getItem(localStorageKey)) || {};

    if (name.value in localStorageFilters) {
      savedValues.value = localStorageFilters[name.value];
    }
  }

  watch(
    values,
    updateLocalStorage,
  );

  onMounted(() => {
    loadSavedValue();
  });

  return {
    savedValues,
  };
}
