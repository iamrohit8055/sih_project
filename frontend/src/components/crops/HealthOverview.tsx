import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

interface HealthOverviewProps {
  status: "Healthy" | "Needs Attention" | "Critical";
}

function HealthOverview({ status }: HealthOverviewProps) {
  const config = {
    Healthy: {
      icon: CheckCircle2,
      title: "Crop is healthy",
      description:
        "No significant health issues have been reported recently.",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    "Needs Attention": {
      icon: AlertTriangle,
      title: "Monitoring recommended",
      description:
        "Some indicators suggest that this crop requires closer monitoring.",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    Critical: {
      icon: ShieldAlert,
      title: "Immediate attention required",
      description:
        "Potential health risks have been detected. Run a disease scan.",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <div
      className={`rounded-2xl border p-6 ${current.className}`}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          <Icon size={24} />
        </div>

        <div>
          <h2 className="font-semibold">
            {current.title}
          </h2>

          <p className="mt-1 text-sm opacity-80">
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthOverview;