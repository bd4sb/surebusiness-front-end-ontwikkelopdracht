<script setup>
import { computed, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getAll } from '@/api/vehicles';
import { useFilters } from '@/composables/filters';
import { useVehicles } from '@/composables/vehicles';
import BaseFilters from '@/components/BaseFilters.vue';
import BaseHeading from '@/components/BaseHeading.vue';
import BaseNotification from '@/components/BaseNotification.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseTable from '@/components/BaseTable.vue';
import WidthContainer from '@/components/WidthContainer.vue';

const router = useRouter();
const itemsPerPage = 50;

const state = reactive({
  activeFilters: {},
  error: '',
  page: 1,
  savedFiltersLoaded: false,
  vehicles: [],
});

const {
  activeFilters,
  vehicles,
} = toRefs(state);

function loadVehicles() {
  getAll()
    .then((vehiclesData) => {
      vehicles.value = vehiclesData;
    })
    .catch(({ message }) => {
      state.error = message;
    });
}

const filterProperties = {
  Kleur: ['eerste_kleur', 'tweede_kleur'],
  'Aantal zitplaatsen': 'aantal_zitplaatsen',
};

const {
  filteredObjects: filteredVehicles,
  filters,
} = useFilters(vehicles, filterProperties, activeFilters);

const tableRows = computed(() => (
  filteredVehicles.value
    .slice((state.page - 1) * itemsPerPage, state.page * itemsPerPage)
    .map((vehicle) => ({
      kenteken: vehicle.kenteken,
      merk: vehicle.merk,
      voertuigsoort: vehicle.voertuigsoort,
      eerste_kleur: vehicle.eerste_kleur,
      tweede_kleur: vehicle.tweede_kleur,
      aantal_zitplaatsen: vehicle.aantal_zitplaatsen,
    }))
));

const { parsedVehicles: parsedTableRows } = useVehicles(tableRows);

function tableRowClicked({ kenteken: licensePlate }) {
  router.push({
    name: 'vehicle',
    params: {
      licensePlate,
    },
  });
}

async function resetActiveFilters() {
  activeFilters.value = {};
}

loadVehicles();
</script>

<template>
  <WidthContainer class="vehicles-index">
    <BaseHeading>
      Voertuigen
    </BaseHeading>

    <BaseNotification v-if="state.error.length">
      {{ state.error }}
    </BaseNotification>

    <template v-else>
      <BaseFilters
        v-if="Object.keys(filters).length"
        v-model="activeFilters"
        :filters="filters"
        purpose="vehicles"
        @saved-filters-loaded="state.savedFiltersLoaded = true"
      />

      <BaseTable
        v-if="vehicles.length"
        empty-button="Reset filters"
        empty-message="Er zijn geen voertuigen die aan de gekozen filters voldoen."
        :headers="[
          'Kenteken',
          'Merk',
          'Soort',
          'Kleur 1',
          'Kleur 2',
          'Aantal zitplaatsen',
        ]"
        :row-clicked="tableRowClicked"
        :rows="parsedTableRows"
        @empty-action="resetActiveFilters"
      >
        <template
          v-if="filteredVehicles.length && state.savedFiltersLoaded"
          v-slot:footer
        >
          <BasePagination
            v-model="state.page"
            :items-per-page="itemsPerPage"
            :total-items="filteredVehicles.length"
          />
        </template>
      </BaseTable>
    </template>
  </WidthContainer>
</template>

<style scoped lang="scss">
.vehicles-index {
  padding-top: var(--spacing-m);
  padding-bottom: var(--spacing-m);
}
</style>
