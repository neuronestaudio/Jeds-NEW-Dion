import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Newcastle from "./pages/area/Newcastle";
import CentralCoast from "./pages/area/CentralCoast";
import BlueMountains from "./pages/area/BlueMountains";
import Wollongong from "./pages/area/Wollongong";
import Canberra from "./pages/area/Canberra";
import SplitSystem from "./pages/service/SplitSystem";
import Ducted from "./pages/service/Ducted";
import Repair from "./pages/service/Repair";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <main id="main-content" role="main" tabIndex={-1} className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/service-area/newcastle" element={<Newcastle />} />
            <Route path="/service-area/central-coast" element={<CentralCoast />} />
            <Route path="/service-area/blue-mountains" element={<BlueMountains />} />
            <Route path="/service-area/wollongong" element={<Wollongong />} />
            <Route path="/service-area/canberra" element={<Canberra />} />
            <Route path="/service/split-system-installation" element={<SplitSystem />} />
            <Route path="/service/ducted-air-conditioning" element={<Ducted />} />
            <Route path="/service/aircon-repair" element={<Repair />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
