import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { useTheme } from "../../hooks/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

const ExpenseOverview = () => {
  const navigate = useNavigate();
  const getBranchName = useSelector((state) => state.branch.selectedBranch);
  const tenantBranches =
    useSelector((state) => state.branch.tenantBranches) || [];
  const { theme } = useTheme();

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyExpenses: [],
    yearlyExpenses: [],
    comparativeExpenses: [],
  });

  const availableYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027];

  // Use branch colors from mockup: Orange, Purple, Cyan. Plus some fallbacks.
  const branchColors = [
    "#F2762A",
    "#8152F0",
    "#3BDFB4",
    "#F43F5E",
    "#3B82F6",
    "#EAB308",
  ];

  useEffect(() => {
    if (getBranchName) setSelectedBranch(getBranchName);
  }, [getBranchName]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBranch) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/api/v1/daily_expense/overview?branchName=${selectedBranch}&year=${selectedYear}`,
        );
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch expense overview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBranch, selectedYear]);

  // Always render a Bar and Legend item for every tenant branch, even if they have 0 expenses
  const comparativeBranches = tenantBranches;

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans pb-20"
      style={{
        background: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-secondary)",
      }}
    >
      <div
        className="max-w-[1400px] mx-auto rounded-[30px] p-6 md:p-10 shadow-sm"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: "var(--theme-accent)" }}
            >
              ←
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--theme-accent)" }}
            >
              {selectedBranch || "Select Branch"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-full font-medium outline-none cursor-pointer px-4 py-2.5"
              style={{
                background: "var(--theme-card-bg)",
                border: "1px solid #D1D5DB",
                color: "var(--theme-primary-text)",
              }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="rounded-full font-medium outline-none cursor-pointer px-5 py-2.5"
              style={{
                background: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              {tenantBranches.map((b, idx) => (
                <option key={idx} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div
            className="h-[600px] flex items-center justify-center font-semibold text-xl"
            style={{ color: "var(--theme-accent)" }}
          >
            Loading...
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Top Row: Monthly & Yearly */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Annual Monthly Expense */}
              <div className="w-full">
                <div className="mb-6">
                  <h2
                    className="text-[20px] font-bold pl-3"
                    style={{
                      color: "var(--theme-heading-text)",
                      borderLeft: "4px solid var(--theme-accent)",
                    }}
                  >
                    EXPENSE OVERVIEW
                  </h2>
                  <p
                    className="mt-1 ml-4 text-[15px]"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Annual Monthly Expense({selectedYear})
                  </p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.monthlyExpenses}
                      margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                      barSize={20}
                    >
                      <CartesianGrid strokeDasharray="5 5" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#4B5563", fontSize: 13 }}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={(val) => val.toLocaleString("en-IN")}
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#4B5563", fontSize: 13 }}
                        dx={-10}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {data.monthlyExpenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={theme.accent} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Yearly Expense Line Chart */}
              <div className="w-full">
                <div className="mb-6">
                  <h2
                    className="text-[20px] font-bold pl-3"
                    style={{
                      color: "var(--theme-heading-text)",
                      borderLeft: "4px solid var(--theme-accent)",
                    }}
                  >
                    EXPENSE OVERVIEW
                  </h2>
                  <p
                    className="mt-1 ml-4 text-[15px]"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Yearly Expense
                  </p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.yearlyExpenses}
                      margin={{ top: 30, right: 30, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="5 5" vertical={false} />
                      <XAxis
                        dataKey="year"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#4B5563", fontSize: 13 }}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={(val) => val.toLocaleString("en-IN")}
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#4B5563", fontSize: 13 }}
                        dx={-10}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Line
                        type="linear"
                        dataKey="total"
                        stroke={theme.accent}
                        strokeWidth={3}
                        dot={{
                          fill: theme.accent,
                          r: 6,
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Row: Comparative Yearly Expense */}
            <div className="w-full mt-6">
              <div className="mb-6 flex items-center gap-4">
                <h2
                  className="text-[20px] font-bold pl-3"
                  style={{
                    color: "var(--theme-heading-text)",
                    borderLeft: "4px solid var(--theme-accent)",
                  }}
                >
                  YEARLY EXPENSE
                </h2>
                <span
                  className="text-[15px]"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  (compare by hostel)
                </span>
                <div
                  className="px-4 py-1.5 rounded-full text-sm ml-2"
                  style={{
                    background: "var(--theme-button-bg)",
                    color: "var(--theme-button-text)",
                  }}
                >
                  Yearly ▼
                </div>
              </div>
              <div className="h-[400px] w-full flex">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.comparativeExpenses}
                      margin={{ top: 30, right: 10, left: 10, bottom: 5 }}
                      barSize={35}
                      barGap={4}
                    >
                      <CartesianGrid strokeDasharray="5 5" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#4B5563", fontSize: 14 }}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={(val) => val.toLocaleString("en-IN")}
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#4B5563", fontSize: 13 }}
                        dx={-10}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          `₹${value.toLocaleString("en-IN")}`,
                          name,
                        ]}
                        cursor={{ fill: "transparent" }}
                      />
                      {comparativeBranches.map((branchName, index) => (
                        <Bar
                          key={branchName}
                          dataKey={branchName}
                          name={branchName}
                          fill={branchColors[index % branchColors.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legend to match UI */}
                <div className="w-[200px] flex flex-col justify-center gap-6 pl-8">
                  {comparativeBranches.map((branchName, index) => (
                    <div key={branchName} className="flex items-center gap-4">
                      <div
                        className="w-6 h-6 rounded-sm"
                        style={{
                          backgroundColor:
                            branchColors[index % branchColors.length],
                        }}
                      ></div>
                      <span
                        className="font-bold text-[15px]"
                        style={{ color: "var(--theme-primary-text)" }}
                      >
                        {branchName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
