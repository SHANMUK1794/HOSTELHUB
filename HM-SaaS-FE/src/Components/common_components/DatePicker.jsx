import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const DatePicker = ({ selectedYearMonth, onChange, containerClass }) => {
  const currentYear = new Date().getFullYear();

  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const currentMonth = monthNames[new Date().getMonth()];
  const initialYear = selectedYearMonth?.split("-")[0] || String(currentYear);
  const initialMonth =
    typeof selectedYearMonth === "string" && selectedYearMonth.includes("-")
      ? selectedYearMonth.split("-")[1] || currentMonth
      : currentMonth;

  const [year, setYear] = useState(initialYear || "all");
  const [month, setMonth] = useState(initialMonth || "all");
  const [openYear, setOpenYear] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);

  useEffect(() => {
    if (!selectedYearMonth) {
      onChange(`${initialYear}-${initialMonth}`);
    }
  }, [selectedYearMonth, initialYear, initialMonth, onChange]);

  const handleChange = (newYear, newMonth) => {
    onChange(`${newYear}-${newMonth}`);
  };

  const minYear = 2017;
  const maxYear = currentYear;

  const years = [
    { label: "All Years", value: "all" },
    ...Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
      const y = maxYear - i;
      return { label: String(y), value: String(y) };
    }),
  ];

  const months = [
    { label: "All Months", value: "all" },
    ...monthNames.map((m) => ({
      label: m.charAt(0).toUpperCase() + m.slice(1),
      value: m,
    })),
  ];

  const selectedYearLabel =
    years.find((y) => y.value === year)?.label || "All Years";
  const selectedMonthLabel =
    months.find((m) => m.value === month)?.label || "All Months";

  return (
    <div
      className={containerClass || "flex items-center gap-3 font-montserrat"}
    >
      {/* ── YEAR ── */}
      <div className="relative w-[100px]">
        <div
          onClick={() => setOpenYear(!openYear)}
          className="flex items-center justify-center gap-1 rounded-[8px] h-[40px] text-[14px] font-medium cursor-pointer hover:opacity-90 transition-all"
          style={{
            background: "var(--theme-secondary-card-bg)",
            color: "var(--theme-primary-text)",
          }}
        >
          {selectedYearLabel}
          <FaChevronDown className="text-[12px]" />
        </div>

        {openYear && (
          <div
            className="absolute top-[45px] left-0 w-full rounded-[10px] shadow-lg z-50 max-h-[200px] overflow-y-auto scrollbar-hide"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid #DFDFDF",
            }}
          >
            {years.map((y) => (
              <div
                key={y.value}
                onClick={() => {
                  setYear(y.value);
                  setOpenYear(false);
                  handleChange(y.value, month);
                }}
                className="px-3 py-2 text-[13px] cursor-pointer rounded-md mx-1 my-1 transition-all"
                style={{ color: "var(--theme-primary-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--theme-secondary-card-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {y.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MONTH ── */}
      <div className="relative w-[130px]">
        <div
          onClick={() => setOpenMonth(!openMonth)}
          className="flex items-center justify-center gap-1 rounded-[8px] h-[40px] text-[14px] font-medium cursor-pointer hover:opacity-90 transition-all"
          style={{
            background: "var(--theme-secondary-card-bg)",
            color: "var(--theme-primary-text)",
          }}
        >
          {selectedMonthLabel}
          <FaChevronDown className="text-[12px]" />
        </div>

        {openMonth && (
          <div
            className="absolute top-[45px] left-0 w-full rounded-[10px] shadow-lg z-50 max-h-[200px] overflow-y-auto scrollbar-hide"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid #DFDFDF",
            }}
          >
            {months.map((m) => (
              <div
                key={m.value}
                onClick={() => {
                  setMonth(m.value);
                  setOpenMonth(false);
                  handleChange(year, m.value);
                }}
                className="px-3 py-2 text-[13px] cursor-pointer rounded-md mx-1 my-1 transition-all"
                style={{ color: "var(--theme-primary-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--theme-secondary-card-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {m.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
