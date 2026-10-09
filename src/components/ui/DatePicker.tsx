"use client";

import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  id?: string;
  name: string;
  value?: string; // YYYY-MM-DD
  defaultValue?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
  maxDate?: string; // YYYY-MM-DD
  minDate?: string; // YYYY-MM-DD
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseIso(val?: string): { year: number; month: number; day: number } | null {
  if (!val || typeof val !== "string") return null;
  const parts = val.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

function formatIso(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function DatePicker({
  id,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  required = false,
  minYear = 1940,
  maxYear = new Date().getFullYear(),
  maxDate,
  minDate,
  placeholder = "Select date...",
  className = "",
  disabled = false,
}: DatePickerProps) {
  const initial = parseIso(controlledValue || defaultValue);
  const today = new Date();

  const [internalDate, setInternalDate] = useState<string>(defaultValue || "");
  const selectedDate = controlledValue !== undefined ? controlledValue : internalDate;
  const [isOpen, setIsOpen] = useState(false);

  // Month and Year currently being viewed in the calendar popup
  const [viewYear, setViewYear] = useState<number>(
    initial?.year ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    initial?.month ?? today.getMonth()
  );

  // Adjust view during render if controlledValue changes
  const [prevControlled, setPrevControlled] = useState(controlledValue);
  if (controlledValue !== prevControlled) {
    setPrevControlled(controlledValue);
    const parsed = parseIso(controlledValue);
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar popover on outside click or Esc
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectDay = (day: number) => {
    const formatted = formatIso(viewYear, viewMonth, day);
    setInternalDate(formatted);
    onChange?.(formatted);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      if (viewYear > minYear) {
        setViewYear(viewYear - 1);
        setViewMonth(11);
      }
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setViewYear(viewYear + 1);
        setViewMonth(0);
      }
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSetToday = () => {
    const now = new Date();
    const formatted = formatIso(now.getFullYear(), now.getMonth(), now.getDate());
    setInternalDate(formatted);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onChange?.(formatted);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInternalDate("");
    onChange?.("");
    setIsOpen(false);
  };

  // Generate Year dropdown options
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  // Days in current view month
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const parsedSelected = parseIso(selectedDate);

  const displayString = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden input to ensure FormData gets the exact YYYY-MM-DD */}
      <input
        type="hidden"
        name={name}
        id={id}
        value={selectedDate}
        required={required}
      />

      {/* Clickable input trigger */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`flex w-full cursor-pointer items-center justify-between rounded-sm border bg-obsidian-950 px-3 py-2 text-xs transition-colors ${
          isOpen
            ? "border-gold-500 ring-1 ring-gold-500/50"
            : "border-charcoal-500 hover:border-gold-500/60"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={displayString ? "text-ivory-100 font-medium" : "text-graphite-400"}>
          {displayString || placeholder}
        </span>
        <span className="flex items-center gap-1.5 text-gold-400">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-[310px] rounded-sm border border-gold-500/40 bg-obsidian-950 p-4 shadow-2xl backdrop-blur-md">
          {/* Header with Quick Month/Year Dropdowns & Nav Arrows */}
          <div className="flex items-center justify-between gap-1 border-b border-charcoal-700 pb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="cursor-pointer rounded-xs p-1 text-graphite-300 hover:bg-charcoal-800 hover:text-ivory-100"
              aria-label="Previous month"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-900 px-2 py-1 text-xs font-semibold text-ivory-100 focus:border-gold-500 focus:outline-none"
              >
                {MONTH_NAMES.map((mName, idx) => (
                  <option key={mName} value={idx}>
                    {mName}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-900 px-2 py-1 text-xs font-semibold text-gold-400 focus:border-gold-500 focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="cursor-pointer rounded-xs p-1 text-graphite-300 hover:bg-charcoal-800 hover:text-ivory-100"
              aria-label="Next month"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Days of week header */}
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-semibold tracking-wider text-graphite-400">
            {DAYS_SHORT.map((dayName) => (
              <div key={dayName} className="py-1">
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-1" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isoDay = formatIso(viewYear, viewMonth, dayNum);

              const isSelected =
                parsedSelected?.year === viewYear &&
                parsedSelected?.month === viewMonth &&
                parsedSelected?.day === dayNum;

              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === dayNum;

              const isPastMax = maxDate && isoDay > maxDate;
              const isBeforeMin = minDate && isoDay < minDate;
              const isDayDisabled = Boolean(isPastMax || isBeforeMin);

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={isDayDisabled}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-xs text-xs transition-all ${
                    isSelected
                      ? "border border-gold-500 bg-gold-500 font-bold text-obsidian-950 shadow-md"
                      : isToday
                      ? "border border-gold-500/50 text-gold-400 hover:bg-charcoal-800"
                      : isDayDisabled
                      ? "opacity-25 cursor-not-allowed text-graphite-600"
                      : "text-ivory-100 hover:bg-charcoal-800 hover:text-gold-300"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Bottom Controls: Today / Clear */}
          <div className="mt-3 flex items-center justify-between border-t border-charcoal-700 pt-2.5 text-[0.68rem]">
            <button
              type="button"
              onClick={handleSetToday}
              className="cursor-pointer text-gold-400 hover:underline uppercase tracking-wider font-semibold"
            >
              Select Today
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer text-graphite-400 hover:text-red-400 uppercase tracking-wider"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
