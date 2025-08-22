import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Phone, User, CupSoda, Milk, IceCream, Cat, Sparkles } from "lucide-react";
import './index.css'

// =====================
// Inline SVG Asset: Chibi Cat
// Reusable, color-customizable SVG cats for bases and toppings.
// =====================
const ChibiCat = ({
  color = "#90caf9",
  accent = "#ffffff",
  size = 96,
  badgeText,
  blush = "#ffb3c1",
  wink = false,
  accessory,
  className = "",
}) => {
  const s = size;
  const earW = s * 0.25;
  const earH = s * 0.25;
  const faceR = s * 0.42;
  const cx = s / 2;
  const cy = s / 2 + s * 0.05;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      aria-hidden
    >
      {/* Ears */}
      <path d={`M ${cx - faceR * 0.9} ${cy - faceR * 0.6} l ${-earW} ${-earH} l ${earW * 1.2} ${0} z`} fill={color} />
      <path d={`M ${cx + faceR * 0.9} ${cy - faceR * 0.6} l ${earW} ${-earH} l ${-earW * 1.2} ${0} z`} fill={color} />
      {/* Face */}
      <circle cx={cx} cy={cy} r={faceR} fill={color} />
      {/* Eyes */}
      {wink ? (
        <>
          <path d={`M ${cx - faceR * 0.35} ${cy - faceR * 0.05} q ${faceR * 0.12} ${faceR * 0.1} ${faceR * 0.24} 0`} stroke="#222" strokeWidth={2} fill="none" strokeLinecap="round" />
          <circle cx={cx + faceR * 0.28} cy={cy - faceR * 0.05} r={faceR * 0.09} fill="#222" />
        </>
      ) : (
        <>
          <circle cx={cx - faceR * 0.28} cy={cy - faceR * 0.05} r={faceR * 0.09} fill="#222" />
          <circle cx={cx + faceR * 0.28} cy={cy - faceR * 0.05} r={faceR * 0.09} fill="#222" />
        </>
      )}
      {/* Nose + Mouth */}
      <circle cx={cx} cy={cy + faceR * 0.05} r={faceR * 0.04} fill="#222" />
      <path d={`M ${cx} ${cy + faceR * 0.08} q ${faceR * 0.1} ${faceR * 0.14} ${faceR * 0.2} 0`} stroke="#222" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M ${cx} ${cy + faceR * 0.08} q ${-faceR * 0.1} ${faceR * 0.14} ${-faceR * 0.2} 0`} stroke="#222" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx={cx - faceR * 0.38} cy={cy + faceR * 0.16} rx={faceR * 0.14} ry={faceR * 0.07} fill={blush} opacity={0.7} />
      <ellipse cx={cx + faceR * 0.38} cy={cy + faceR * 0.16} rx={faceR * 0.14} ry={faceR * 0.07} fill={blush} opacity={0.7} />
      {/* Accessory (e.g., strawberry, cream dollop) */}
      {accessory}
      {/* Badge */}
      {badgeText && (
        <g>
          <rect x={cx - faceR * 0.45} y={cy + faceR * 0.55} rx={faceR * 0.15} ry={faceR * 0.15} width={faceR * 0.9} height={faceR * 0.32} fill={accent} stroke="#222" strokeWidth={1.5} />
          <text x={cx} y={cy + faceR * 0.75} textAnchor="middle" fontSize={faceR * 0.22} fontWeight="700" fill="#222" fontFamily="ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial">
            {badgeText}
          </text>
        </g>
      )}
    </svg>
  );
};

// Accessories (tiny vector toppings)
const StrawberryAccessory = ({ cx = 72, cy = 20 }) => (
  <g transform={`translate(${cx - 12}, ${cy - 14})`}>
    <ellipse cx={12} cy={14} rx={12} ry={10} fill="#ff5b7e" stroke="#222" strokeWidth={1.5} />
    <path d="M12 2 l6 6 h-12 z" fill="#6fcf97" stroke="#222" strokeWidth={1.5} />
    <circle cx={7} cy={16} r={1.2} fill="#ffd9e1" />
    <circle cx={12} cy={12} r={1.2} fill="#ffd9e1" />
    <circle cx={16} cy={17} r={1.2} fill="#ffd9e1" />
  </g>
);

const CreamDollop = ({ cx = 72, cy = 20, color = "#fff0f6" }) => (
  <g transform={`translate(${cx - 14}, ${cy - 12})`}>
    <path d="M2 18 C2 12, 8 4, 14 8 C18 10, 22 14, 22 18 Z" fill={color} stroke="#222" strokeWidth={1.5} />
  </g>
);

// =====================
// UI Helpers
// =====================
const Section = ({ title, subtitle, children }) => (
  <div className="space-y-3">
    <div>
      <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> {title}
      </h2>
      {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const Chip = ({ selected, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border transition-all text-sm font-medium outline-none focus:ring-2 ${
      selected
        ? "bg-pink-100 border-pink-400 ring-pink-300"
        : "bg-white hover:bg-neutral-50 border-neutral-200"
    }`}
  >
    <div className="flex items-center gap-2">{children}{selected && <Check className="w-4 h-4" />}</div>
  </button>
);

// =====================
// Main App
// =====================
export default function HanamoOrderApp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [base, setBase] = useState(null); // 'matcha' | 'viet'
  const [milk, setMilk] = useState("whole");
  const [toppings, setToppings] = useState([]); // ['strawberry','ube','egg','salted']
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Persist lightweight draft to storage for back/refresh protection
  useEffect(() => {
    const saved = localStorage.getItem("hanamo_draft");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setName(d.name || "");
        setPhone(d.phone || "");
        setBase(d.base || null);
        setMilk(d.milk || "whole");
        setToppings(d.toppings || []);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const payload = { name, phone, base, milk, toppings };
    localStorage.setItem("hanamo_draft", JSON.stringify(payload));
  }, [name, phone, base, milk, toppings]);

  const toggleTopping = (key) => {
    setToppings((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const validPhone = (v) => /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(v.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name ✨");
    if (!validPhone(phone)) return alert("Please enter a valid phone number ✨");
    if (!base) return alert("Please choose Matcha or Viet Coffee ✨");

    const id = `HANA-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setOrderId(id);
    setSubmitted(true);

    // In real use: POST to your backend/Google Sheet/etc.
    // fetch("/api/order", { method: "POST", body: JSON.stringify({...}) })
  };

  const reset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setBase(null);
    setMilk("whole");
    setToppings([]);
    localStorage.removeItem("hanamo_draft");
  };

  const brand = "Hanamo Home Cafe";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-pink-50 to-white text-neutral-900">
      <div className="max-w-xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChibiCat size={56} color="#ffd1dc" accent="#fff" wink accessory={<StrawberryAccessory />} />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{brand}</h1>
              <p className="text-xs text-neutral-500">Cute drinks. Happy hearts. ♡</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-wider text-neutral-400">Pop-up Ordering</p>
            <p className="text-sm font-medium">Skip the line</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border p-5 sm:p-6 space-y-7"
            >
              {/* Name & Phone */}
              <Section title="Who is this order for?" subtitle="We’ll text when it’s ready!">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-200">
                    <User className="w-4 h-4 text-neutral-500" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent outline-none text-sm"
                      aria-label="Name"
                      required
                    />
                  </label>
                  <label className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-200">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      inputMode="tel"
                      className="w-full bg-transparent outline-none text-sm"
                      aria-label="Phone number"
                      required
                    />
                  </label>
                </div>
              </Section>

              {/* Base */}
              <Section title="Choose your base" subtitle="Pick one">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBase("matcha")}
                    className={`group relative rounded-2xl border p-3 bg-white hover:shadow transition-all text-left ${
                      base === "matcha" ? "ring-2 ring-green-300 border-green-300" : "border-neutral-200"
                    }`}
                    aria-pressed={base === "matcha"}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Matcha</p>
                        <p className="text-xs text-neutral-500">earthy, vibrant</p>
                      </div>
                      <ChibiCat
                        size={80}
                        color="#a7f3d0"
                        accent="#ecfeff"
                        blush="#fecaca"
                        accessory={<CreamDollop color="#e8fff1" />}
                        className="drop-shadow-sm"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      {base === "matcha" && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBase("viet")}
                    className={`group relative rounded-2xl border p-3 bg-white hover:shadow transition-all text-left ${
                      base === "viet" ? "ring-2 ring-amber-300 border-amber-300" : "border-neutral-200"
                    }`}
                    aria-pressed={base === "viet"}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Viet Coffee</p>
                        <p className="text-xs text-neutral-500">bold, sweet</p>
                      </div>
                      <ChibiCat
                        size={80}
                        color="#f5deb3"
                        accent="#fff7ed"
                        blush="#ffd1b3"
                        wink
                        accessory={<CreamDollop color="#fff7ed" />}
                        className="drop-shadow-sm"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      {base === "viet" && <Check className="w-5 h-5 text-amber-600" />}
                    </div>
                  </button>
                </div>
              </Section>

              {/* Milk */}
              <Section title="Milk" subtitle="Choose one">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "whole", label: "Whole milk" },
                    { key: "oat", label: "Oat milk" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMilk(m.key)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium bg-white flex items-center justify-center gap-2 ${
                        milk === m.key ? "ring-2 ring-pink-300 border-pink-300" : "border-neutral-200"
                      }`}
                      aria-pressed={milk === m.key}
                    >
                      <Milk className="w-4 h-4" /> {m.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Toppings */}
              <Section title="Toppings" subtitle="Tap to add (optional)">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 border rounded-2xl p-3 bg-white">
                    <ChibiCat size={64} color="#ffd1dc" accessory={<StrawberryAccessory />} />
                    <Chip selected={toppings.includes("strawberry")} onClick={() => toggleTopping("strawberry")}>
                      Strawberry
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 border rounded-2xl p-3 bg-white">
                    <ChibiCat size={64} color="#e9d5ff" accessory={<CreamDollop color="#e9d5ff" />} />
                    <Chip selected={toppings.includes("ube")} onClick={() => toggleTopping("ube")}>
                      Ube cream
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 border rounded-2xl p-3 bg-white">
                    <ChibiCat size={64} color="#fff7cc" accessory={<CreamDollop color="#fff7cc" />} />
                    <Chip selected={toppings.includes("egg")} onClick={() => toggleTopping("egg")}>
                      Egg cream
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 border rounded-2xl p-3 bg-white">
                    <ChibiCat size={64} color="#dbeafe" accessory={<CreamDollop color="#eef2ff" />} />
                    <Chip selected={toppings.includes("salted")} onClick={() => toggleTopping("salted")}>
                      Salted cream
                    </Chip>
                  </div>
                </div>
              </Section>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow hover:shadow-md active:scale-[0.99] transition-all"
                >
                  Submit Order ♡
                </button>
              </div>

              {/* Footer note */}
              <p className="text-[11px] text-center text-neutral-500">By submitting, you consent to a text about your order status.</p>
            </motion.form>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border p-6 space-y-6 text-center"
            >
              <div className="flex justify-center">
                <ChibiCat size={120} color="#c7f9cc" wink accessory={<CreamDollop color="#f0fff4" />} />
              </div>
              <h2 className="text-xl font-extrabold">Order placed! ✨</h2>
              <p className="text-sm text-neutral-600">
                Thanks, <span className="font-semibold">{name}</span> — we got your order.
              </p>

              <div className="text-left bg-neutral-50 border rounded-xl p-4 space-y-2">
                <Row label="Order ID" value={orderId} />
                <Row label="Pickup Name" value={name} />
                <Row label="Phone" value={phone} />
                <Row label="Base" value={base === "matcha" ? "Matcha" : "Viet Coffee"} />
                <Row label="Milk" value={milk === "oat" ? "Oat" : "Whole"} />
                <Row label="Toppings" value={toppings.length ? prettyToppings(toppings) : "None"} />
              </div>

              <p className="text-sm text-neutral-600">Show this screen to the barista when you reach the counter. We’ll text you when it’s ready ♡</p>

              <div className="flex gap-3 justify-center">
                <button onClick={reset} className="px-4 py-2 rounded-xl border bg-white hover:bg-neutral-50">Place another order</button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
                >
                  Print receipt
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tiny sticky footer */}
        <div className="mt-6 text-center text-[11px] text-neutral-400">© {new Date().getFullYear()} {brand} · chibi cats by inline SVG</div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function prettyToppings(keys) {
  const map = {
    strawberry: "Strawberry",
    ube: "Ube cream",
    egg: "Egg cream",
    salted: "Salted cream",
  };
  return keys.map((k) => map[k]).join(", ");
}

// Tailwind utility suggestion (add to your project):
// - Ensure Tailwind is enabled. This component assumes Tailwind CSS is configured.
