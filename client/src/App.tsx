import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AboutPage from "@/pages/About";
import AdminPage from "@/pages/Admin";
import BlogPage, { BlogArticlePage } from "@/pages/Blog";
import ContactPage from "@/pages/Contact";
import FinancePage from "@/pages/Finance";
import Home from "@/pages/Home";
import { InventoryPage, VehicleDetailPage } from "@/pages/Inventory";
import NotFound from "@/pages/NotFound";
import ServicesPage, { GuaranteesPage } from "@/pages/Services";
import TradeInPage from "@/pages/TradeIn";
import { useLocation, Route, Switch } from "wouter";
import { useLayoutEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { SiteShell } from "./components/site/SiteShell";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./lib/i18n";

function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vehicules/:slug" component={VehicleDetailPage} />
      <Route path="/vehicules" component={InventoryPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/financement" component={FinancePage} />
      <Route path="/reprise" component={TradeInPage} />
      <Route path="/garanties" component={GuaranteesPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/a-propos" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/:section" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location === "/admin" || location.startsWith("/admin/");

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { html.style.scrollBehavior = previousBehavior; });
  }, [location]);

  if (isAdminRoute) return <AdminRoutes />;
  return (
    <SiteShell>
      <PublicRoutes />
    </SiteShell>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;
