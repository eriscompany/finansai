import { appState, publish } from "./state.js";

const actionHandlers = {
  doSetup: () => window.doSetup?.(),
  doLogin: () => window.doLogin?.(),
  closeUserPanel: () => window.closeUserPanel?.(),
  addUser: () => window.addUser?.(),
  doChangePass: () => window.doChangePass?.(),
  doLogout: () => window.doLogout?.(),
  toggleTheme: () => window.toggleTheme?.(),
  openUserPanel: () => window.openUserPanel?.(),
  addWatch: () => window.addWatch?.(),
  addBankAcc: () => window.addBankAcc?.(),
  saveMonthly: () => window.saveMonthly?.(),
  saveCreditInfo: () => window.saveCreditInfo?.(),
  searchFund: () => window.searchFund?.(),
  addInv: () => window.addInv?.(),
  refreshCrypto: () => window.refreshCrypto?.(),
  addNewCoin: () => window.addNewCoin?.(),
  saveBill: () => window.saveBill?.(),
  simOCR: () => window.simOCR?.(),
  addInstallment: () => window.addInstallment?.(),
  calcCashflow: () => window.calcCashflow?.(),
  sendMsg: () => window.sendMsg?.(),
  saveTx: () => window.saveTx?.(),
  simCSV: () => window.simCSV?.(),
  saveData: () => window.saveData?.(),
  saveDataAndNotify: () => {
    window.saveData?.();
    window.showNotif?.("Manuel kayıt yapıldı", "💾");
  },
  togglePwd: (el) => {
    const raw = el.dataset.args || "";
    const idMatch = raw.match(/'([^']+)'|"([^"]+)"/);
    const inputId = idMatch ? (idMatch[1] || idMatch[2]) : "";
    if (inputId) window.togglePwd?.(inputId, el);
  }
};

function parseInlineCall(call) {
  const m = call.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
  if (!m) return null;
  const name = m[1];
  const args = m[2].trim();
  return { name, args };
}

function parseArgs(argsText = "") {
  const text = argsText.trim();
  if (!text) return [];
  return text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if ((part.startsWith("'") && part.endsWith("'")) || (part.startsWith('"') && part.endsWith('"'))) {
        return part.slice(1, -1);
      }
      if (part === "true") return true;
      if (part === "false") return false;
      const numeric = Number(part);
      return Number.isNaN(numeric) ? part : numeric;
    });
}

export function migrateInlineHandlers() {
  const nodes = document.querySelectorAll("[onclick]");
  nodes.forEach((el) => {
    const raw = el.getAttribute("onclick")?.trim();
    if (!raw) return;
    const parsed = parseInlineCall(raw);
    if (!parsed) return;
    el.dataset.action = parsed.name;
    if (parsed.args) el.dataset.args = parsed.args;
    el.removeAttribute("onclick");
  });
}

export function bindDelegatedEvents() {
  document.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    if (action === "setLang") {
      const langArg = actionEl.dataset.args?.replace(/['"]/g, "");
      if (langArg) window.setLang?.(langArg);
      appState.preferences.language = langArg || appState.preferences.language;
      publish();
      return;
    }

    if (action === "setTheme") {
      const themeArg = actionEl.dataset.args?.replace(/['"]/g, "");
      if (themeArg) {
        document.documentElement.setAttribute("data-theme", themeArg === "light" ? "light" : "");
        appState.preferences.theme = themeArg;
      }
      publish();
      return;
    }

    if (action === "showPage") {
      const pageArg = actionEl.dataset.args?.replace(/['"]/g, "");
      if (pageArg) window.showPage?.(pageArg);
      return;
    }

    const handler = actionHandlers[action];
    if (handler) {
      handler(actionEl);
      return;
    }

    const fn = window[action];
    if (typeof fn === "function") {
      const args = parseArgs(actionEl.dataset.args || "");
      fn(...args);
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target.closest("[data-change-action]");
    if (!target) return;
    const action = target.dataset.changeAction;
    const fn = window[action];
    if (typeof fn === "function") fn();
  });

  document.addEventListener("input", (event) => {
    const target = event.target.closest("[data-input-action]");
    if (!target) return;
    const action = target.dataset.inputAction;
    const fn = window[action];
    if (typeof fn === "function") fn();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const target = event.target.closest("[data-enter-action]");
    if (!target) return;
    const action = target.dataset.enterAction;
    const fn = window[action];
    if (typeof fn === "function") fn();
  });
}
