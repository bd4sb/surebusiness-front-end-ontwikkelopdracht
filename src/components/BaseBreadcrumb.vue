<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import WidthContainer from '@/components/WidthContainer.vue';

const route = useRoute();

const breadcrumbs = computed(() => (
  route.matched
    .filter(({ meta }) => 'displayName' in meta)
));

const parseDisplayName = (displayName) => (
  typeof displayName === 'function'
    ? displayName(route)
    : displayName
);
</script>

<template>
  <WidthContainer
    class="breadcrumb"
    is="ul"
  >
    <li
      v-for="breadcrumb in breadcrumbs"
      class="breadcrumb-item"
      :key="breadcrumb.path"
    >
      <RouterLink
        class="breadcrumb-item__link"
        :to="breadcrumb"
      >
        {{ parseDisplayName(breadcrumb.meta.displayName) }}
      </RouterLink>
    </li>
  </WidthContainer>
</template>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints';

.breadcrumb {
  display: flex;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  font-size: .875rem;
  list-style: none;

  &-item {
    display: flex;
    max-width: 100%;
    overflow: hidden;
    transition: .4s;

    &:first-child {
      margin-left: -1em;
    }

    &:not(:last-child) {
      &::after {
        content: '';
        flex-shrink: 0;
        height: 100%;
        margin: 0 .5em;
        border-left: 1px solid currentColor;
        rotate: 15deg;
        opacity: .15;
      }
    }

    &:nth-last-child(n + 3) {
      @include mobile-l-and-smaller {
        max-width: 0;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      padding: 0 1.5em;
      margin: 0 -.5em;
      font-weight: 500;
      text-decoration: none;
      color: inherit;
      text-overflow: ellipsis;
      overflow: hidden;
      transition-property: color, opacity;
      transition-duration: .2s;

      .breadcrumb-item:last-child & {
        cursor: default;
      }

      .breadcrumb-item:not(:last-child):not(:hover) & {
        opacity: .3;
      }

      .breadcrumb-item:not(:last-child):hover & {
        color: var(--color-primary);
      }
    }
  }
}
</style>
