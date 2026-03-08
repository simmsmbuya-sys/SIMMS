import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

async function render() {
  const root = createRoot(document.getElementById("root")!);

  // If Convex URL is configured, wrap with providers
  if (convexUrl) {
    const { ConvexReactClient, ConvexProvider } = await import("convex/react");
    const convex = new ConvexReactClient(convexUrl);

    if (clerkPubKey) {
      const { ClerkProvider, useAuth } = await import("@clerk/clerk-react");
      const { ConvexProviderWithClerk } = await import("convex/react-clerk");
      root.render(
        <StrictMode>
          <ClerkProvider publishableKey={clerkPubKey}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
              <App />
            </ConvexProviderWithClerk>
          </ClerkProvider>
        </StrictMode>
      );
    } else {
      root.render(
        <StrictMode>
          <ConvexProvider client={convex}>
            <App />
          </ConvexProvider>
        </StrictMode>
      );
    }
  } else {
    // No Convex — run with demo data only
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

render();
