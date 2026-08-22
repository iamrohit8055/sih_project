import {
  BarChart3,
  Bot,
  Boxes,
  ChartNoAxesCombined,
  CircleHelp,
  Leaf,
  LayoutDashboard,
  Package,
  ScanLine,
  Settings,
  Sprout,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Crops",
    path: "/app/crops",
    icon: Sprout,
  },
  {
    label: "Disease Detection",
    path: "/app/disease-detection",
    icon: ScanLine,
    badge: "AI",
  },
  {
    label: "Produce Management",
    path: "/app/produce",
    icon: Package,
  },
  {
    label: "Decision Engine",
    path: "/app/decision-engine",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Market Intelligence",
    path: "/app/market",
    icon: BarChart3,
  },
  {
    label: "Analytics",
    path: "/app/analytics",
    icon: Boxes,
  },
  {
    label: "AI Assistant",
    path: "/app/assistant",
    icon: Bot,
  },
];

function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-slate-950 text-white md:flex md:flex-col">
      {/* Brand */}
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
            <Leaf size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold">SIH Project</h1>
            <p className="text-xs text-emerald-400">Smart Agriculture</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Navigation
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={18} />

                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 font-semibold">
            RK
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Farmer</p>
            <p className="truncate text-xs text-slate-400">
              Agriculture Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;