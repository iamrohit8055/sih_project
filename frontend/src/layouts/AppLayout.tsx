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
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setSidebarCollapsed(!event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main application */}
      <div
        className={`
          min-h-screen
          transition-[margin-left]
          duration-300
          ease-in-out
          ${sidebarCollapsed ? "ml-18" : "ml-64"}
        `}
      >
        <TopNavbar />

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;