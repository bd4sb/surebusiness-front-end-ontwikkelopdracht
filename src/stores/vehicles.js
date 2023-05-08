import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const viewedLocalStorageKey = 'viewedVehicles';

export default defineStore('vehicles', () => {
  const viewed = ref(JSON.parse(localStorage.getItem(viewedLocalStorageKey)) || []);

  function addViewed(licensePlate) {
    const newValue = viewed.value
      .filter((viewedLicensePlate) => viewedLicensePlate !== licensePlate);

    newValue.unshift(licensePlate);
    viewed.value = newValue;
  }

  function removeViewed(licensePlate) {
    viewed.value = viewed.value
      .filter((viewedLicensePlate) => viewedLicensePlate !== licensePlate);
  }

  function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  watch(
    viewed,
    (newValue) => setLocalStorage(viewedLocalStorageKey, newValue),
  );

  return {
    addViewed,
    removeViewed,
    viewed,
  };
});
