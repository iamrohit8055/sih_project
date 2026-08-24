import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/layout/AppSidebar";
import TopNavbar from "@/components/layout/TopNavbar";

function getInitialSidebarState() {
  // lg and above → expanded
  // below lg → collapsed
  return !window.matchMedia("(min-width: 1024px)").matches;
}

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    getInitialSidebarState,
  );

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1024px)",
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setSidebarCollapsed(!event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main application */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;