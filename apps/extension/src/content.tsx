import { createRoot, type Root } from "react-dom/client";
import { Measurer } from "mesurer";

const ROOT_ID = "mesurer-extension-root";
const STATE_KEY = "__MESURER_EXTENSION_STATE__";

type ExtensionState = {
  root: Root | null;
  mounted: boolean;
};

type ExtensionGlobal = typeof globalThis & {
  [STATE_KEY]?: ExtensionState;
};

const extensionGlobal = globalThis as ExtensionGlobal;

const getState = () => {
  if (!extensionGlobal[STATE_KEY]) {
    extensionGlobal[STATE_KEY] = {
      root: null,
      mounted: false,
    };
  }

  return extensionGlobal[STATE_KEY];
};

const getOrCreateContainer = () => {
  let container = document.getElementById(ROOT_ID);

  if (!container) {
    container = document.createElement("div");
    container.id = ROOT_ID;
    document.body.appendChild(container);
  }

  return container;
};

const mount = () => {
  const state = getState();
  if (state.mounted) return;

  const container = getOrCreateContainer();
  state.root = createRoot(container);
  state.root.render(<Measurer />);
  state.mounted = true;
};

const unmount = () => {
  const state = getState();
  if (!state.mounted || !state.root) return;

  state.root.unmount();
  state.root = null;
  state.mounted = false;

  const container = document.getElementById(ROOT_ID);
  if (container) {
    container.remove();
  }
};

const toggle = () => {
  if (getState().mounted) {
    unmount();
    return;
  }

  mount();
};

toggle();
