import { getRequest } from '.';

export const get = (licensePlate) => (
  getRequest(`/m9d7-ebf2.json?kenteken=${licensePlate}`)
    .then((vehicles) => {
      if (!vehicles.length) {
        throw new Error(`Geen voertuigen gevonden met kenteken ${licensePlate}.`);
      }

      return vehicles[0];
    })
    .catch((cause) => {
      throw new Error(
        `Er is iets fout gegaan tijdens het ophalen van voertuig ${licensePlate}.
        Probeer het later nogmaals of neem contact op met de beheerder.`,
        {
          cause,
        },
      );
    })
);

// TODO: Prefer paginated data
// TODO: Prefer smaller set of data per vehicle
export const getAll = () => (
  getRequest('/m9d7-ebf2.json')
    .catch((cause) => {
      throw new Error(
        `Er is iets fout gegaan tijdens het ophalen van de voertuigen.
        Probeer het later nogmaals of neem contact op met de beheerder.`,
        {
          cause,
        },
      );
    })
);
