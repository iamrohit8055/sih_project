import {
  CheckCircle2,
  Clock3,
  Snowflake,
  Star,
  Truck,
} from "lucide-react";

import type { Transporter } from "@/types/logistics";

interface TransporterRowProps {
  transporter: Transporter;
  rank: number;
  selected: boolean;
  onSelect: (transporter: Transporter) => void;
}

function TransporterRow({
  transporter,
  rank,
  selected,
  onSelect,
}: TransporterRowProps) {
  const isAvailable =
    transporter.availability === "AVAILABLE";

  return (
    <button
      type="button"
      onClick={() => onSelect(transporter)}
      className={[
        "cursor-pointer",
        "transition-all duration-200",
        "hover:bg-slate-50",
        "hover:shadow-[inset_3px_0_0_#007a55]",
        "w-full text-left",
        "border-b border-slate-100 last:border-b-0",
        "transition-colors duration-150",
        selected
          ? "bg-green-100 shadow-[inset_3px_0_0_#117316]"
          : "hover:bg-slate-50 hover:shadow-[inset_3px_0_0_#52a857]",
      ].join(" ")}
    >
      <div className="grid grid-cols-[40px_minmax(180px,1.5fr)_110px_90px_100px] items-center gap-4 px-5 py-4">
        {/* RANK */}
        <div className="text-center">
          {rank <= 3 ? (
            <span className="text-lg">
              {rank === 1
                ? "🥇"
                : rank === 2
                  ? "🥈"
                  : "🥉"}
            </span>
          ) : (
            <span className="text-sm font-semibold text-slate-500">
              {rank}
            </span>
          )}
        </div>

        {/* TRANSPORTER */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Truck size={19} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {transporter.name}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Star
                  size={12}
                  className="fill-current text-amber-500"
                />

                {transporter.rating.toFixed(1)}
              </span>

              <span className="text-slate-300">•</span>

              <span className="text-xs text-slate-500">
                {transporter.totalBookings} bookings
              </span>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <span
            className={[
              "inline-flex items-center gap-1.5",
              "rounded-full px-2.5 py-1",
              "text-xs font-medium",
              isAvailable
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {isAvailable ? (
              <CheckCircle2 size={12} />
            ) : (
              <Clock3 size={12} />
            )}

            {isAvailable ? "Available" : "Busy"}
          </span>
        </div>

        {/* RATING */}
        <div>
          <p className="text-sm font-semibold text-slate-800">
            ⭐ {transporter.rating.toFixed(1)}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Rating
          </p>
        </div>

        {/* BOOKINGS */}
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">
            {transporter.totalBookings}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Total bookings
          </p>
        </div>
      </div>

      {/* MOBILE-FRIENDLY SECONDARY INFO */}
      <div className="flex flex-wrap gap-3 px-5 pb-4 pl-20 text-xs text-slate-500 md:hidden">
        <span>
          Capacity:{" "}
          {transporter.vehicle.capacityKg.toLocaleString()} kg
        </span>

        <span>
          ₹{transporter.vehicle.pricePerKm}/km
        </span>

        {transporter.vehicle.refrigerated && (
          <span className="flex items-center gap-1 text-sky-600">
            <Snowflake size={12} />
            Refrigerated
          </span>
        )}
      </div>
    </button>
  );
}

export default TransporterRow;