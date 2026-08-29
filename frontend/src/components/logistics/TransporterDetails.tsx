import {
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Snowflake,
  Star,
  Truck,
  X,
} from "lucide-react";

import type {
  Coordinates,
  Transporter,
} from "@/types/logistics";

import {
  calculateDistanceKm,
  estimateTransportCost,
} from "@/services/logisticsCalculator";

interface TransporterDetailsProps {
  transporter: Transporter | null;
  pickupLocation: Coordinates;
  onClose: () => void;
}

function TransporterDetails({
  transporter,
  pickupLocation,
  onClose,
}: TransporterDetailsProps) {
  if (!transporter) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <Truck size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Select a transporter
          </p>

          <p className="mt-1 max-w-60 text-xs leading-5 text-slate-500">
            Click a transporter from the list to see
            capacity, pricing, availability and other
            details.
          </p>
        </div>
      </div>
    );
  }

  const distanceKm = calculateDistanceKm(
    pickupLocation,
    transporter.location
  );

  const estimatedCost = estimateTransportCost(
    transporter,
    distanceKm
  );

  const isAvailable =
    transporter.availability === "AVAILABLE";

  return (
    <div
      className="
    overflow-hidden rounded-2xl
    border border-slate-200
    bg-white shadow-sm
    animate-[fadeInUp_0.35s_ease-out]
  "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-slate-100 p-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Truck size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">
              {transporter.name}
            </h2>

            <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Star
                  size={12}
                  className="fill-current text-amber-500"
                />

                {transporter.rating.toFixed(1)}
              </span>

              <span className="text-slate-300">
                •
              </span>

              <span className="text-xs text-slate-500">
                {transporter.totalBookings} bookings
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close transporter details"
        >
          <X size={17} />
        </button>
      </div>

      {/* STATUS */}
      <div className="p-3">
        <div
          className={[
            "flex items-center justify-between rounded-xl p-1",
            isAvailable
              ? "bg-emerald-50"
              : "bg-slate-50",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            {isAvailable ? (
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />
            ) : (
              <Clock3
                size={17}
                className="text-slate-500"
              />
            )}

            <span
              className={[
                "text-sm font-semibold",
                isAvailable
                  ? "text-emerald-700"
                  : "text-slate-600",
              ].join(" ")}
            >
              {isAvailable
                ? "Available for booking"
                : "Currently busy"}
            </span>
          </div>
        </div>

        {/* VEHICLE INFO */}
        <div className="mt-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Vehicle details
          </p>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-xs text-slate-600">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                {transporter.vehicle.type
                  .toLowerCase()
                  .replaceAll("_", " ")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-xs text-slate-600">
                Capacity
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {transporter.vehicle.capacityKg.toLocaleString()}{" "}
                kg
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            {transporter.vehicle.refrigerated ? (
              <>
                <Snowflake
                  size={15}
                  className="text-sky-500"
                />

                <span>
                  Refrigerated transportation available
                </span>
              </>
            ) : (
              <>
                <Truck
                  size={15}
                  className="text-slate-400"
                />

                <span>Standard transportation</span>
              </>
            )}
          </div>
        </div>

        {/* LOGISTICS */}
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Logistics estimate
          </p>

          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={15} />
                Distance
              </span>

              <span className="text-sm font-semibold text-slate-800">
                {distanceKm.toFixed(1)} km
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Price
              </span>

              <span className="text-sm font-semibold text-slate-800">
                ₹{transporter.vehicle.pricePerKm}/km
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Estimated cost
              </span>

              <span className="text-base font-bold text-emerald-600">
                ₹{estimatedCost.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* RELIABILITY */}
        <div className="mt-2 border-t border-slate-100 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Reliability
          </p>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <p className="text-lg font-bold text-slate-900">
                {transporter.onTimeDeliveryRate}%
              </p>

              <p className="text-xs text-slate-500">
                On-time delivery
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                {transporter.successfulBookings}
              </p>

              <p className="text-xs text-slate-500">
                Successful bookings
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 grid grid-cols-[1fr_auto] gap-2.5">
          <button
            type="button"
            disabled={!isAvailable}
            className={[
              "min-h-11 rounded-xl px-4",
              "text-sm font-semibold",
              "transition-colors duration-200",
              isAvailable
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
                : "cursor-not-allowed bg-slate-100 text-slate-400",
            ].join(" ")}
          >
            {isAvailable
              ? "Request Transportation"
              : "Currently Unavailable"}
          </button>

          <button
            type="button"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
          >
            <Phone size={15} />
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransporterDetails;