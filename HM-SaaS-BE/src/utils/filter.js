

export const buildDateRangeFilter = (monthName, year) => {
  const isYearSpecific = year && year !== "all";
  const isMonthSpecific = monthName && monthName !== "all";

  if (!isYearSpecific && !isMonthSpecific) return {};

  const monthMap = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  if (isYearSpecific && isMonthSpecific) {
    let monthIndex = monthMap[String(monthName).toLowerCase()];
    if (monthIndex === undefined && !isNaN(monthName)) {
      monthIndex = Number(monthName) - 1;
    }
    if (monthIndex === undefined || monthIndex < 0 || monthIndex > 11) return {};

    const startDate = new Date(Number(year), monthIndex, 1);
    const endDate = new Date(Number(year), monthIndex + 1, 0, 23, 59, 59, 999);
    return { date: { $gte: startDate, $lte: endDate } };
  } else if (isYearSpecific && !isMonthSpecific) {
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year) + 1, 0, 1);
    return { date: { $gte: startDate, $lt: endDate } };
  } else if (!isYearSpecific && isMonthSpecific) {
    let monthIndex = monthMap[String(monthName).toLowerCase()];
    if (monthIndex === undefined && !isNaN(monthName)) {
      monthIndex = Number(monthName) - 1;
    }
    if (monthIndex === undefined || monthIndex < 0 || monthIndex > 11) return {};
    return { $expr: { $eq: [{ $month: "$date" }, monthIndex + 1] } };
  }

  return {};
};

export const buildBranchFilter = (user, queryBranch) => {
  if (user.role === "Admin"||user.role === "Staff") {
    return queryBranch ? { branchName: queryBranch } : {};
  }
  return { branchName: user.branchName };
};

export const buildCombinedFilter = (user, query) => {
  const dateFilter = buildDateRangeFilter(query.month, query.year);
  const branchFilter = buildBranchFilter(user, query.branchName);
  return { ...dateFilter, ...branchFilter };
};
export const buildCreatedAtFilter = (month, year) => {
  // if "all" year or no month → return no filter
  if (!year || year === "all" || !month) return {};

  const date = new Date(`${month} 1, ${year}`);
  if (isNaN(date)) {
    throw new Error(`Invalid month/year: ${month}, ${year}`);
  }

  const monthIndex = date.getMonth(); // 0–11
  const startDate = new Date(year, monthIndex, 1); // first day of month
  const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999); // last day

  return {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
};

export const DateOfJoining = (month, year, fieldName = "DateOfJoining") => {
  if (!month || !year) return {};

  const parsed = new Date(`${month} 1, ${year}`);
  if (isNaN(parsed)) return {}; // invalid → skip filter

  const monthIndex = parsed.getMonth();

  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

  return {
    [fieldName]: {
      $gte: startDate,
      $lte: endDate
    }
  };
};


export const stayedInMonth = (
  month,
  year,
  checkinField = "checkin",
  checkoutField = "checkout"
) => {
  if (
    !month ||
    !year ||
    month === "all" ||
    year === "all"
  ) {
    return {};
  }

  const parsed = new Date(`${month} 1, ${year}`);
  if (isNaN(parsed)) return {};

  const monthIndex = parsed.getMonth();

  const startDate = new Date(Number(year), monthIndex, 1);
  const endDate = new Date(
    Number(year),
    monthIndex + 1,
    0,
    23,
    59,
    59,
    999
  );

  return {
    [checkinField]: {
      $lte: endDate,
    },
    $or: [
      { [checkoutField]: null },
      { [checkoutField]: { $exists: false } },
      { [checkoutField]: { $gte: startDate } },
    ],
  };
};