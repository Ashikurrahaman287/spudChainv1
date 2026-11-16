import { lazy, Suspense, Component, useEffect, type ReactNode, type ErrorInfo } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BackgroundAnimation from "@/components/BackgroundAnimation";

// Lazy-load all pages for code-splitting
const Home = lazy(() => import("@/pages/Home"));
const Explorer = lazy(() => import("@/pages/Explorer"));
const ExplorerTx = lazy(() => import("@/pages/ExplorerTx"));
const ExplorerBlock = lazy(() => import("@/pages/ExplorerBlock"));
const ExplorerAddress = lazy(() => import("@/pages/ExplorerAddress"));
const ExplorerToken = lazy(() => import("@/pages/ExplorerToken"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Full-page loading skeleton
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#020510] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-lg font-black animate-pulse">
          S
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-500/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Error boundary for graceful error handling
interface EBState { hasError: boolean; error: Error | null }
class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[SpudChain] Uncaught error:", error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020510] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-3xl mx-auto mb-6">
              ⚠
            </div>
            <h1 className="text-white text-xl font-bold mb-3">Something went wrong</h1>
            <p className="text-white/40 text-sm mb-6">
              {this.state.error?.message ?? "An unexpected error occurred. Please refresh the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/explorer/tx/:hash" component={ExplorerTx} />
        <Route path="/explorer/block/:number" component={ExplorerBlock} />
        <Route path="/explorer/address/:address" component={ExplorerAddress} />
        <Route path="/explorer/token/:contract" component={ExplorerToken} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-black relative overflow-hidden">
          <BackgroundAnimation />
          <div className="relative z-10">
            <Router />
          </div>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
