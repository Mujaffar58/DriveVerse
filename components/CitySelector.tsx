// components/CitySelector.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CitySelector — Auto PIN detect
 * - Uses geolocation
 * - Reverse-geocodes to obtain postcode (if available)
 * - If postcode found, calls api.postalpincode.in to get District -> map to AVAILABLE_CITIES
 * - If postcode not available, falls back to progressive reverse-geocode to find city/town/village
 * - Sanitizes saved value on mount (clears suburbs/areas)
 */

const AVAILABLE_CITIES = [
  "Delhi",
  "Mumbai",
  "Ahmedabad",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
];

function normalizeName(s?: string) {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/district|district of|division|nagarpalika|municipality/gi, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

function findBestMatch(detected: string | null | undefined) {
  if (!detected) return null;
  const norm = normalizeName(detected);
  const exact = AVAILABLE_CITIES.find((c) => c.toLowerCase() === norm);
  if (exact) return exact;
  const includes = AVAILABLE_CITIES.find(
    (c) => norm.includes(c.toLowerCase()) || c.toLowerCase().includes(norm)
  );
  if (includes) return includes;
  const starts = AVAILABLE_CITIES.find((c) =>
    c.toLowerCase().startsWith(norm.slice(0, 4))
  );
  if (starts) return starts;
  return null;
}

function makeSuggestions(detected?: string | null) {
  if (!detected) return [];
  const norm = normalizeName(detected);
  const suggestions = AVAILABLE_CITIES.filter((c) => {
    const cn = c.toLowerCase();
    if (norm.includes(cn) || cn.includes(norm)) return true;
    if (cn.startsWith(norm.slice(0, Math.min(4, norm.length)))) return true;
    if (norm.split(" ").some((token) => cn.includes(token))) return true;
    return false;
  });
  return Array.from(new Set(suggestions)).slice(0, 5);
}

export default function CitySelector() {
  const [city, setCity] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const suggestionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // sanitize + load saved on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem("driveverse_city");
        const cookieMatch = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("driveverse_city="));
        const cookieVal = cookieMatch ? decodeURIComponent(cookieMatch.split("=")[1]) : null;
        const candidate = saved || cookieVal;

        if (candidate) {
          if (AVAILABLE_CITIES.includes(candidate)) {
            setCity(candidate);
            return;
          }
          const mapped = findBestMatch(candidate);
          if (mapped) {
            setCity(mapped);
            localStorage.setItem("driveverse_city", mapped);
            document.cookie = `driveverse_city=${encodeURIComponent(mapped)}; path=/;`;
            return;
          }

          const isLikelyCity = /^[A-Za-z\s]{2,40}$/.test(candidate) && candidate.trim().length > 2;
          if (isLikelyCity) {
            setCity(candidate);
            return;
          }

          localStorage.removeItem("driveverse_city");
          try {
            document.cookie = "driveverse_city=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          } catch {}
        }

        // best-effort clear caches + SWs
        if ("serviceWorker" in navigator) {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) {
              try { await r.unregister(); } catch {}
            }
          } catch {}
        }
        if ("caches" in window) {
          try {
            const keys = await caches.keys();
            for (const k of keys) {
              try { await caches.delete(k); } catch {}
            }
          } catch {}
        }
      } catch (err) {
        console.warn("CitySelector sanitize failed", err);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      if (city) localStorage.setItem("driveverse_city", city);
      else localStorage.removeItem("driveverse_city");
    } catch {}
  }, [city]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      const target = e.target as Node;
      if (!rootRef.current.contains(target)) {
        setOpen(false);
        setShowList(false);
        setSuggestions([]);
        setInlineError(null);
        setHighlightIndex(0);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setShowList(false);
        setSuggestions([]);
        setInlineError(null);
      } else if (e.key === "Enter" && open) {
        if (suggestions.length > 0) {
          const pick = suggestions[highlightIndex];
          if (pick) {
            setCity(pick);
            setOpen(false);
            setShowList(false);
            setSuggestions([]);
            setHighlightIndex(0);
          }
        } else {
          setShowList((s) => !s);
        }
      } else if (e.key === "ArrowDown" && (open || showList)) {
        if (suggestions.length > 0) setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp" && (open || showList)) {
        if (suggestions.length > 0) setHighlightIndex((i) => Math.max(i - 1, 0));
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, showList, suggestions, highlightIndex]);

  useEffect(() => {
    const el = suggestionRefs.current[highlightIndex];
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlightIndex]);

  // helper: reverse geocode via Nominatim
  async function revGeocodeLatLon(lat: number, lon: number, zoom = 18, format = "json") {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=${format}&zoom=${zoom}&addressdetails=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  }

  // helper: lookup pin via postal API
  async function lookupPin(pincode: string) {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!res.ok) return null;
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) return null;
      const entry = json[0];
      if (!entry || entry.Status !== "Success" || !entry.PostOffice || entry.PostOffice.length === 0) return null;
      return entry.PostOffice[0]; // first PostOffice
    } catch (err) {
      console.warn("PIN lookup failed", err);
      return null;
    }
  }

  // MAIN: auto-detect using geolocation -> try PIN -> fallback progressive city detection
  const detectCity = () => {
    setInlineError(null);
    setLoading(true);
    setSuggestions([]);
    setHighlightIndex(0);

    if (!("geolocation" in navigator)) {
      setInlineError("Geolocation not available.");
      setOpen(true);
      setShowList(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          // 1) First try quick reverse for postcode
          let data = await revGeocodeLatLon(latitude, longitude, 18, "json");
          let postcode = data?.address?.postcode ?? null;

          // some responses put postcode in other fields for jsonv2 — try jsonv2 if missing
          if (!postcode) {
            const d2 = await revGeocodeLatLon(latitude, longitude, 16, "jsonv2");
            postcode = d2?.address?.postcode ?? null;
          }

          // If postcode found and looks like 6-digit, try postal API
          if (postcode && /^\d{6}$/.test(postcode)) {
            const po = await lookupPin(postcode);
            if (po) {
              const district = po.District || po.Region || po.Block || po.Circle || "";
              const state = po.State || "";
              const candidate = district || state || null;

              const matched = findBestMatch(candidate);
              if (matched) {
                setCity(matched);
                setOpen(false);
                setShowList(false);
                setInlineError(null);
                setLoading(false);
                return;
              } else if (candidate && /^[A-Za-z\s]{2,40}$/.test(candidate)) {
                // candidate looks city-like — accept it
                setCity(candidate);
                setOpen(false);
                setShowList(false);
                setInlineError(null);
                setLoading(false);
                return;
              } else {
                // couldn't map PIN -> open suggestions/full list
                const s = makeSuggestions(candidate);
                if (s.length > 0) {
                  setSuggestions(s);
                  setHighlightIndex(0);
                  setOpen(true);
                  setShowList(false);
                  setInlineError(null);
                  setLoading(false);
                  return;
                }
                // fall through to progressive detection
              }
            } else {
              // postal API returned nothing useful — fall through to progressive detection
            }
          }

          // 2) Fallback: progressive reverse geocode (same logic as before)
          // prefer these keys as city-level
          const preferCityKeys = [
            "city",
            "town",
            "village",
            "municipality",
            "city_district",
            "county",
            "state_district",
          ];
          const zoomLevels = [18, 16, 14, 12];

          let finalDetected: string | null = null;
          let finalKind: string | null = null;

          for (const z of zoomLevels) {
            const d = await revGeocodeLatLon(latitude, longitude, z, "json");
            if (!d?.address) continue;

            for (const k of preferCityKeys) {
              if (d.address[k]) {
                finalDetected = d.address[k];
                finalKind = k;
                break;
              }
            }
            if (finalDetected) break;

            if (d.address["suburb"] || d.address["neighbourhood"]) {
              finalDetected = d.address["suburb"] || d.address["neighbourhood"];
              finalKind = d.address["suburb"] ? "suburb" : "neighbourhood";
            }
          }

          // if only suburb found, attempt coarse parent lookup
          if (finalKind && (finalKind === "suburb" || finalKind === "neighbourhood")) {
            const parent = await revGeocodeLatLon(latitude, longitude, 10, "json");
            if (parent?.address) {
              for (const k of preferCityKeys) {
                if (parent.address[k]) {
                  finalDetected = parent.address[k];
                  finalKind = k;
                  break;
                }
              }
            }
          }

          const matched = findBestMatch(finalDetected);
          if (matched) {
            setCity(matched);
            setOpen(false);
            setShowList(false);
            setInlineError(null);
          } else if (
            finalDetected &&
            finalKind &&
            ["city", "town", "village", "municipality", "city_district"].includes(finalKind)
          ) {
            setCity(finalDetected);
            setOpen(false);
            setShowList(false);
            setInlineError(null);
          } else {
            const s = makeSuggestions(finalDetected);
            if (s.length > 0) {
              setSuggestions(s);
              setHighlightIndex(0);
              setOpen(true);
              setShowList(false);
              setInlineError(null);
            } else {
              setSuggestions([]);
              setOpen(true);
              setShowList(true);
              setInlineError("Auto-detect couldn't find a proper city. Please choose from the list.");
            }
          }
        } catch (err) {
          console.error("detectCity error:", err);
          setInlineError("Reverse geocoding or PIN lookup failed. Please choose manually.");
          setOpen(true);
          setShowList(true);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setInlineError("Location permission denied or unavailable.");
        setOpen(true);
        setShowList(true);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60_000 }
    );
  };

  // UI (keeps previous popup + suggestions + full list)
  return (
    <div ref={rootRef} className="relative" aria-label="city-selector">
      <button
        onClick={() => {
          setOpen((s) => !s);
          setShowList(false);
          setSuggestions([]);
          setInlineError(null);
          setHighlightIndex(0);
        }}
        className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-white/5 transition text-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21s-8-5.686-8-11a8 8 0 1 1 16 0c0 5.314-8 11-8 11z"></path>
          <circle cx="12" cy="10" r="2.5"></circle>
        </svg>
        <span className="whitespace-nowrap">{city ? city : "Select City"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[#0b0b0d] border border-gray-800 rounded-lg shadow-lg p-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <div><div className="text-xs text-gray-400">Choose city</div></div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCity("");
                  try { localStorage.removeItem("driveverse_city"); } catch {}
                  try { document.cookie = "driveverse_city=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; } catch {}
                  setOpen(false);
                }}
                className="text-xs text-gray-400 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          {inlineError && <div className="mb-2 text-sm text-yellow-300">{inlineError}</div>}

          {suggestions.length > 0 ? (
            <div className="mb-2">
              <div className="text-xs text-gray-400 mb-2">Did you mean</div>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <div
                    key={s}
                    ref={(el) => (suggestionRefs.current[idx] = el)}
                    onClick={() => {
                      setCity(s);
                      setOpen(false);
                      setShowList(false);
                      setSuggestions([]);
                      setHighlightIndex(0);
                    }}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    className={`px-3 py-2 text-sm cursor-pointer rounded ${idx === highlightIndex ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/5"}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">Tap a suggestion or choose another city from the list.</div>
            </div>
          ) : null}

          <div className="relative">
            <button
              onClick={() => {
                setShowList((s) => !s);
                setSuggestions([]);
                setInlineError(null);
              }}
              className="w-full px-3 py-2 rounded bg-transparent border border-gray-700 text-white text-sm flex items-center justify-between"
            >
              <span>{city ? city : "-- Select City --"}</span>
              <span className="text-gray-400 ml-2">▾</span>
            </button>

            {showList && (
              <div className="absolute mt-1 w-full max-h-48 overflow-y-auto bg-[#0f0f11] border border-gray-700 rounded-lg shadow-lg z-50">
                {AVAILABLE_CITIES.map((c) => (
                  <div
                    key={c}
                    onClick={() => { setCity(c); setOpen(false); setShowList(false); setSuggestions([]); setInlineError(null); setHighlightIndex(0); }}
                    className="px-3 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              onClick={detectCity}
              disabled={loading}
              className="w-full px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition"
            >
              {loading ? "Detecting..." : "Auto detect my city"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
