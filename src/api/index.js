const parseResource = (resource) => (
  resource.startsWith('/')
    ? import.meta.env.VITE_API_BASE_URL + resource
    : resource
);

const request = (method, resource) => (
  fetch(
    parseResource(resource),
    {
      method,
    },
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response);
      }

      return response.json();
    })
);

// eslint-disable-next-line import/prefer-default-export
export const getRequest = (resource) => request('GET', resource);
