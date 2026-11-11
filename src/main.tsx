import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HumanVerification } from "./components/HumanVerification";
import { consumeAuthRedirect } from "./lib/supabase";

// Finish a Google sign-in redirect as early as possible: the OAuth code is
// single-use and short-lived, and the chat panel is not mounted yet when the
// browser lands back on the site.
consumeAuthRedirect().catch(() => undefined);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HumanVerification><App /></HumanVerification>
  </StrictMode>
);
