import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {
        name: 'vehiclesRoot',
      },
      meta: {
        displayName: 'Home',
      },
      children: [
        {
          path: '/vehicles',
          name: 'vehiclesRoot',
          component: () => import('@/views/vehicles/VehiclesLayout.vue'),
          redirect: {
            name: 'vehicles',
          },
          meta: {
            displayName: 'Voertuigen',
          },
          children: [
            {
              path: '',
              name: 'vehicles',
              component: () => import('@/views/vehicles/VehiclesIndex.vue'),
            },
            {
              path: ':licensePlate',
              name: 'vehicle',
              component: () => import('@/views/vehicles/VehicleDetails.vue'),
              meta: {
                displayName: ({ params }) => params.licensePlate,
              },
            },
          ],
        },
      ],
    },
  ],
  scrollBehavior: () => ({
    behavior: 'smooth',
    top: 0,
  }),
});

export default router;
