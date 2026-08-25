import {
  ArrowRight,
  Bell,
  Globe2,
  Leaf,
  LineChart,
  Menu,
  X,
  ScanLine,
  Sparkles,
  Sprout,
  Warehouse,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Sprout,
    title: "Smart Crop Management",
    text: "Track planting dates, soil parameters, irrigation schedules, and growth stages with real-time farm timeline analytics.",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: ScanLine,
    title: "AI Crop Disease Diagnostics",
    text: "Upload leaf photos for instant computer vision classification with tailored organic and chemical remedy steps.",
    tone: "bg-amber-100 text-amber-700",
  },
  {
    icon: Warehouse,
    title: "Produce & Storage Control",
    text: "Monitor warehouse temperature, ambient humidity, and shelf life indicators to eliminate post-harvest waste.",
    tone: "bg-blue-100 text-blue-700",
  },
  {
    icon: LineChart,
    title: "Market Intelligence & Rates",
    text: "Compare real-time APMC Mandi prices, transport costs, road distances, and net profitability.",
    tone: "bg-violet-100 text-violet-700",
  },
  {
    icon: Sparkles,
    title: "Sell / Store / Process AI",
    text: "Calculate mathematically optimal ratios for selling raw, cold-storing, or processing your produce.",
    tone: "bg-emerald-600 text-white",
  },
  {
    icon: Globe2,
    title: "Bilingual Voice AI Assistant",
    text: "Get answers to farming questions through a natural language assistant in English and Hindi.",
    tone: "bg-indigo-100 text-indigo-700",
  },
];
function AnimatedStat({
  value,
  suffix = "",
  prefix = "",
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShouldAnimate(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;

    setCount(0);
    let start: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * value);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [shouldAnimate, value]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center">
      <div className="text-4xl font-bold text-emerald-600">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-sm font-medium text-emerald-800">{label}</div>
    </div>
  );
}

function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faf7] pt-[80px] text-[#101a32]">
      <div className="border-b border-emerald-950 bg-[#003d32] px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-emerald-100 sm:text-xs">
        <span className="mr-2 text-amber-300">✦</span>
        Smart India Hackathon 2026 Official Prototype - Agriculture & Food Tech
        Innovation
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/70 px-5 py-3 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20">
              <Leaf size={23} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#003d32] sm:text-2xl">
              KrishiSetu <span className="text-emerald-600">AI</span>
            </span>
            <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:inline-block">
              SIH 2026
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <div className="flex items-center gap-1 rounded-lg bg-emerald-50 p-1 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100 hover:shadow hover:shadow-emerald-200/50">
              <button className="rounded-md bg-emerald-700 px-3 py-1.5 text-white transition hover:bg-emerald-900">
                EN
              </button>
              <button className="px-2 py-1.5 transition hover:text-emerald-700">
                हिंदी
              </button>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 transition hover:bg-emerald-200"
            >
              <Bell size={16} />
            </button>

            <Link
              to="/login"
              className="px-3 py-2 text-sm font-bold text-[#003d32] hover:text-emerald-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
            >
              Get Started <ArrowRight size={17} />
            </Link>
          </nav>

          <div className="relative flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 transition hover:bg-emerald-200"
            >
              <Bell size={16} />
            </button>
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 transition hover:bg-emerald-200"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {isMobileMenuOpen && (
              <div
                id="mobile-navigation"
                className="absolute right-0 top-12 w-56 rounded-xl border border-emerald-100 bg-white p-3 shadow-xl shadow-slate-900/10"
              >
                <div className="mb-2 flex items-center gap-2 border-b border-slate-100 px-3 pb-3 text-sm font-semibold text-emerald-800">
                  <Globe2 size={16} />
                  <button className="rounded-md bg-emerald-700 px-2 py-1 text-white">
                    EN
                  </button>
                  <button className="px-2 py-1 hover:text-emerald-600">
                    हिंदी
                  </button>
                </div>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-bold text-[#003d32] hover:bg-emerald-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-bold text-[#003d32] hover:bg-emerald-50"
                >
                  Sign up
                </Link>
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-emerald-50"
                >
                  Explore Features
                </a>
                <a
                  href="#innovation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-emerald-50"
                >
                  Core Innovation
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-5 md:grid-cols-[1.05fr_.95fr] md:px-8 md:pb-24 md:pt-8">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-800">
            <Sparkles size={16} /> Next-Gen Smart Agriculture Platform
          </div>
          <h1 className="max-w-[620px] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.7rem]">
            Smart Decisions
            <span className="block text-emerald-700">From Farm to Market</span>
            <span className="block">Powered by AI</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            KrishiSetu AI transforms Indian farming with end-to-end
            intelligence: from real-time crop tracking and disease diagnostics
            to our revolutionary Sell, Store, or Process harvest recommendation
            engine.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-3 rounded-xl bg-emerald-700 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Get Started Now <ArrowRight size={19} />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-7 py-4 font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              Explore Features
            </a>
          </div>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-7">
            <AnimatedStat value={35} suffix="%" label="Spoilage Avoided" />
            <AnimatedStat value={94} suffix="%" label="AI Disease Accuracy" />
            <AnimatedStat
              value={12.5}
              prefix="₹"
              suffix="K"
              label="Avg Profit Lift/Ton"
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-2xl shadow-emerald-950/10">
          <div className="relative h-72 overflow-hidden rounded-2xl bg-[url('https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center sm:h-80">
            <div className="absolute inset-0 bg-gradient-to-t from-[#071a1b]/90 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <span className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-bold">
                  AI Live Scanning
                </span>
                <p className="mt-2 font-bold">Tomato Crop #104 - Babina Farm</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-200">Freshness Index</p>
                <strong className="text-xl">92%</strong>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between text-xs font-bold tracking-wide text-[#003d32]">
              <span>HARVEST ACTION RECOMMENDATION</span>
              <span className="text-emerald-700">OPTIMAL SPLIT</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-white">
              <div className="rounded-xl bg-emerald-700 px-2 py-3 text-xs font-bold">
                SELL NOW
                <small className="block text-[10px] font-normal">
                  60% (300kg)
                </small>
              </div>
              <div className="rounded-xl bg-amber-600 px-2 py-3 text-xs font-bold">
                STORE
                <small className="block text-[10px] font-normal">
                  20% (100kg)
                </small>
              </div>
              <div className="rounded-xl bg-violet-700 px-2 py-3 text-xs font-bold">
                PROCESS
                <small className="block text-[10px] font-normal">
                  20% (100kg)
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="innovation" className="bg-slate-950 px-5 py-12 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-emerald-400 sm:text-3xl">
              The Core Innovation: Sell, Store, or Process Engine
            </h2>
            <p className="mt-2 text-slate-300">
              Algorithmic decision science eliminating post-harvest loss &
              maximizing farmer revenue
            </p>
          </div>
          <Link
            to="/login"
            className="flex w-fit items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-slate-950 hover:bg-amber-400"
          >
            Try Decision Engine Demo <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20"
      >
        <div className="text-center">
          <h2 className="text-3xl font-black sm:text-4xl">
            Comprehensive Smart Farming Suite
          </h2>
          <p className="mt-3 text-slate-600">
            Built specifically for Indian agrarian conditions with multilingual
            AI intelligence.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, tone }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-slate-950 px-5 py-8 text-sm text-slate-300 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 md:flex-row">
          <p>
            <span className="font-bold text-emerald-400">✦ KrishiSetu AI</span>{" "}
            - Smart India Hackathon 2026 Prototype
          </p>
          <p>
            Built with React, Tailwind CSS v4 & AI Algorithms for Indian Farmers
          </p>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
