import "pretendard/dist/web/variable/pretendardvariable.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import "./index.css";

async function enableMocking() {
  const shouldEnableMocking = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true";

  if (!shouldEnableMocking) {
    return;
  }

  const { worker } = await import("@/shared/mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

function renderApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found.");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

async function bootstrap() {
  try {
    await enableMocking();
  } catch (error) {
    console.error("Mock service worker initialization failed.", error);
  }

  renderApp();
}

void bootstrap();
