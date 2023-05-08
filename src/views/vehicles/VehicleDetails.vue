<script setup>
import { computed, reactive } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { get } from '@/api/vehicles';
import { useVehicles } from '@/composables/vehicles';
import BaseHeading from '@/components/BaseHeading.vue';
import BaseTable from '@/components/BaseTable.vue';
import useVehiclesStore from '@/stores/vehicles';
import WidthContainer from '@/components/WidthContainer.vue';

const route = useRoute();
const vehiclesStore = useVehiclesStore();

const state = reactive({
  error: '',
  vehicle: {},
});

function loadVehicle(licensePlate) {
  get(licensePlate)
    .then((vehicle) => {
      state.vehicle = vehicle;
    })
    .catch(({ message }) => {
      state.error = message;
    });
}

const { parsedVehicles } = useVehicles(computed(() => [state.vehicle]));

const isNotDateWithoutTime = (value) => (
  !value.includes('datum')
  || (
    value.includes('datum')
    && value.endsWith('dt')
  )
);

const tableRows = computed(() => (
  Object.entries(parsedVehicles.value[0])
    .filter((propertyEntry) => (
      !propertyEntry[0].includes('api')
      && isNotDateWithoutTime(propertyEntry[0])
    ))
    .map(([propertyName, propertyValue]) => [
      (propertyName.charAt(0).toUpperCase() + propertyName.slice(1)).replaceAll('_', ' '),
      propertyValue,
    ])
));

function init(licensePlate) {
  loadVehicle(licensePlate);
  vehiclesStore.addViewed(licensePlate);
}

onBeforeRouteUpdate((to, _, next) => {
  state.error = '';
  init(to.params.licensePlate);
  next();
});

init(route.params.licensePlate);
</script>

<template>
  <WidthContainer class="vehicle-details">
    <BaseHeading>
      {{ route.params.licensePlate }}
    </BaseHeading>

    <p v-if="state.error.length">
      {{ state.error }}
    </p>

    <BaseTable
      v-else-if="tableRows.length"
      :rows="tableRows"
    />
  </WidthContainer>
</template>

<style scoped lang="scss">
.vehicle-details {
  padding-top: var(--spacing-m);
  padding-bottom: var(--spacing-m);
}
</style>
