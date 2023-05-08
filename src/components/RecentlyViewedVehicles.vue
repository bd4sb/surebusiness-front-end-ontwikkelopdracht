<script setup>
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { get } from '@/api/vehicles';
import BaseHeading from '@/components/BaseHeading.vue';
import IconImage from '@/components/IconImage.vue';
import useVehiclesStore from '@/stores/vehicles';
import WidthContainer from '@/components/WidthContainer.vue';

const vehiclesStore = useVehiclesStore();

const state = reactive({
  vehicles: [],
});

const { viewed } = storeToRefs(vehiclesStore);

function addVehicle(vehicle, licensePlatesOrder) {
  const newIndex = licensePlatesOrder
    .filter((newValue) => (
      [
        ...state.vehicles.map(({ kenteken }) => kenteken),
        vehicle.kenteken,
      ].includes(newValue)
    ))
    .indexOf(vehicle.kenteken);

  state.vehicles.splice(newIndex, 0, vehicle);
}

function updateVehicles(newValues, oldValues = []) {
  const newLicensePlates = newValues
    .filter((newValue) => !oldValues.includes(newValue));

  state.vehicles.sort((a, b) => newValues.indexOf(a.kenteken) - newValues.indexOf(b.kenteken));

  newLicensePlates
    .map((newLicensePlate) => (
      get(newLicensePlate)
        .then((vehicle) => addVehicle(vehicle, newValues))
        .catch(() => vehiclesStore.removeViewed(newLicensePlate))
    ));
}

watch(
  viewed,
  updateVehicles,
  {
    immediate: true,
  },
);
</script>

<template>
  <WidthContainer
    v-if="state.vehicles.length"
    class="recently-viewed-vehicles"
  >
    <BaseHeading
      class="recently-viewed-vehicles__title"
      :level="2"
    >
      Laatst bekeken voertuigen
    </BaseHeading>

    <ol class="recently-viewed-vehicles__list">
      <li
        v-for="{ kenteken, merk, voertuigsoort } in state.vehicles.slice(0, 12)"
        class="recently-viewed-vehicle"
        :key="`${kenteken}_${merk}_${voertuigsoort}`"
      >
        <div class="recently-viewed-vehicle__visual">
          <IconImage class="recently-viewed-vehicle__icon" />
        </div>

        <div class="recently-viewed-vehicle__caption">
          <BaseHeading
            :appearance="4"
            class="recently-viewed-vehicle__title"
            :level="3"
          >
            <RouterLink
              class="recently-viewed-vehicle__link"
              :to="{
                name: 'vehicle',
                params: {
                  licensePlate: kenteken,
                },
              }"
            >
              {{ kenteken }}
            </RouterLink>
          </BaseHeading>

          <p class="recently-viewed-vehicle__meta">
            {{ merk }}<br />
            {{ voertuigsoort }}
          </p>
        </div>
      </li>
    </ol>
  </WidthContainer>
</template>

<style scoped lang="scss">
@import '@/assets/styles/hovers';

.recently-viewed-vehicles {
  padding-top: var(--spacing-m);
  padding-bottom: var(--spacing-m);

  &__title {
    margin-bottom: var(--spacing-m);
    text-align: center;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-m);
    padding: 0;
    margin: 0;
    list-style: none;
  }
}

.recently-viewed-vehicle {
  @include hover-scale-ease-in-out-back;
  position: relative;
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-m);
  background: #fff;
  overflow: hidden;

  &__visual {
    display: grid;
    place-content: center;
    aspect-ratio: 1.5;
    background-color: rgb(0 0 0 / .35);
    opacity: .25;
  }

  &__icon {
    height: 5rem;
    opacity: .5;
  }

  &__caption {
    padding: var(--spacing-m);
  }

  &__title {
    color: var(--color-primary);
  }

  &__link {
    text-decoration: none;
    color: inherit;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &__meta {
    margin: 0;
    color: var(--color-text-secondary);
  }
}
</style>
