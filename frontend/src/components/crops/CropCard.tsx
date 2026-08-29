import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Wheat,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { MockCrop } from "@/mock/crops";
import type { CropStatus } from "@/types/crops";

interface CropCardProps {
  crop: MockCrop;
}

const statusStyles: Record<
  CropStatus,
  {
    badge: string;
    dot: string;
    ligthColor: string;
  }
> = {
  Healthy: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    ligthColor: "bg-teal-100",
  },

  "Needs Attention": {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    ligthColor: "bg-amber-50",
  },

  Critical: {
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
    ligthColor: "bg-rose-100",
  },
};

export default function CropCard({
  crop,
}: CropCardProps) {
  const status = statusStyles[crop.health];

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* =========================================
          CROP IMAGE
          ========================================= */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={crop.image}
          alt={crop.name}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Image overlay */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-t
            from-black/35
            via-transparent
            to-black/5
          "
        />

        {/* Status */}
        <div
          className="
            absolute
            right-4
            top-4
            
          "
        >
          <span
            className={`
              flex
              items-center
              gap-1.5
              rounded-full
              border
              px-3
              py-1.5
              text-xs
              font-semibold
              backdrop-blur-md
              ${status.badge}
            `}
          >
            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${status.dot}
              `}
            />

            {crop.health}
          </span>
        </div>
      </div>

      {/* =========================================
          CARD CONTENT
          ========================================= */}
      <div className={`${status.ligthColor} p-2`}>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">

          <div>
            <h3
              className="
                font-serif
                text-xl
                font-semibold
                text-slate-900
              "
            >
              {crop.name}
            </h3>

            <p className="mt-0.5 text-sm text-slate-500">
              {crop.variety}
            </p>
          </div>

        </div>

        {/* Farm */}
        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            text-sm
            text-slate-600
          "
        >
          <MapPin
            size={16}
            className="text-slate-400"
          />

          <span>
            {crop.farm}
          </span>
        </div>

        {/* =========================================
            AREA + PROGRESS
            ========================================= */}
        <div className="mt-4 grid grid-cols-2 gap-3">

          <Detail
            label="Area"
            value={`${crop.area} acres`}
          />

          <Detail
            label="Progress"
            value={`${crop.progress}%`}
          />

        </div>

        {/* =========================================
            SOWING + HARVEST
            ========================================= */}
        <div className="mt-3 grid grid-cols-2 gap-3">

          <Detail
            label="Sowing"
            value={formatDate(crop.sowingDate)}
            icon={
              <CalendarDays size={14} />
            }
          />

          <Detail
            label="Harvest"
            value={formatDate(crop.harvestDate)}
            icon={
              <Wheat size={14} />
            }
            
          />

        </div>

        {/* =========================================
            GROWING PROGRESS
            ========================================= */}
        <div className="mt-5">

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >
            <span className="text-sm text-slate-600">
              Growing Progress
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-emerald-700
              "
            >
              {crop.progress}%
            </span>
          </div>

          <div
            className="
              h-2
              overflow-hidden
              rounded-full
              bg-slate-100
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-emerald-600
                transition-all
                duration-500
              "
              style={{
                width: `${crop.progress}%`,
              }}
            />
          </div>

        </div>

        {/* =========================================
            ACTION
            ========================================= */}
        <Link
          to={`/app/crops/${crop.id}`}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            border-t
            border-slate-200
            pt-4
            text-sm
            font-semibold
            text-slate-700
            transition-colors
            hover:text-emerald-700
          "
        >
          View Crop Details

          <ChevronRight
            size={16}
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />
        </Link>

      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        px-3
        py-2.5
      "
    >
      <div
        className="
          flex
          items-center
          gap-1
          text-xs
          text-slate-400
        "
      >
        {icon}

        <span>
          {label}
        </span>
      </div>

      <p
        className="
          mt-1
          text-sm
          font-semibold
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}