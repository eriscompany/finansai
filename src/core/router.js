import { initDashboardModule } from "../modules/dashboard.js";
import { initTransactionsModule } from "../modules/transactions.js";
import { appState } from "./state.js";

export function wireRouter() {
  document.addEventListener("click", (event) => {
    const navItem = event.target.closest("[data-page]");
    if (!navItem) return;

    const page = navItem.getAttribute("data-page");
    if (page === "dashboard") initDashboardModule(appState);
    if (page === "transactions") initTransactionsModule(appState);
  });
}
