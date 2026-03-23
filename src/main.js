import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/premium-overrides.css";
import "./styles/pages-layout.css";

import { appState } from "./core/state.js";
import { bindDelegatedEvents, migrateInlineHandlers } from "./core/events.js";
import { wireRouter } from "./core/router.js";
import { initDashboardModule } from "./modules/dashboard.js";
import { initTransactionsModule, setTransactionsFilter } from "./modules/transactions.js";
import { loadAppState, saveAppState } from "./core/storage.js";

function setupPilotModules() {
  const originalShowPage = window.showPage?.bind(window);
  if (!originalShowPage) return;

  window.showPage = (id) => {
    originalShowPage(id);
    if (id === "dashboard") initDashboardModule(appState);
    if (id === "transactions") initTransactionsModule(appState);
  };

  window.filterTx = () => {
    setTransactionsFilter(appState);
    initTransactionsModule(appState);
  };

  initDashboardModule(appState);
  initTransactionsModule(appState);
}

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(appState, loadAppState());
  migrateInlineHandlers();
  bindDelegatedEvents();
  wireRouter();
  setupPilotModules();

  setInterval(() => saveAppState(appState), 30000);
});
