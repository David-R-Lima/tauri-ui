import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactQueryProvider } from "./components/providers/react-query-provider";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { InitLastHeard } from "./components/init-last-heard-song";
import { Socket } from "./components/providers/socket-provider";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App/>
        <Toaster />
        <InitLastHeard />
        <Socket></Socket>
      </ThemeProvider>
    </ReactQueryProvider>
  </React.StrictMode>,
);
