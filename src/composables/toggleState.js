// eslint-disable-next-line import/prefer-default-export
export function useToggleState(state, container) {
  function checkClickOutside({ target }) {
    if (
      container.value === target
      || container.value?.contains(target)
    ) {
      return;
    }

    state.value = false;
  }

  function toggleOpen() {
    state.value = !state.value;

    if (state.value) {
      window.addEventListener('click', checkClickOutside);
    } else {
      window.removeEventListener('click', checkClickOutside);
    }
  }

  return {
    toggleOpen,
  };
}
