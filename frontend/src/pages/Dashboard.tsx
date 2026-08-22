import {
  ArrowUpRight,
  IndianRupee,
  Leaf,
  Package,
  Sprout,
  Wheat,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

const stats = [
  {
    label: "Total Farms",
    value: "3",
    icon: Leaf,
  },
  {
    label: "Active Crops",
    value: "4",
    icon: Sprout,
  },
  {
    label: "Expected Harvest",
    value: "8,500 kg",
    icon: Wheat,
  },
  {
    label: "Total Expenses",
    value: "₹79,000",
    icon: IndianRupee,
  },
  {
    label: "Estimated Profit",
    value: "₹1,67,000",
    icon: ArrowUpRight,
  },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Farmer!"
        description="Here's an overview of your farms and current agricultural activity."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Icon size={18} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Current Crop Health
              </h2>
              <p className="text-sm text-slate-500">
                Overview of active crops
              </p>
            </div>

            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {[
              ["Wheat", "Green Acre Farm", "Healthy"],
              ["Tomatoes", "Sunrise Plot", "Needs Attention"],
              ["Potatoes", "Riverbed Field", "Healthy"],
              ["Basmati Rice", "Green Acre Farm", "Healthy"],
            ].map(([crop, farm, status]) => (
              <div
                key={crop}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{crop}</p>
                  <p className="text-sm text-slate-500">{farm}</p>
                </div>

                <span
                  className={
                    status === "Healthy"
                      ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                  }
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-emerald-400">
            Smart Recommendation
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Check your tomato harvest
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your tomato batch may have elevated spoilage risk.
            Run the decision engine to compare selling, storage,
            and processing options.
          </p>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
            <Package size={18} />
            Open Decision Engine
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;