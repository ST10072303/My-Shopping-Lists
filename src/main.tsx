import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*make Redux store available throughout the application*/}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);