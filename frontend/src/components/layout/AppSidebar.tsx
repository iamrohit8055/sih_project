import {
  BarChart3,
  Bot,
  Boxes,
  ChartNoAxesCombined,
  Leaf,
  LayoutDashboard,
  Map,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
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
    label: "Map & Logistics",
    path: "/app/logistics",
    icon: Map,
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

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function AppSidebar({
  collapsed,
  onToggle,
}: AppSidebarProps) {
  return (
    <aside
      className={`
    fixed left-0 top-0 z-40 z-40 flex h-screen shrink-0
    border-r border-slate-800
    bg-slate-950 text-white
    transition-[width] duration-300 ease-in-out
    flex-col
    ${collapsed ? "w-18" : "w-64"}
  `}
    >
      {/* ================================================== */}
      {/* BRAND / SIDEBAR TOGGLE                            */}
      {/* ================================================== */}

      <div className="relative h-18.25 shrink-0 border-b border-slate-800 px-4">
        {/* ================= EXPANDED ================= */}

        <div
          className={`
            absolute inset-0 flex items-center px-4
            transition-opacity duration-200
            ${collapsed
              ? "pointer-events-none opacity-0"
              : "opacity-100"
            }
          `}
        >
          {/* Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600">
            <Leaf size={22} strokeWidth={2} />
          </div>

          {/* Brand */}
          <div className="ml-3 min-w-0">
            <h1 className="whitespace-nowrap text-3xl font-bold">
              Sasyam
            </h1>

            <p className="whitespace-nowrap text-xs text-emerald-400">
              Smart Agriculture
            </p>
          </div>

          {/* Close button */}
          <div className="group absolute right-3 top-4">
            <button
              onClick={onToggle}
              aria-label="Close sidebar"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl border border-slate-800
                bg-slate-900 text-slate-400
                shadow-sm
                transition-all duration-200
                hover:border-slate-700
                hover:bg-slate-800
                hover:text-white
                active:scale-95
              "
            >
              <PanelLeftClose
                size={19}
                strokeWidth={2}
                className="
                  transition-transform duration-200
                  group-hover:scale-110
                "
              />
            </button>

            {/* Tooltip */}
            <div
              className="
                pointer-events-none absolute
                right-full top-1/2 z-100
                mr-3 -translate-y-1/2
                whitespace-nowrap
                rounded-lg bg-white
                px-3 py-2
                text-xs font-medium text-slate-800
                shadow-xl
                opacity-0
                transition-opacity duration-150
                group-hover:opacity-100
              "
            >
              Close sidebar
            </div>
          </div>
        </div>

        {/* ================= COLLAPSED ================= */}

        {/* ================= COLLAPSED ================= */}

        <div
          className={`
    absolute inset-0 flex items-center justify-center
    transition-opacity duration-200
    ${collapsed
              ? "opacity-100"
              : "pointer-events-none opacity-0"
            }
  `}
        >
          <div className="group relative">
            <button
              onClick={onToggle}
              aria-label="Open sidebar"
              className="
        relative flex h-10 w-10
        items-center justify-center
        rounded-xl
        bg-emerald-500
        text-white
        shadow-sm
        transition-all duration-200
        hover:bg-emerald-500
        active:scale-95
      "
            >
              {/* Logo */}
              <Leaf
                size={22}
                strokeWidth={2}
                className="
          absolute
          scale-100 opacity-100
          transition-all duration-200
          ease-out
          group-hover:scale-75
          group-hover:opacity-0
        "
              />

              {/* Toggle icon */}
              <PanelLeftOpen
                size={19}
                strokeWidth={2}
                className="
          absolute
          scale-75 opacity-0
          transition-all duration-200
          ease-out
          group-hover:scale-100
          group-hover:opacity-100
        "
              />
            </button>

            {/* Tooltip */}
            <div
              className="
        pointer-events-none absolute
        left-full top-1/2 z-100
        ml-3 -translate-y-1/2
        whitespace-nowrap
        rounded-lg bg-white
        px-3 py-2
        text-xs font-medium text-slate-800
        shadow-xl
        opacity-0
        transition-opacity duration-150
        group-hover:opacity-100
      "
            >
              Open sidebar
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* NAVIGATION                                        */}
      {/* ================================================== */}

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-8 pb-4">
        {/* Navigation heading */}

        <div
          className={`
            mb-3 overflow-hidden
            transition-[max-height,opacity]
            duration-300 ease-in-out
            ${collapsed
              ? "max-h-0 opacity-0"
              : "max-h-6 opacity-100"
            }
          `}
        >
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Navigation
          </p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  [
                    "group flex h-11 items-center rounded-xl",
                    "px-3 text-sm font-medium",
                    "transition-[background-color,color,box-shadow] duration-200",

                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white hover:shadow-sm",
                  ].join(" ")
                }
              >
                {/* ICON */}
                <span
                  className={`
      flex h-6 w-6 shrink-0
      items-center justify-center
      ${collapsed ? "mx-auto" : ""}
    `}
                >
                  <Icon
                    size={19}
                    strokeWidth={2}
                    className={`
        shrink-0
        transition-transform duration-200
        group-hover:scale-105
        ${item.label === "Produce Management"
                        ? "-translate-y-px"
                        : ""
                      }
      `}
                  />
                </span>

                {/* LABEL */}
                <span
                  className={`
      min-w-0 overflow-hidden whitespace-nowrap
      transition-[max-width,opacity,margin]
      duration-300 ease-in-out
      ${collapsed
                      ? "ml-0 max-w-0 opacity-0"
                      : "ml-3 max-w-45 opacity-100"
                    }
    `}
                >
                  {item.label}
                </span>

                {/* BADGE */}
                {item.badge && (
                  <span
                    className={`
        ml-auto shrink-0
        rounded-md bg-emerald-500
        px-1.5 py-0.5
        text-[10px] font-bold text-slate-950
        transition-[transform,opacity]
        duration-300 ease-in-out
        ${collapsed
                        ? "scale-0 opacity-0"
                        : "scale-100 opacity-100"
                      }
      `}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ================================================== */}
      {/* USER                                               */}
      {/* ================================================== */}

      <div className="shrink-0 border-t border-slate-800 p-4">
        <div
          className={`
            flex h-15 items-center rounded-xl
            bg-slate-900 p-3
            transition-[gap]
            duration-300 ease-in-out
            ${collapsed
              ? "justify-center"
              : "gap-3"
            }
          `}
        >
          {/* Avatar */}

          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-full
              bg-emerald-600
              font-semibold
            "
          >
            RK
          </div>

          {/* User information */}

          <div
            className={`
              min-w-0 overflow-hidden
              whitespace-nowrap
              transition-[max-width,opacity]
              duration-300 ease-in-out
              ${collapsed
                ? "max-w-0 opacity-0"
                : "max-w-40 opacity-100"
              }
            `}
          >
            <p className="truncate text-sm font-semibold">
              Farmer
            </p>

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