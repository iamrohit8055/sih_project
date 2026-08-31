import { Bell, Search, User, Menu, X } from "lucide-react";
import NavbarWeather from "./NavbarWeather";
import { useState } from "react";

function TopNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="
    sticky top-0 z-3000
    flex h-16 shrink-0 min-w-0
    items-center justify-between
    border-b border-slate-200/80
    bg-white/75
    px-3 sm:px-4 md:px-6
    shadow-[0_1px_0_rgba(15,23,42,0.06)]
    backdrop-blur
  "
    >
      {/* ================= LEFT SIDE ================= */}

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {/* Search */}

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 sm:max-w-md sm:gap-3 sm:px-4">
          <Search
            size={18}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search crops, mandis, diseases or advisory..."
            className="
              min-w-0 w-full
              bg-transparent
              text-sm
              outline-none
              placeholder:text-slate-400
            "
          />
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-4 sm:gap-3">
        
        {/* ================= LANGUAGE ================= */}

        {/* Desktop */}
        <div className="hidden items-center gap-1 rounded-lg border px-2 py-1 text-sm md:flex">
          <button className="rounded-md bg-emerald-700 px-2 py-1 text-white">
            EN
          </button>

          <button className="px-2 py-1 text-slate-600">
            हिंदी
          </button>
        </div>

        {/* ================= WEATHER ================= */}
        <NavbarWeather />

        {/* ================= NOTIFICATION ================= */}

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            rounded-lg
            p-2
            transition-colors
            hover:bg-slate-100
          "
        >
          <Bell size={19} />

          <span
            className="
              absolute right-1 top-1
              h-2 w-2
              rounded-full
              bg-orange-500
            "
          />
        </button>

        {/* ================= PROFILE ================= */}

        <button
          type="button"
          aria-label="Profile"
          className="
            hidden
            h-9 w-9
            items-center justify-center
            rounded-full
            bg-emerald-100
            text-emerald-800
            transition-colors
            hover:bg-emerald-200
            md:flex
          "
        >
          <User size={17} />
        </button>

        {/* ================= MOBILE MENU BUTTON ================= */}

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((current) => !current)}
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            text-slate-600
            transition-colors
            hover:bg-slate-100
            md:hidden
          "
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ================================================== */}
      {/* MOBILE DROPDOWN                                   */}
      {/* ================================================== */}

      {menuOpen && (
        <div
          className="
            absolute right-3 top-15 z-50
            w-64
            overflow-hidden
            rounded-xl
            border border-slate-200
            bg-white
            p-3
            shadow-xl
            md:hidden
          "
        >
          {/* Language */}

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-medium text-slate-600">
              Language
            </span>

            <div className="flex items-center gap-1 rounded-lg border px-1 py-1">
              <button className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white">
                EN
              </button>

              <button className="px-2 py-1 text-xs text-slate-600">
                हिंदी
              </button>
            </div>
          </div>

          {/* Profile */}

          <button
            type="button"
            className="
              mt-2
              flex w-full
              items-center gap-3
              rounded-lg
              px-3 py-2.5
              text-left
              text-sm
              text-slate-700
              transition-colors
              hover:bg-slate-50
            "
          >
            <User
              size={18}
              className="text-slate-500"
            />

            <span>Profile</span>
          </button>


        </div>
      )}
    </header>
  );
}

export default TopNavbar;