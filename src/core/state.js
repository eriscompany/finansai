export const appState = {
  version: 1,
  preferences: {
    theme: "dark",
    language: "tr"
  },
  filters: {
    transactions: {
      type: "all",
      category: "all",
      query: ""
    }
  }
};

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publish() {
  for (const listener of listeners) listener(appState);
}
