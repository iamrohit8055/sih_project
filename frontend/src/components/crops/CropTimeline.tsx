import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  ScanLine,
  Sprout,
} from "lucide-react";

const activities = [
  {
    title: "Crop added",
    description: "Crop was added to your farm.",
    date: "12 Nov 2025",
    icon: Sprout,
  },
  {
    title: "Sowing completed",
    description: "Sowing activity was recorded.",
    date: "13 Nov 2025",
    icon: CalendarDays,
  },
  {
    title: "Irrigation completed",
    description: "Scheduled irrigation was completed.",
    date: "15 Nov 2025",
    icon: Droplets,
  },
  {
    title: "Health check",
    description: "Latest crop health check completed.",
    date: "18 Nov 2025",
    icon: ScanLine,
  },
];

function CropTimeline() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-semibold text-slate-900">
          Crop Activity
        </h2>

        <p className="text-sm text-slate-500">
          Recent events and activities for this crop.
        </p>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div
              key={`${activity.title}-${activity.date}`}
              className="relative flex gap-4"
            >
              {!isLast && (
                <div className="absolute left-5 top-10 h-10 w-px bg-slate-200" />
              )}

              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-slate-400">
                    {activity.date}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
        <CheckCircle2 size={16} />
        Your crop activity is being tracked.
      </div>
    </div>
  );
}

export default CropTimeline;