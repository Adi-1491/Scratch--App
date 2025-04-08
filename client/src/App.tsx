import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Scratchpad from "@/pages/Scratchpad";
import { BlocksProvider } from "./contexts/BlocksContext";
import { SpritesProvider } from "./contexts/SpritesContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Scratchpad} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlocksProvider>
        <SpritesProvider>
          <Router />
          <Toaster />
        </SpritesProvider>
      </BlocksProvider>
    </QueryClientProvider>
  );
}

export default App;
