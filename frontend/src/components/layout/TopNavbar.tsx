import { Bell, Search, User } from "lucide-react";

function TopNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">

      {/* Left side */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border bg-slate-50 px-4 py-2">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search crops, mandis, diseases or advisory..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

      </div>

      {/* Right side */}
      <div className="ml-4 hidden items-center gap-4 sm:flex">

        <div className="flex items-center gap-1 rounded-lg border px-2 py-1 text-sm">
          <button className="rounded-md bg-emerald-600 px-2 py-1 text-white">
            EN
          </button>

          <button className="px-2 py-1 text-slate-600">
            हिंदी
          </button>
        </div>

        <button className="relative rounded-lg p-2 hover:bg-slate-100">
          <Bell size={19} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
          <User size={17} />
        </div>

      </div>
    </header>
  );
}

export default TopNavbar;