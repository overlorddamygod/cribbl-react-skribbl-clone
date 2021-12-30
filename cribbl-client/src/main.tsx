import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// Performance tracking
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";

Sentry.init({
  dsn: "https://60a9c521f13c419a94244cbe28e72f3c@o1072282.ingest.sentry.io/6070833",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
