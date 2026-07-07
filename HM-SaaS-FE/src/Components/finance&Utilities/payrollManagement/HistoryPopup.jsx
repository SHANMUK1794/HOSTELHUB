import React, { useState, useEffect } from "react";
import { useAdvanceHistory } from "../../../hooks/useAdvance";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../../../utils/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import EditDuePopup from "./EditDuePopup";
import DeletePopup from "../payrollManagement/popups/DeletePopup";

const HistoryPopup = ({ isOpen, onClose, data, showToast }) => {
  const employeeId = data?.employee_id || data?._id;
  const {
    data: historyData,
    isLoading,
    isError,
  } = useAdvanceHistory(employeeId);
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("All");
  const [editRow, setEditRow] = useState(null);
  const [advanceReceived, setAdvanceReceived] = useState("-");
  const [deleteRow, setDeleteRow] = useState(null);

  const dueTrackers = historyData?.dueTrackers || [];
  const name = data?.staff_name || data?.Name || "-";
  const branch = data?.branchName || data?.branch || "-";
  const salary = data?.salary || "-";

  useEffect(() => {
    const fetchAdvance = async () => {
      try {
        const res = await axiosInstance.get("/api/advance/v1/get");
        if (res.data.advances?.length > 0) {
          const empAdvance = res.data.advances.find(
            (adv) => adv.employee_id === employeeId || adv._id === employeeId,
          );
          if (empAdvance) setAdvanceReceived(`₹ ${empAdvance.balance ?? 0}`);
        }
      } catch (err) {
        console.error(err);
        setAdvanceReceived("-");
      }
    };
    fetchAdvance();
  }, [employeeId]);

  const filteredRows =
    filter === "All"
      ? dueTrackers
      : dueTrackers.filter((row) =>
          filter === "Paid"
            ? row.status?.toLowerCase() === "paid"
            : row.status?.toLowerCase() !== "paid",
        );

  const handleDeleteConfirm = async () => {
    if (!deleteRow) return;
    try {
      await axiosInstance.delete(`/api/advance/v1/due/${deleteRow._id}`);
      await queryClient.invalidateQueries(["advanceHistory", employeeId]);
      showToast("Record deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete record", "error");
    } finally {
      setDeleteRow(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="relative w-full max-w-[1050px] rounded-[22px] shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--theme-filter-bg)" }}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[32px] hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <IoClose />
        </button>

        {/* TOP CONTENT */}
        <div className="px-8 pt-6 pb-5">
          <div
            className="flex flex-wrap items-center gap-x-16 gap-y-4 text-[18px] font-medium"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <div>
              <span className="font-medium">Name :</span> <span>{name}</span>
            </div>
            <div>
              <span className="font-medium">Branch :</span>{" "}
              <span>{branch}</span>
            </div>
            <div>
              <span className="font-medium">Salary :</span>{" "}
              <span>₹ {salary}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div
              className="text-[18px] font-medium"
              style={{ color: "var(--theme-primary-text)" }}
            >
              <span>Advance received :</span> <span>{advanceReceived}</span>
            </div>
            <div className="flex items-center gap-3">
              <label
                className="text-[18px] font-medium"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Status :
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-[38px] min-w-[120px] rounded-[10px] px-4 text-[15px] outline-none"
                style={{
                  border: "1px solid var(--theme-secondary-card-bg)",
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-primary-text)",
                }}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Borrow">Borrow</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-2 pb-4">
          <div className="overflow-x-auto rounded-[14px]">
            <table className="w-full min-w-[900px] overflow-hidden">
              <thead
                style={{ backgroundColor: "var(--theme-table-header-bg)" }}
              >
                <tr style={{ color: "var(--theme-white-text)" }}>
                  {[
                    "Total Amount",
                    "Date",
                    "Paid Amount",
                    "Balance",
                    "Payment method",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-4 text-center text-[16px] font-medium"
                    >
                      {h === "Payment method" ? (
                        <span className="leading-4">
                          Payment
                          <br />
                          method
                        </span>
                      ) : (
                        h
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center"
                      style={{
                        backgroundColor: "var(--theme-filter-bg)",
                        color: "var(--theme-muted-text)",
                      }}
                    >
                      Loading history...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-red-500"
                      style={{ backgroundColor: "var(--theme-filter-bg)" }}
                    >
                      Failed to load history.
                    </td>
                  </tr>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <tr
                      key={row._id}
                      className="border-b"
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? "var(--theme-table-row-bg)"
                            : "var(--theme-filter-bg)",
                        borderColor: "var(--theme-secondary-card-bg)",
                      }}
                    >
                      <td
                        className="px-4 py-4 text-center text-[16px]"
                        style={{ color: "var(--theme-primary-text)" }}
                      >
                        ₹ {row.total_amount}
                      </td>
                      <td
                        className="px-4 py-4 text-center text-[16px]"
                        style={{ color: "var(--theme-primary-text)" }}
                      >
                        {new Date(row.date).toLocaleDateString("en-GB")}
                      </td>
                      <td
                        className="px-4 py-4 text-center text-[16px]"
                        style={{ color: "var(--theme-primary-text)" }}
                      >
                        ₹ {row.paid_amount}
                      </td>
                      <td
                        className="px-4 py-4 text-center text-[16px]"
                        style={{ color: "var(--theme-primary-text)" }}
                      >
                        ₹ {row.balance}
                      </td>
                      <td
                        className="px-4 py-4 text-center text-[16px]"
                        style={{ color: "var(--theme-primary-text)" }}
                      >
                        {row.payment_method}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {row.status?.toLowerCase() === "paid" ? (
                          <div className="mx-auto w-fit min-w-[95px] rounded-full border border-[#8ED29D] bg-[#F1FFF4] px-5 py-[5px] text-[15px] font-medium text-[#29A745]">
                            Paid
                          </div>
                        ) : (
                          <div className="mx-auto w-fit min-w-[95px] rounded-full border border-[#FF8F8F] bg-[#FFF5F5] px-5 py-[5px] text-[15px] font-medium text-[#FF3B30]">
                            Borrow
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditRow(row)}
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:shadow-sm transition-shadow"
                            style={{
                              backgroundColor: "var(--theme-card-bg)",
                              border:
                                "1px solid var(--theme-secondary-card-bg)",
                            }}
                          >
                            <FiEdit2
                              size={15}
                              style={{ color: "var(--theme-primary-text)" }}
                            />
                          </button>
                          <button
                            onClick={() => setDeleteRow(row)}
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:shadow-sm transition-shadow"
                            style={{
                              backgroundColor: "var(--theme-card-bg)",
                              border: "1px solid #fecaca",
                            }}
                          >
                            <RiDeleteBin6Line
                              size={16}
                              className="text-[#FF4B4B]"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center"
                      style={{
                        backgroundColor: "var(--theme-filter-bg)",
                        color: "var(--theme-muted-text)",
                      }}
                    >
                      No history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editRow && (
          <EditDuePopup
            isOpen={!!editRow}
            onClose={() => setEditRow(null)}
            rowData={editRow}
            employeeId={employeeId}
            showToast={showToast}
          />
        )}
        {deleteRow && (
          <DeletePopup
            onClose={() => setDeleteRow(null)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default HistoryPopup;
