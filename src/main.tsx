import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Support both standalone React app and WordPress plugin
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root") || document.getElementById("readers-haven-app");
  
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
});
