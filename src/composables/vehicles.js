import { computed } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export function useVehicles(vehicles) {
  const parseColor = (color) => (
    [
      'N.v.t.',
      'Niet geregistreerd',
    ].includes(color)
      ? ''
      : color
  );

  const parseDate = (dateString) => (
    new Date(dateString)
      .toLocaleDateString('nl-NL', {
        dateStyle: 'long',
      })
  );

  function parsePrice(price) {
    let newValue = `&euro;&nbsp;${price}`;

    if (!price.includes(',')) {
      newValue += ',-';
    }

    return newValue;
  }

  function parseYesOrNo(yesOrNo) {
    switch (yesOrNo) {
      case 'Ja':
        return '✔️';

      case 'Nee':
        return '❌';

      default:
        return yesOrNo;
    }
  }

  function parseProperty(name, value) {
    if (name.includes('datum')) {
      return parseDate(value);
    }

    if (name.includes('kleur')) {
      return parseColor(value);
    }

    if (name.includes('prijs')) {
      return parsePrice(value);
    }

    if (['Ja', 'Nee'].includes(value)) {
      return parseYesOrNo(value);
    }

    return value;
  }

  const parsedVehicles = computed(() => (
    vehicles.value
      .map((vehicle) => (
        Object.entries(vehicle)
          .reduce(
            (accumulator, [propertyName, propertyValue]) => ({
              ...accumulator,
              [propertyName]: parseProperty(propertyName, propertyValue),
            }),
            {},
          )
      ))
  ));

  return {
    parsedVehicles,
  };
}
