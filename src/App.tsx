import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import FournisseurDashboard from "./pages/fournisseur/Dashboard";
import FournisseurSinistres from "./pages/fournisseur/Sinistres";
import SinistreNouveau from "./pages/fournisseur/SinistreNouveau";
import SinistreDetail from "./pages/fournisseur/SinistreDetail";
import FournisseurContrats from "./pages/fournisseur/Contrats";
import FournisseurDocuments from "./pages/fournisseur/Documents";
import FournisseurProfil from "./pages/fournisseur/Profil";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminSouscriptions from "./pages/admin/Souscriptions";
import AdminSouscriptionDetail from "./pages/admin/SouscriptionDetail";
import AdminSinistres from "./pages/admin/Sinistres";
import AdminSinistreDetail from "./pages/admin/SinistreDetail";
import ReglesTarifaires from "./pages/admin/ReglesTarifaires";
import Rapports from "./pages/admin/Rapports";
import Notifications from "./pages/admin/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/fournisseur/dashboard" element={<FournisseurDashboard />} />
          <Route path="/fournisseur/sinistres" element={<FournisseurSinistres />} />
          <Route path="/fournisseur/sinistres/nouveau" element={<SinistreNouveau />} />
          <Route path="/fournisseur/sinistres/:id" element={<SinistreDetail />} />
          <Route path="/fournisseur/contrats" element={<FournisseurContrats />} />
          <Route path="/fournisseur/documents" element={<FournisseurDocuments />} />
          <Route path="/fournisseur/profil" element={<FournisseurProfil />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/souscriptions" element={<AdminSouscriptions />} />
          <Route path="/admin/souscriptions/:id" element={<AdminSouscriptionDetail />} />
          <Route path="/admin/sinistres" element={<AdminSinistres />} />
          <Route path="/admin/sinistres/:id" element={<AdminSinistreDetail />} />
          <Route path="/admin/regles-tarifaires" element={<ReglesTarifaires />} />
          <Route path="/admin/rapports" element={<Rapports />} />
          <Route path="/admin/notifications" element={<Notifications />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
