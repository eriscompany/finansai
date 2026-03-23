const typeElId = "f-type";
const categoryElId = "f-cat";
const queryElId = "f-q";

export function setTransactionsFilter(state) {
  const typeEl = document.getElementById(typeElId);
  const categoryEl = document.getElementById(categoryElId);
  const queryEl = document.getElementById(queryElId);
  if (!typeEl || !categoryEl || !queryEl) return;

  state.filters.transactions.type = typeEl.value;
  state.filters.transactions.category = categoryEl.value;
  state.filters.transactions.query = queryEl.value;
}

export function initTransactionsModule(state) {
  const typeEl = document.getElementById(typeElId);
  const categoryEl = document.getElementById(categoryElId);
  const queryEl = document.getElementById(queryElId);
  if (!typeEl || !categoryEl || !queryEl) return;

  const current = state.filters.transactions;
  if (typeEl.value !== current.type) typeEl.value = current.type;
  if (categoryEl.value !== current.category) categoryEl.value = current.category;
  if (queryEl.value !== current.query) queryEl.value = current.query;

  window.renderFilteredTx?.();
}
