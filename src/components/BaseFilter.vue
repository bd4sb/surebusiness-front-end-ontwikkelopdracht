<script setup>
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { useRouteFilter, useStorageFilter } from '@/composables/filters';
import { useToggleState } from '@/composables/toggleState';
import IconExpandMore from '@/components/IconExpandMore.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
  },
  purpose: {
    type: String,
    default: '',
  },
});

const state = reactive({
  open: false,
});

const { modelValue, name, purpose } = toRefs(props);
const { open } = toRefs(state);
const root = ref(null);

const emit = defineEmits([
  'savedFilterLoaded',
  'update:modelValue',
]);

const value = computed({
  get() {
    return modelValue.value;
  },
  set(newValue) {
    emit('update:modelValue', newValue.sort());
  },
});

const {
  hasSavedValues,
  savedValues: savedRouteValues,
  savedValuesLoaded,
} = useRouteFilter(name, modelValue);

const {
  savedValues: savedStorageValues,
} = useStorageFilter(name, modelValue, purpose, !hasSavedValues.value);

const { toggleOpen } = useToggleState(open, root);

watch(
  [
    savedRouteValues,
    savedStorageValues,
  ],
  (newValues) => {
    value.value = [].concat(...newValues);
  },
);

watch(
  savedValuesLoaded,
  () => emit('savedFilterLoaded'),
);
</script>

<template>
  <fieldset
    :class="[
      'filter',
      { 'filter--open': state.open },
    ]"
    ref="root"
  >
    <button
      class="filter-button"
      type="button"
      @click="toggleOpen"
    >
      <span class="filter-button__text">
        {{ name }}

        <template v-if="value.length">
          ({{ value.length }})
        </template>
      </span>

      <IconExpandMore class="filter-button__icon" />
    </button>

    <div class="filter-options">
      <div class="filter-options__collapse">
        <div
          v-for="option in props.options"
          class="filter-option"
          :key="`${name}_${option}`"
        >
          <input
            v-model="value"
            class="filter-option__input"
            :id="`${name}_${option}`"
            :name="name"
            type="checkbox"
            :value="option"
          />

          <label
            class="filter-option__label"
            :for="`${name}_${option}`"
          >
            {{ option }}
          </label>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints';

.filter {
  padding: 0;
  margin: 0;
  border: none;
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-m);
  background-color: #fff;
  transition-property: border-radius;
  transition-duration: .2s;

  @include mobile-l-and-smaller {
    width: 100%;
  }

  &--open {
    @include tablet-and-larger {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--spacing-s);
    border: none;
    outline: none;
    font-size: 1rem;
    color: var(--color-primary);
    background: none;
    cursor: pointer;
    transition-duration: inherit;

    &__text {
      font-size: .875rem;
      font-weight: 700;
      transition-property: translate;
      transition-duration: inherit;

      .filter-button:hover & {
        translate: .3ch;
      }
    }

    &__icon {
      height: 1.5em;
      margin-left: var(--spacing-s);
      fill: currentColor;
      transition-property: scale, translate;
      transition-duration: inherit;

      .filter-button:hover & {
        translate: -.3ch;
      }

      .filter--open & {
        scale: 1 -1;
      }
    }
  }

  &-options {
    display: grid;
    grid-template-rows: 0fr;
    transition-property: grid-template-rows;
    transition-duration: inherit;

    @include tablet-and-larger {
      position: absolute;
      z-index: 2;
      border-radius: 0 0 var(--border-radius-m) var(--border-radius-m);
      box-shadow: var(--shadow-m);
      background-color: inherit;
    }

    .filter--open & {
      grid-template-rows: 1fr;
    }

    &__collapse {
      max-height: calc(6.5 * 1.8em);
      overflow: auto;
    }
  }

  &-option {
    display: flex;
    padding: 0 var(--spacing-s);

    &__input {
      margin: 0 1ch 0 0;
      accent-color: var(--color-primary);
    }

    &__label {
      flex-grow: 1;
      padding: .4em 0;
      line-height: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
