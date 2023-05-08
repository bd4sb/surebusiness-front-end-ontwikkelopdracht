<script setup>
import {
  computed,
  reactive,
  useSlots,
  watch,
} from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import ConditionalComponent from '@/components/ConditionalComponent.vue';
import IconSentimentVeryDissatisfied from '@/components/IconSentimentVeryDissatisfied.vue';

const props = defineProps({
  emptyButton: {
    type: String,
    default: '',
  },
  emptyMessage: {
    type: String,
    default: '',
  },
  headers: {
    type: Array,
    default: () => [],
  },
  rowClicked: {
    type: Function,
    default: undefined,
  },
  rows: {
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  rowVisibility: [],
  rowVisibilityInterval: null,
});

const emit = defineEmits([
  'emptyAction',
]);

const slots = useSlots();
const hasEmptyButton = computed(() => props.emptyButton.length);
const hasEmptyMessage = computed(() => props.emptyMessage.length);
const hasHeader = computed(() => props.headers.length);
const hasFooter = () => slots.footer;
const parseColumn = (column) => column || '-';

function clearRowVisibilityInterval() {
  clearInterval(state.rowVisibilityInterval);
}

function updateRowVisibility() {
  clearRowVisibilityInterval();

  state.rowVisibility = new Array(props.rows.length).fill(false);
  let i = 0;

  state.rowVisibilityInterval = setInterval(() => {
    state.rowVisibility[i] = true;
    i += 1;

    if (i >= state.rowVisibility.length) {
      clearRowVisibilityInterval();
    }
  }, Math.min(25, 1000 / props.rows.length));
}

watch(
  () => props.rows,
  updateRowVisibility,
  {
    immediate: true,
  },
);
</script>

<template>
  <ConditionalComponent
    class="table-scroller"
    :condition="!hasFooter() && !hasHeader"
    is="div"
  >
    <table
      :class="[
        'table',
        { 'table--has-footer': hasFooter() },
        { 'table--has-header': hasHeader },
      ]"
    >
      <thead
        v-if="hasHeader"
        class="table__header"
      >
        <tr>
          <th
            v-for="heading in props.headers"
            class="table__cell"
            :key="heading"
          >
            {{ heading }}
          </th>
        </tr>
      </thead>

      <tbody class="table__body">
        <template v-if="props.rows.length">
          <tr
            v-for="(row, i) in props.rows"
            :class="[
              'table__row',
              { 'table__row--has-click-event': props.rowClicked },
              { 'table__row--invisible': state.rowVisibility.length && !state.rowVisibility[i] },
            ]"
            :key="row"
            @click="props.rowClicked && props.rowClicked(row)"
          >
            <td
              v-for="(column, _, i) in row"
              :class="[
                'table__cell',
                { 'table__cell--has-header': hasHeader },
              ]"
              :data-heading="props.headers[i]"
              :key="column"
            >
              <span
                v-html="parseColumn(column)"
                class="table__value"
              />
            </td>
          </tr>
        </template>

        <tr
          v-else-if="(
            hasEmptyButton
            || hasEmptyMessage
          )"
        >
          <td
            class="table-notification table__cell"
            colspan="100%"
          >
            <IconSentimentVeryDissatisfied class="table-notification__icon" />

            <p
              v-if="hasEmptyMessage"
              class="table-notification__text"
            >
              {{ props.emptyMessage }}
            </p>

            <BaseButton
              v-if="hasEmptyButton"
              class="table-notification__button"
              @click="emit('emptyAction')"
            >
              {{ emptyButton }}
            </BaseButton>
          </td>
        </tr>
      </tbody>

      <tfoot
        v-if="hasFooter()"
        class="table__footer"
      >
        <tr>
          <td
            class="table__cell"
            colspan="100%"
          >
            <slot name="footer" />
          </td>
        </tr>
      </tfoot>
    </table>
  </ConditionalComponent>
</template>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints';

.table-scroller {
  --spacing: var(--spacing-s);
  padding: var(--shadow-m-size-bottom) var(--spacing);
  margin: calc(var(--shadow-m-size-bottom) * -1) calc(var(--spacing) * -1);
  overflow-x: auto;

  @include mobile-m-and-larger {
    --spacing: var(--spacing-m);
  }
}

.table {
  --spacing: 1em;
  width: 100%;
  padding: 0 var(--spacing);
  border-spacing: 0;
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-m);
  background: #fff;

  @include tablet-and-larger {
    --spacing: 1.5em;
  }

  &__header {
    @include mobile-l-and-smaller {
      display: none;
    }

    @include tablet-and-larger {
      position: sticky;
      top: var(--header-height);
      z-index: 1;
      background-color: inherit;
    }
  }

  &__footer {
    position: sticky;
    bottom: 0;
    background-color: inherit;
  }

  &__row {
    .table__body & {
      transition-property: opacity, translate;
      transition-duration: .2s;

      &--has-click-event {
        cursor: pointer;
        transition-property: color, opacity, translate;

        &:hover {
          translate: .2em;
          color: var(--color-primary);
        }
      }

      &--invisible {
        opacity: 0;
        translate: var(--spacing-s);
      }

      .table--has-header & {
        @include mobile-l-and-smaller {
          display: table;
          width: 100%;
        }
      }
    }
  }

  @mixin table-cell {
    display: table-cell;
    border: 0 solid rgb(0 0 0 / .1);

    .table__footer & {
      padding: 1em 0;
      border-top-width: 1px;
    }
  }

  @mixin table-cell-overflow {
    max-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @mixin table-cell-horizontal {
    padding: .9em 0;
    text-align: start;

    &:not(:first-child) {
      padding-left: calc(var(--spacing) / 2);
    }

    &:not(:last-child) {
      padding-right: calc(var(--spacing) / 2);
    }

    .table__header &,
    .table__row:not(:last-child) & {
      border-bottom-width: 1px;
    }
  }

  @mixin table-cell-vertical {
    padding: 0;

    &:not(.table-notification) {
      .table__body & {
        display: table-row;
      }

      &::before {
        .table__body & {
          @include table-cell;
          @include table-cell-overflow;
          content: attr(data-heading);
          padding: .5em .5em .5em 0;
        }
      }
    }

    &:first-child::before {
      padding-top: 1em;
    }

    &:last-child::before {
      .table__row:not(:last-child) & {
        padding-bottom: 1em;
        border: inherit;
        border-bottom-width: 1px;
      }
    }
  }

  &__cell {
    @include table-cell;

    @include tablet-and-larger {
      @include table-cell-horizontal;
    }

    &:not(&--has-header) {
      @include mobile-l-and-smaller {
        @include table-cell-horizontal;
      }
    }

    &--has-header {
      @include mobile-l-and-smaller {
        @include table-cell-vertical;
      }
    }

    .table--has-header &,
    .table--has-footer & {
      @include mobile-l-and-smaller {
        @include table-cell-overflow;
      }
    }

    .table-scroller & {
      &:first-child:nth-last-child(2) {
        @include tablet-and-larger {
          white-space: nowrap;
        }
      }

      &:last-child:nth-child(2) {
        @include tablet-and-larger {
          width: 100%;
        }
      }
    }
  }

  &__value {
    .table--has-header & {
      @include mobile-l-and-smaller {
        @include table-cell;
        @include table-cell-overflow;
        padding: .5em 0 .5em .5em;
      }
    }

    .table__cell:first-child & {
      .table--has-header & {
        @include mobile-l-and-smaller {
          padding-top: 1em;
        }
      }
    }

    .table__cell:last-child & {
      .table__row:not(:last-child) & {
        .table--has-header & {
          @include mobile-l-and-smaller {
            padding-bottom: 1em;
            border: inherit;
            border-bottom-width: 1px;
          }
        }
      }
    }
  }

  &-notification {
    padding: var(--spacing-l) 0;
    text-align: center;

    &__icon {
      height: 10em;
      fill: var(--color-primary);
      opacity: .2;
    }

    &__text {
      max-width: 75ch;
      margin: 0 auto var(--spacing-s);
    }

    &__button {
      margin-top: var(--spacing-s);
    }
  }
}
</style>
