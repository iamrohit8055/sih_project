import {
  Activity,
  ArrowRight,
  Bell,
  CloudSun,
  Leaf,
  LineChart,
  Menu,
  X,
  ScanLine,
  Sparkles,
  Sprout,
  Truck,
  Warehouse,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// The single source of truth for the "journey" section below.
// Each entry = one step a user takes on Sasyam AI, grouped by who uses it
// (farmer -> transporter -> warehouse owner), rendered in order as a timeline.
type JourneyStep = {
  number: string;
  persona: string;
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  Icon: typeof Sprout;
  tone: keyof typeof TONE_STYLES;
  blob?: number;
  decoration?: "sprout";
  reverse?: boolean;
  image: string;
  imageAlt: string;
};

const journeySteps: JourneyStep[] = [
  {
    number: "01",
    persona: "farmer",
    eyebrow: "FARMER · CHECK",
    title: "Know your soil before you sow anything.",
    text: "A quick soil check reads moisture, pH, and nutrient levels for the plot and turns them into plain-language guidance — what the soil is missing and what to add before the next crop goes in.",
    points: [
      "Scan or enter soil readings from the field",
      "See pH, moisture & nutrient levels at a glance",
      "Get fertilizer/amendment suggestions for the plot",
    ],
    Icon: Sprout,
    tone: "moss",
    blob: 1,
    decoration: "sprout",
    // TODO: Replace with a screenshot of the Soil Health dashboard card
    image: "/images/journey/soil-health.jpg",
    imageAlt: "Soil health dashboard showing moisture and nutrient readings",
  },
  {
    number: "02",
    persona: "farmer",
    eyebrow: "FARMER · PROTECT",
    title: "A photo of a leaf becomes a diagnosis.",
    text: "The moment a crop looks off, snap or upload a photo of the leaf. AI-based disease detection classifies the problem from the image and returns organic or chemical remedy steps — no waiting for an expert visit.",
    points: [
      "Upload or capture a leaf / crop photo",
      "Get instant AI disease classification",
      "Follow tailored remedy recommendations",
    ],
    Icon: ScanLine,
    tone: "rust",
    blob: 2,
    reverse: true,
    // TODO: Replace with a screenshot of the disease-scan result screen
    image: "/images/journey/disease-scan.jpg",
    imageAlt: "AI leaf disease scan result on a crop photo",
  },
  {
    number: "03",
    persona: "farmer",
    eyebrow: "FARMER · SELL SMART",
    title: "See today's mandi rate before you decide.",
    text: "Live APMC / mandi prices for the crop, pulled from nearby markets, sit right on the dashboard — so the choice to sell now or wait a few days is based on numbers, not guesswork.",
    points: [
      "Compare live rates across nearby mandis",
      "Track price trend over the last few days",
      "Know the best market to sell to, not just the nearest",
    ],
    Icon: LineChart,
    tone: "teal",
    blob: 3,
    // TODO: Replace with a screenshot of the Mandi Rate comparison chart
    image: "/images/journey/mandi-rate.jpg",
    imageAlt: "Mandi rate comparison chart across nearby markets",
  },
  {
    number: "04",
    persona: "farmer",
    eyebrow: "FARMER · TRACK",
    title: "Every crop keeps its own health record.",
    text: "Each crop gets a running record — growth stage, health checks, past issues — all in one timeline. An AI layer reads that history and suggests the next best action instead of leaving the farmer to piece it together.",
    points: [
      "Full history & health timeline per crop",
      "Past issues and treatments logged automatically",
      "AI suggestions based on the crop's own record",
    ],
    Icon: Activity,
    tone: "violet",
    blob: 4,
    reverse: true,
    // TODO: crop health image.
    image: "/images/journey/crop-track-record.jpg",
    imageAlt: "Crop health track record timeline with AI suggestions",
  },
  {
    number: "05",
    persona: "farmer",
    eyebrow: "FARMER · PLAN AHEAD",
    title: "Weather that comes with a next step.",
    text: "A short-range forecast for the plot's exact location, paired with an AI suggestion on what to do about it — delay irrigation, cover young plants, or bring harvest forward before rain.",
    points: [
      "Hyperlocal forecast for the field",
      "Rain, heat & wind alerts in advance",
      "AI suggestion on what action to take",
    ],
    Icon: CloudSun,
    tone: "sky",
    blob: 1,
    // TODO: weather forecast image.
    image: "/images/journey/weather-ai.jpg",
    imageAlt: "Weather forecast card with AI action suggestion",
  },
  {
    number: "06",
    persona: "transporter",
    eyebrow: "TRANSPORTER · MOVE THE HARVEST",
    title: "Find a ride for the harvest, not just any truck.",
    text: "Available transporters near the farm show up with their vehicle type, capacity, and rate up front — so the farmer can compare and book a ride that actually fits the load, instead of calling around.",
    points: [
      "See transporters available nearby right now",
      "Compare vehicle type & rate side by side",
      "Book the one that fits the load and budget",
    ],
    Icon: Truck,
    tone: "amber",
    blob: 2,
    reverse: true,
    // TODO: Replace with a screenshot of the Transporter availability list
    image: "/images/journey/transporter-availability.jpg",
    imageAlt: "List of available transporters with vehicle type and rate",
  },
  {
    number: "07",
    persona: "warehouse",
    eyebrow: "WAREHOUSE · STORE IT RIGHT",
    title: "The nearest storehouse, sorted by type.",
    text: "Cold storage and normal storehouses near the farm are listed together with available capacity, so produce that needs to be chilled doesn't end up sitting in a warehouse that can't keep it fresh.",
    points: [
      "Browse nearby cold & normal storehouses",
      "Check available capacity before you travel",
      "Pick storage that matches the crop's shelf life",
    ],
    Icon: Warehouse,
    tone: "indigo",
    blob: 3,
    // TODO: Replace with a screenshot of the Nearby Storehouse finder
    image: "/images/journey/nearby-storehouse.jpg",
    imageAlt: "Map and list of nearby cold and normal storehouses",
  },
];

const personaGroups = [
  {
    id: "journey-farmer",
    persona: "farmer",
    label: "Farmer journey",
    Icon: Sprout,
    tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "journey-transporter",
    persona: "transporter",
    label: "Transporter journey",
    Icon: Truck,
    tone: "text-orange-700 bg-orange-50 border-orange-200",
  },
  {
    id: "journey-warehouse",
    persona: "warehouse",
    label: "Warehouse owner journey",
    Icon: Warehouse,
    tone: "text-indigo-700 bg-indigo-50 border-indigo-200",
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
      <div className="text-4xl font-black text-emerald-950/80">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
    </div>
  );
}

//blob shapes for background.
const BLOB_SHAPES = [
  "63% 37% 54% 46% / 55% 48% 52% 45%",
  "41% 59% 60% 40% / 55% 42% 58% 45%",
  "55% 45% 40% 60% / 60% 40% 65% 35%",
  "35% 65% 55% 45% / 40% 65% 35% 60%",
];

const TONE_STYLES = {
  moss: {
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    blobFrom: "from-emerald-200",
    blobTo: "to-emerald-500",
    number: "text-emerald-600",
    dot: "bg-emerald-600",
    divider: "bg-emerald-200",
  },
  rust: {
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
    blobFrom: "from-amber-200",
    blobTo: "to-orange-500",
    number: "text-amber-600",
    dot: "bg-amber-600",
    divider: "bg-amber-200",
  },
  teal: {
    badge: "bg-teal-100 text-teal-700 ring-teal-200",
    blobFrom: "from-teal-200",
    blobTo: "to-teal-500",
    number: "text-teal-600",
    dot: "bg-teal-600",
    divider: "bg-teal-200",
  },
  violet: {
    badge: "bg-violet-100 text-violet-700 ring-violet-200",
    blobFrom: "from-violet-200",
    blobTo: "to-violet-500",
    number: "text-violet-600",
    dot: "bg-violet-600",
    divider: "bg-violet-200",
  },
  sky: {
    badge: "bg-sky-100 text-sky-700 ring-sky-200",
    blobFrom: "from-sky-200",
    blobTo: "to-sky-500",
    number: "text-sky-600",
    dot: "bg-sky-600",
    divider: "bg-sky-200",
  },
  amber: {
    badge: "bg-orange-100 text-orange-700 ring-orange-200",
    blobFrom: "from-orange-200",
    blobTo: "to-amber-600",
    number: "text-orange-600",
    dot: "bg-orange-600",
    divider: "bg-orange-200",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-700 ring-indigo-200",
    blobFrom: "from-indigo-200",
    blobTo: "to-blue-600",
    number: "text-indigo-600",
    dot: "bg-indigo-600",
    divider: "bg-indigo-200",
  },
};

function WalkthroughStep({
  number,
  eyebrow,
  title,
  text,
  points,
  image,
  imageAlt,
  Icon,
  tone,
  blob = 0,
  //decoration,
  reverse = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  image: string;
  imageAlt: string;
  Icon: typeof Sprout;
  tone: keyof typeof TONE_STYLES;
  blob?: number;
  decoration?: "sprout";
  reverse?: boolean;
}) {
  const styles = TONE_STYLES[tone];
  const radius = BLOB_SHAPES[blob % BLOB_SHAPES.length];

  return (
    <article
      className={`relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-8 ${
        reverse ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      <div className="relative z-10 mx-auto aspect-square w-full max-w-[clamp(12rem,55vw,26rem)]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${styles.blobFrom} ${styles.blobTo} shadow-xl shadow-slate-900/10`}
          style={{ borderRadius: radius }}
        />

        {/* Image card floats on top of the blob */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[87%] max-w-sm -rotate-2 overflow-hidden rounded-2xl border-4 border-white shadow-2xl shadow-slate-900/20">
            {/* TODO: swap this <img> src for real images. */}
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/20 bg-slate-950/55 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur">
              Sasyam · Step {number}
            </div>
          </div>
        </div>
      </div>

      {/* A chhotu sa plant grows out of the soil visual for step 01 */}
      {/*{decoration === "sprout" && (
          <div
            aria-hidden
            className="absolute -bottom-4 -right-3 flex h-16 w-16 rotate-6 items-center justify-center rounded-full border-4 border-[#f7faf7] bg-emerald-600 text-white shadow-lg"
          >
            <Sprout size={28} />
          </div>
        )}
      </div>*/}

      <div
        className={`relative z-10 max-w-lg ${
          reverse ? "lg:justify-self-start" : "lg:justify-self-end"
        }`}
      >
        <div className="flex items-center gap-4">
          <span
            className={`text-sm font-black tracking-widest ${styles.number}`}
          >
            {number}
          </span>

          <span className={`h-px w-10 ${styles.divider}`} />

          <span className="text-xs font-black tracking-[0.16em] text-slate-500">
            {eyebrow}
          </span>
        </div>

        <div
          className={`mt-5 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${styles.badge}`}
        >
          <Icon size={24} />
        </div>

        <h3 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[#101a32] sm:text-4xl">
          {title}
        </h3>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {text}
        </p>

        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700"
            >
              <span
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${styles.dot}`}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroAnikey, setHeroAnikey] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickPulses, setClickPulses] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleFeaturesClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setClickPulses((pulses) => [...pulses, { id, x, y }]);

    // remove this pulse after the animation finishes
    setTimeout(() => {
      setClickPulses((pulses) => pulses.filter((p) => p.id !== id));
    }, 1400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8f5] pt-[80px] text-[#101a32]">
      {/* Corner-only grid, top-left (tiny), bottom-left (small) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[clamp(42rem,100vh,56rem)] overflow-hidden"
      >
        {/* TOP-RIGHT corner grid — larger patch */}
        <div
          className="absolute -top-4 right-0 h-64 w-64 md:h-80 md:w-80"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(146,64,14,0.24) 1px, transparent 1px), linear-gradient(to bottom, rgba(146,64,14,0.24) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 100% 0%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 100% 0%, black 55%, transparent 100%)",
          }}
        />
        {/*<div
          className="absolute -top-10 right-[-2rem] h-56 w-56 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(155, 108, 20, 0.54), transparent)",
          }}
        />*/}

        {/* TOP-LEFT corner grid */}
        <div
          className="absolute -top-4 -left-4 h-[290px] w-[200px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(146,64,14,0.24) 1px, transparent 1px), linear-gradient(to bottom, rgba(146,64,14,0.24) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 0% 0%, black 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 0% 0%, black 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute -top-8 -left-8 h-40 w-40 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(56,189,248,0.18), transparent)",
          }}
        />
      </div>
      {/*<div className="border-b border-emerald-950 bg-[#003d32] px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-emerald-100 sm:text-xs">
        <span className="mr-2 text-amber-300">✦</span>
        Smart India Hackathon 2026 Official Prototype - Agriculture & Food Tech
        Innovation
      </div>*/}

      <header className="fixed left-0 right-0 top-0 z-50 px-[clamp(0.75rem,2vw,2rem)] py-3 transition-all duration-500">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-[clamp(0.5rem,1vw,0.75rem)] transition-all duration-500">
          {/* ISLAND 1 — logo */}
          <div
            className={`flex min-w-0 items-center rounded-full border border-slate-100/40 bg-slate-100/55 px-[clamp(0.5rem,0.6rem,1rem)] py-[clamp(0.4rem,0.45rem,0.75rem)] backdrop-blur-xl transition-shadow duration-500 ${
              isScrolled
                ? "shadow-[0_10px_36px_rgba(15,23,42,0.17)]"
                : "shadow-none"
            }`}
          >
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setHeroAnikey((key) => key + 1);
              }}
              className="flex min-w-0 items-center gap-[clamp(0.5rem,0.68rem,0.75rem)]"
            >
              <span className="flex h-[clamp(2rem,2.35rem,2.5rem)] w-[clamp(2rem,2.35rem,2.5rem)] shrink-0 items-center justify-center rounded-xl bg-emerald-700/40 text-emerald-900">
                <Leaf
                  size={20}
                  className="h-[clamp(1rem,1.2rem,1.4rem)] w-[clamp(1rem,1.2rem,1.4rem)]"
                />
              </span>
              <span
                className="truncate text-[clamp(1.1rem,1.7rem,2.25rem)] font-semibold tracking-tight text-slate-950"
                style={{ fontFamily: '"Bodoni Moda", serif' }}
              >
                Sasyam
              </span>
              <span className="hidden rounded-full border border-slate-900 bg-slate-800 px-[clamp(0.35rem,0.7vw,0.75rem)] py-[clamp(0.15rem,0.5vw,0.35rem)] text-[clamp(0.55rem,0.8vw,0.7rem)] font-semibold text-white md:inline-block">
                SIH 2026
              </span>
            </Link>
          </div>

          {/* ISLAND 2 — nav actions */}
          <div
            className={`flex min-w-0 items-center gap-[clamp(0.5rem,0.68rem,0.75rem)] rounded-full border border-slate-100/40 bg-slate-100/55 px-[clamp(0.5rem,0.7rem,0.9rem)] py-[clamp(0.4rem,0.45rem,0.7rem)] backdrop-blur-xl transition-shadow duration-500 ${
              isScrolled
                ? "shadow-[0_10px_36px_rgba(15,23,42,0.17)]"
                : "shadow-none"
            }`}
          >
            <nav className="hidden min-w-0 items-center gap-[clamp(0.5rem,0.87rem,1.25rem)] md:flex lg:gap-[clamp(0.85rem,0.97rem,1.5rem)]">
              <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/60 p-1 text-[clamp(0.7rem,1vw,0.875rem)] font-medium text-slate-800 shadow-inner shadow-slate-200/40 transition hover:bg-slate-100/80">
                <button className="rounded-lg bg-slate-900 px-[clamp(0.5rem,0.65rem,0.8rem)] py-[clamp(0.3rem,0.37rem,0.45rem)] font-semibold text-white transition hover:bg-slate-700">
                  EN
                </button>
                <button className="px-[clamp(0.35rem,0.49rem,0.6rem)] py-[clamp(0.2rem,0.3rem,0.4rem)] text-slate-700 text-[clamp(0.7rem,1vw,0.875rem)] transition hover:text-slate-900">
                  हिंदी
                </button>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="flex h-[clamp(2rem,3vw,2.5rem)] w-[clamp(2rem,3vw,2.5rem)] shrink-0 items-center justify-center rounded-lg bg-slate-100/70 text-slate-700 transition hover:bg-slate-200/80"
              >
                <Bell
                  size={18}
                  className="h-[clamp(0.9rem,1.4vw,1.2rem)] w-[clamp(0.9rem,1.4vw,1.2rem)]"
                />
              </button>

              <Link
                to="/login"
                className="px-[clamp(0.35rem,0.8vw,0.75rem)] py-[clamp(0.3rem,0.7vw,0.5rem)] text-[clamp(0.7rem,0.9vw,0.875rem)] font-bold text-slate-700 hover:text-emerald-700"
              >
                Login
              </Link>
            </nav>

            <div className="relative flex shrink-0 items-center gap-2 md:hidden">
              <button
                type="button"
                aria-label="Notifications"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100/70 text-slate-700 transition hover:bg-slate-200/80"
              >
                <Bell size={16} />
              </button>
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/50 text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-white/70"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {isMobileMenuOpen && (
                <div
                  id="mobile-navigation"
                  className="absolute right-0 top-12 w-60 rounded-2xl border border-white/60 bg-white/60 p-3 shadow-[0_18px_42px_rgba(15,23,42,0.14)] backdrop-blur-xl"
                >
                  <div className="mb-2 flex items-center gap-2 border-b border-slate-200/80 px-3 pb-3 text-sm font-semibold text-slate-800">
                    {/*<Globe2 size={16} className="text-emerald-700" />*/}
                    <button className="rounded-md bg-slate-900 px-2 py-1 font-semibold text-white">
                      EN
                    </button>
                    <button className="px-2 py-1 text-slate-600 hover:text-slate-900">
                      हिंदी
                    </button>
                  </div>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100/80 hover:text-emerald-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100/80"
                  >
                    <span className="inline-block rounded-md bg-emerald-100 px-2 py-1.5 text-emerald-900">
                      Sign up
                    </span>
                  </Link>
                  <a
                    href="#features"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                  >
                    Explore Features
                  </a>
                  <a
                    href="#innovation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                  >
                    Core Innovation
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-[224px] w-[224px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(146,64,14,0.24) 1px, transparent 1px), linear-gradient(to bottom, rgba(146,64,14,0.24) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 0% 100%, black 65%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 0% 100%, black 65%, transparent 100%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-5 pb-16 pt-10 md:grid-cols-[1.05fr_.95fr] md:gap-12 md:px-8 md:pb-24 md:pt-12">
          <div className="relative z-10 max-w-[38rem] pt-6 md:pt-12 lg:max-w-[42rem]">
            <h2 className="hero-headline max-w-[620px] text-[clamp(3.1rem,4.8vw,6.5rem)]">
              Understand your crop.
              <span className="hero-highlight mt-1 block text-emrald-950/60">
                Decide what comes next...
              </span>
            </h2>
            <p className="hero-copy mt-6 max-w-[32rem] text-[1rem] leading-[1.55] text-[#3a4050] sm:text-[1.08rem]">
              Sasyam doesn't just tell farmers what's happening to their crop.
              It helps them understand what to do next. From crop health and
              mandi prices to transport and storage, Sasyam brings the right
              information together and turns it into clearer, more actionable
              decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 font-bold text-white shadow-xl shadow-emerald-900/25 transition hover:-translate-y-0.5 hover:from-emerald-950 hover:to-slate-950"
                style={{
                  padding:
                    "clamp(0.65rem, 1.8vw, 1rem) clamp(1.1rem, 4vw, 1.75rem)",
                  fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
                }}
              >
                Get Started <ArrowRight size={19} />
              </Link>
              <a
                href="#features"
                className="rounded-xl bg-gradient-to-r from-emerald-300/30 to-slate-300/30 font-bold text-slate-800 transition hover:from-emerald-400/30 hover:to-slate-800/30"
                style={{
                  padding:
                    "clamp(0.65rem, 1.8vw, 1rem) clamp(1.1rem, 4vw, 1.75rem)",
                  fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
                }}
              >
                Explore Features
              </a>
            </div>
          </div>
          <div
            key={heroAnikey}
            className="relative z-10 mx-auto flex h-[22rem] w-full max-w-2xl -translate-y-4 items-center justify-center sm:h-[25rem] md:-translate-y-2"
          >
            <div className="absolute bottom-4 h-8 w-72 rounded-full bg-emerald-950/10 blur-xl sm:w-80" />

            <img
              src="/images/hero/photo-1.png"
              alt="Sasyam preview 1"
              className="absolute z-10 aspect-[16/10] rounded-2xl object-cover shadow-2xl w-[clamp(14rem,38vw,28rem)]"
              style={{ animation: "stackInLeft 0.6s ease-out 0.1s both" }}
            />
            <img
              src="/images/hero/photo-2.png"
              alt="Sasyam preview 2"
              className="absolute z-20 aspect-[16/10] rounded-2xl object-cover shadow-2xl w-[clamp(14rem,38vw,28rem)]"
              style={{ animation: "stackInCenter 0.6s ease-out 0.27s both" }}
            />
            <img
              src="/images/hero/photo-3.png"
              alt="Sasyam preview 3"
              className="absolute z-30 aspect-[16/10] rounded-2xl object-cover shadow-2xl w-[clamp(14rem,38vw,28rem)]"
              style={{ animation: "stackInRight 0.6s ease-out 0.54s both" }}
            />

            <style>{`
                @keyframes stackInLeft {
                  from { opacity: 0; transform: translate(-4rem, -4.5rem) scale(0.9) rotate(0deg); }
                  to   { opacity: 1; transform: translate(-4rem, -4.5rem) scale(1) rotate(-9deg); }
                   }
                @keyframes stackInCenter {
                  from { opacity: 0; transform: translateY(40px) scale(0.9) rotate(0deg); }
                  to   { opacity: 1; transform: translateY(-8px) scale(1) rotate(3deg); }
                    }
                @keyframes stackInRight {
                  from { opacity: 0; transform: translate(4rem, 4.5rem) scale(0.9) rotate(0deg); }
                  to   { opacity: 1; transform: translate(4rem, 4.5rem) scale(1) rotate(9deg); }
                  }
              `}</style>
          </div>
        </div>
      </section>

      <section
        id="innovation"
        className="bg-slate-950 px-5 py-12 text-white md:px-8"
      >
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
            style={{
              padding:
                "clamp(0.65rem, 1.8vw, 1rem) clamp(1.1rem, 4vw, 1.75rem)",
              fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
            }}
          >
            Try Decision Engine Demo <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* previous version of the stats section with random emerald bg now commented out */}
      {/*<section className="bg-[#f7f8f5] px-5 py-6 md:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-[#bfd5cd] bg-[#eef7f2]/80 py-2 backdrop-blur-sm">
          <div className="px-6 py-5 text-center">
            <AnimatedStat value={35} suffix="%" label="Spoilage Avoided" />
          </div>
          <div className="px-6 py-5 text-center">
            <AnimatedStat value={94} suffix="%" label="AI Disease Accuracy" />
          </div>
          <div className="px-6 py-5 text-center">
            <AnimatedStat
              value={12.5}
              prefix="₹"
              suffix="K"
              label="Avg Profit Lift/Ton"
            />
          </div>
        </div>
      </section>*/}

      {/* New version of the stats section with a more subtle background and a grid overlay */}
      <section className="relative px-5 py-10 md:px-8">
        {/* Pretty horizontal divider — top edge of this section */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        {/* Cool-toned corner grids, kept subtle */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-6 -top-6 h-32 w-32"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(71,85,105,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,85,105,0.18) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 0% 0%, black 65%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 0% 0%, black 65%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(71,85,105,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,85,105,0.18) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 100% 100%, black 65%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 100% 100%, black 65%, transparent 100%)",
          }}
        />

        {/* Stats row — no dividing borders, uses gradient lines instead */}
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-3 bg-[#f7faf7]/80 py-2">
          {/* Small vertical gradient divider between stat 1 and 2 */}
          <div className="pointer-events-none absolute inset-y-0 left-1/3 my-auto h-[60%] w-px bg-gradient-to-b from-transparent via-[#5e3d30] to-transparent" />
          {/* Small vertical gradient divider between stat 2 and 3 */}
          <div className="pointer-events-none absolute inset-y-0 left-2/3 my-auto h-[60%] w-px bg-gradient-to-b from-transparent via-[#5e3d30] to-transparent" />

          <div className="px-6 py-5 text-center">
            <AnimatedStat value={35} suffix="%" label="Spoilage Avoided" />
          </div>
          <div className="px-6 py-5 text-center">
            <AnimatedStat value={94} suffix="%" label="AI Disease Accuracy" />
          </div>
          <div className="px-6 py-5 text-center">
            <AnimatedStat
              value={12.5}
              prefix="₹"
              suffix="K"
              label="Avg Profit Lift/Ton"
            />
          </div>
        </div>

        {/* Three questions section */}
        <div className="relative z-10 mx-auto mt-14 max-w-5xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-2xl font-black tracking-tight text-[#101a32] sm:text-3xl">
              Built around three questions
            </h3>
            <p className="max-w-xs text-sm text-slate-500 sm:text-right">
              The ones you actually ask yourself, every morning.
            </p>
          </div>

          <div className="mt-8 py-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black tracking-widest text-emerald-600">
                01
              </span>
              <h4 className="mt-3 text-lg font-black text-[#101a32]">
                Is it healthy?
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A photo of a leaf is enough. Sasyam names the problem and the
                exact dose to fix it, sized to your plot.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black tracking-widest text-emerald-600">
                02
              </span>
              <h4 className="mt-3 text-lg font-black text-[#101a32]">
                Is it ready?
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Growth stage, weather, and soil moisture, read together. Harvest
                timing stops being a guess.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black tracking-widest text-emerald-600">
                03
              </span>
              <h4 className="mt-3 text-lg font-black text-[#101a32]">
                What now?
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mandi price, storage cost, and spoilage risk, weighed for you.
                One answer: sell, store, or process.
              </p>
            </div>
          </div>
        </div>

        {/* Pretty horizontal divider — bottom edge of this section */}
        {/*<div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />*/}
      </section>

      {/* SECTION A — dark headline, becomes the entry point for #features */}
      <section
        id="features"
        className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white md:px-8 md:py-28"
      >
        {/* Edge-peeking grid — 4 corners + 2 random side spots, brighter lines for dark bg */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-4 -top-4 h-56 w-56"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 0% 0%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 0% 0%, black 30%, transparent 100%)",
            }}
          />
          <div
            className="absolute -right-4 -top-4 h-56 w-56"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 100% 0%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 100% 0%, black 30%, transparent 100%)",
            }}
          />
          <div
            className="absolute -bottom-4 -left-4 h-56 w-56"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 0% 100%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 0% 100%, black 30%, transparent 100%)",
            }}
          />
          <div
            className="absolute -bottom-4 -right-4 h-56 w-56"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 100% 100%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 100% 100%, black 30%, transparent 100%)",
            }}
          />
          {/* random side-margin peeks, not just corners */}
          <div
            className="absolute left-0 top-1/3 h-40 w-24"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 0% 50%, black 35%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 0% 50%, black 35%, transparent 100%)",
            }}
          />
          <div
            className="absolute right-0 top-2/3 h-36 w-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 100% 50%, black 35%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 100% 50%, black 35%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
              <Sparkles size={14} />
              One platform. Three journeys.
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              From planting to profit,
              <span className="block text-emerald-400">
                Sasyam AI stays with you.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Sasyam connects farmers, transporters, markets and storage into one
              intelligent decision platform.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
            <a
              href="#journey-farmer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
            >
              <Sprout size={16} />
              For Farmers
            </a>

            <a
              href="#journey-transporter"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
            >
              <LineChart size={16} />
              For Transport & Trade
            </a>

            <a
              href="#journey-warehouse"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
            >
              <Warehouse size={16} />
              For Warehouses
            </a>
          </div>
        </div>
      </section>

{/* SECTION B — light, journey/blob cards */}
<section
  onClick={handleFeaturesClick}
  className="relative overflow-hidden bg-[#f7faf7] px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14"
>
  {/* Edge-peeking grid — 4 corners + random side spots, cool slate tone */}
  <div
    aria-hidden
    className="absolute -top-4 -left-4 h-64 w-64 md:h-80 md:w-80"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.25) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 100% 100% at 0% 0%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 0% 0%, black 30%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute -top-4 -right-4 h-64 w-64 md:h-80 md:w-80"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.25) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 100% 100% at 100% 0%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 100% 0%, black 30%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute -bottom-4 -left-4 h-64 w-64 md:h-80 md:w-80"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.25) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 100% 100% at 0% 100%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 0% 100%, black 30%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute -bottom-4 -right-4 h-64 w-64 md:h-80 md:w-80"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.25) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 100% 100% at 100% 100%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 100% 100%, black 30%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute left-0 top-[35%] h-50 w-45"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.22) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 100% 100% at 0% 50%, black 35%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 0% 50%, black 35%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute left-0 top-[57%] h-40 w-24"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.22) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 100% 100% at 0% 50%, black 35%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 0% 50%, black 35%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute right-0 top-[65%] h-36 w-20"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.22) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 100% 100% at 100% 50%, black 35%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 100% 50%, black 35%, transparent 100%)" }}
  />
  <div
    aria-hidden
    className="absolute right-0 top-[30%] h-50 w-35"
    style={{ backgroundImage: "linear-gradient(to right, rgba(75,85,105,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(75,85,105,0.22) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 100% 100% at 100% 50%, black 35%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 100% 50%, black 35%, transparent 100%)" }}
  />


  {clickPulses.map((pulse) => (
    <div
      key={pulse.id}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(12, 93, 139, 0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(43, 17, 104, 0.7) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: `radial-gradient(circle 240px at ${pulse.x}px ${pulse.y}px, black 0%, black 45%, transparent 78%)`,
        WebkitMaskImage: `radial-gradient(circle 240px at ${pulse.x}px ${pulse.y}px, black 0%, black 45%, transparent 78%)`,
        animation: "gridShine 1.3s ease-out forwards",
      }}
    />
  ))}

  <style>{`
    @keyframes gridShine {
      from { opacity: 0; }
      15%  { opacity: 1; }
      to   { opacity: 0; }
    }
  `}</style>

  <div className="relative z-10 mx-auto max-w-6xl">

          <div className="relative mt-16">
            {/*<div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-emerald-200 to-transparent lg:block" />*/}

            {personaGroups.map((group) => {
              const stepsForPersona = journeySteps.filter(
                (step) => step.persona === group.persona,
              );

              if (stepsForPersona.length === 0) return null;

              return (
                <div key={group.id} id={group.id} className="scroll-mt-28">
                  <div
                    className={`relative z-10 mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] ${group.tone}`}
                  >
                    <group.Icon size={14} />
                    {group.label}
                  </div>

                  {stepsForPersona.map((step) => (
                    <WalkthroughStep
                      key={step.number}
                      number={step.number}
                      eyebrow={step.eyebrow}
                      title={step.title}
                      text={step.text}
                      points={step.points}
                      image={step.image}
                      imageAlt={step.imageAlt}
                      Icon={step.Icon}
                      tone={step.tone}
                      blob={step.blob}
                      decoration={step.decoration}
                      reverse={step.reverse}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-[#003d32] p-7 text-white shadow-xl shadow-emerald-950/10 sm:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  The complete journey
                </span>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                  Farm → Market → Storage → Better decisions
                </h3>

                <p className="mt-3 leading-7 text-emerald-50/75">
                  Sasyam AI connects the stages instead of treating them as
                  isolated tools. One continuous decision layer around the
                  produce.
                </p>
              </div>

              <Link
                to="/signup"
                className="flex w-fit shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-3.5 font-bold text-[#003d32] shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Start the journey
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-5 py-8 text-sm text-slate-300 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 md:flex-row">
          <p>
            <span className="font-bold text-emerald-400">✦ Sasyam</span> -
            Smart India Hackathon 2026 Prototype
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
