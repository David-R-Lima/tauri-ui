import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactQueryProvider } from "./components/providers/react-query-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </React.StrictMode>,
);
