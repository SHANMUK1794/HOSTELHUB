import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// ------------------------------
// Helpers
// ------------------------------
const monthNameToNumber = (monthToken) => {
  if (!monthToken) return undefined;
  const token = String(monthToken).trim().toLowerCase();

  // if it's already numeric
  if (!Number.isNaN(Number(token))) {
    // normalize numeric to padded 2-digit string
    return String(Number(token)).padStart(2, "0");
  }

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

  // try full name
  let idx = monthNames.indexOf(token);
  if (idx !== -1) return String(idx + 1).padStart(2, "0");

  // try first three letters (Nov, Dec, etc.)
  const short = token.slice(0, 3);
  idx = monthNames.map((m) => m.slice(0, 3)).indexOf(short);
  if (idx !== -1) return String(idx + 1).padStart(2, "0");

  // no match
  return undefined;
};

const normalizeSelectedYearMonth = (selectedYearMonth) => {
  // Accepts formats:
  // "2024", "2024 November", "2024 - November", "all", "all - all", "2024-Nov", "2024/November"
  if (!selectedYearMonth && selectedYearMonth !== "") return { year: undefined, month: undefined };

  const s = String(selectedYearMonth).trim();
  if (!s) return { year: undefined, month: undefined };

  // handle direct "all" token
  if (s.toLowerCase() === "all") return { year: "all", month: undefined };

  // split on runs of separators (spaces, hyphens, slashes)
  const tokens = s
    .split(/[-/\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // tokens[0] -> year or 'all'; tokens[1] -> month
  let year = tokens[0];
  let monthToken = tokens[1];

  if (year) {
    year = String(year).toLowerCase();
  }

  if (year === "all") {
    return { year: "all", month: undefined };
  }

  // if single token and it's a month by name, treat year as undefined and month as token
  const maybeMonth = monthNameToNumber(year);
  if (!tokens[1] && maybeMonth) {
    // user selected just "November" or "Nov"
    return { year: undefined, month: maybeMonth };
  }

  // normalize numeric year (if it's numeric string like "2024")
  if (!Number.isNaN(Number(year))) {
    year = String(Number(year)); // canonical numeric string
  } else {
    // if year wasn't numeric and isn't "all", keep as-is (maybe backend can handle) but usually undefined
    // For safety, keep the raw token but it's likely invalid
    // We'll leave it as-is to help debugging
  }

  // normalize month token to numeric month string (padded)
  const month = monthNameToNumber(monthToken);

  return { year: year || undefined, month: month || undefined };
};

// ------------------------------
// FETCH ALL PG USERS (supports branch/year/month)
// ------------------------------
const fetchPGData = async ({ queryKey }) => {
  try {
    const [, branchName, year, month] = queryKey;

    const params = new URLSearchParams();

    // Logic change: Only append if value is truthy AND not the literal string "undefined"
    if (branchName && branchName !== "undefined") {
      params.append("branchName", branchName);
    }
    if (year && year !== "all" && year !== "undefined") {
      params.append("year", year);
    }
    if (month && month !== "undefined") {
      params.append("month", month);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${ApiRoutes.PGDATA.GET_ALL}?${queryString}`
      : ApiRoutes.PGDATA.GET_ALL;

    const response = await axiosInstance.get(url);
    return response.data?.data ?? response.data ?? [];
  } catch (error) {
    console.error("❌ Error fetching PG data:", error);
    throw error;
  }
};

// ------------------------------
// MAIN QUERY HOOK (robust parsing)
// ------------------------------
export const usePG = (selectedYearMonth = "", branchName = "", options = {}) => {
  const { year, month } = normalizeSelectedYearMonth(selectedYearMonth);

  // if user provided branchName as falsy, pass undefined so queryKey is consistent
  const queryKey = ["pgdata", branchName || undefined, year || undefined, month || undefined];

  // helpful debug log to see the exact queryKey
  console.log("[usePG] selectedYearMonth:", selectedYearMonth, "->", { year, month, queryKey });

  return useQuery({
    queryKey,
    queryFn: fetchPGData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

// ------------------------------
// UPDATE PG ENTRY
// ------------------------------
export const useUpdatePG = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      if (!id) throw new Error("Missing id for update");
      console.log("[useUpdatePG] PUT ->", ApiRoutes.PGDATA.UPDATE(id), payload);
      return axiosInstance.put(ApiRoutes.PGDATA.UPDATE(id), payload);
    },
    onSuccess: () => {
      qc.invalidateQueries(["pgdata"]);
    },
    onError: (error) => {
      console.error("❌ Error updating PG record:", error?.response?.data ?? error);
      throw error;
    },
  });
};

// ------------------------------
// CREATE PG ENTRY
// ------------------------------
export const useCreatePG = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const fullUrl = (axiosInstance.defaults?.baseURL || "") + ApiRoutes.PGDATA.REGISTER;
        console.log("[useCreatePG] POST ->", fullUrl, payload);
      } catch (e) {
        console.warn("[useCreatePG] unable to compute full URL", e);
      }
      try {
        return await axiosInstance.post(ApiRoutes.PGDATA.REGISTER, payload);
      } catch (err) {
        // if endpoint not found, try a few likely alternatives to help during backend mismatch
        const status = err?.response?.status;
        if (status === 404) {
          const alternatives = [
            "/api/pgdata/v1/add",
            "/api/pgdata/v1/create",
            "/api/pgdata/v1/register-user",
          ];
          for (const alt of alternatives) {
            try {
              console.log("[useCreatePG] retrying POST ->", (axiosInstance.defaults?.baseURL || "") + alt);
              const res = await axiosInstance.post(alt, payload);
              console.log("[useCreatePG] alternative succeeded ->", alt);
              return res;
            } catch (e2) {
              console.warn("[useCreatePG] alternative failed ->", alt, e2?.response?.status);
            }
          }
        }
        // rethrow original error so UI can react
        throw err;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries(["pgdata"]);
    },
    onError: (error) => {
      try {
        console.error("❌ Error creating PG record:", {
          status: error?.response?.status,
          data: error?.response?.data,
          headers: error?.response?.headers,
          request: error?.request,
        });
      } catch (e) {
        console.error("❌ Error creating PG record (logging failed):", e);
      }
      throw error;
    },
  });
};

// ------------------------------
// DELETE PG ENTRY
// ------------------------------
export const useDeletePG = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => {
      if (!id) throw new Error("Missing id for delete");
      console.log("[useDeletePG] DELETE ->", ApiRoutes.PGDATA.DELETE(id));
      return axiosInstance.delete(ApiRoutes.PGDATA.DELETE(id));
    },
    onSuccess: () => {
      qc.invalidateQueries(["pgdata"]);
    },
    onError: (error) => {
      console.error("❌ Error deleting PG record:", error?.response?.data ?? error);
      throw error;
    },
  });
};

// ------------------------------
// DEACTIVATE PG ENTRY
// ------------------------------
export const useDeactivatePG = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      if (!id) {
        throw new Error("Missing PG ID");
      }

      console.log(
        "[useDeactivatePG] URL =>",
        ApiRoutes.PGDATA.DEACTIVE(id)
      );

      console.log(
        "[useDeactivatePG] PAYLOAD =>",
        payload
      );

      const response = await axiosInstance.put(
        ApiRoutes.PGDATA.DEACTIVE(id),
        payload
      );

      return response.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["pgdata"],
      });
      qc.invalidateQueries({
        queryKey: ["vacations"],
      });
    },

    onError: (error) => {
      console.error(
        "❌ Error updating PG status:",
        error?.response?.data || error
      );
    },
  });
};

export default usePG;
