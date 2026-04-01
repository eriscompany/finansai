import { appState } from "./core/state.js";
import { bindDelegatedEvents, migrateInlineHandlers } from "./core/events.js";
import { wireRouter } from "./core/router.js";
import { initDashboardModule } from "./modules/dashboard.js";
import { initTransactionsModule, setTransactionsFilter } from "./modules/transactions.js";
import { loadAppState, saveAppState } from "./core/storage.js";
import { onError } from "./core/errors.js";

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

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "");
}

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(appState, loadAppState());

  // Kayıtlı tema tercihini uygula
  applyTheme(appState.preferences.theme ?? "dark");

  // Servis hatalarını kullanıcıya bildirim olarak göster
  onError(({ message, severity }) => {
    if (severity === "error" || severity === "warning") {
      window.showNotif?.(message, severity === "error" ? "⚠" : "ℹ");
    }
  });

  migrateInlineHandlers();
  bindDelegatedEvents();
  wireRouter();
  setupPilotModules();

  setInterval(() => saveAppState(appState), 30000);
});
