import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";
import CyberBackground from "../ui/CyberBackground";
import { navItems } from "../../data/mockData";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function SocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <CyberBackground />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          items={navItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 md:ml-72">
          <TopNavbar
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenAlerts={() => navigate("/alerts")}
            onOpenThreatIntel={() => navigate("/intel")}
            onOpenSettings={() => navigate("/settings")}
            onToggleTheme={toggleTheme}
            theme={theme}
            userEmail={user?.email || "analyst@soc.local"}
            onLogout={() => {
              logout();
              navigate("/login");
            }}
          />
          <section className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
