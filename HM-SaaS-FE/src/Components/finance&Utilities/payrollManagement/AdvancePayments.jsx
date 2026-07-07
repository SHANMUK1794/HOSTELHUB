import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlusCircle } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuHistory } from "react-icons/lu";
import { useStaffData } from "../../../hooks/useStaffData";
import { useGetAdvances, useDeleteAdvance } from "../../../hooks/useAdvance";
import FinanceSubHeader from "../FinanceAndUtilities";
import {
  toggleAdd,
  toggleEdit,
  toggleHistory,
  toggleAdvanceEdit,
  setSelectedAdvance,
} from "../../../store/slice/advanceSlice";
import AddAdvancePopup from "./AddAdvancePopup";
import EditAdvancePopup from "./EditAdvancePopup";
import HistoryPopup from "./HistoryPopup";
import EditPaymentPopup from "./EditPaymentPopup";
import Delete from "../../common_components/Delete";
import DatePicker from "../../common_components/DatePicker";
import AdvanceExport from "../../common_components/AdvanceExport";
import ToastMessage from "../../common_components/ToastMessage";

const formatCurrency = (amount) =>
  `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

const AdvancePayments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { selectedBranch } = useSelector((state) => state.branch || {});
  useStaffData(selectedBranch);

  const { showAdd, showEdit, showHistory, showAdvanceEdit, selectedAdvance } =
    useSelector((state) => state.advance);

  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  





  const branchName =
  selectedBranch || advances?.[0]?.branchName;
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [toastConfig, setToastConfig] = useState({ show: false, text: "", success: false, failed: false });

  const showToast = (text, type) => {
    setToastConfig({ show: true, text, success: type === "success", failed: type === "error" });
    setTimeout(() => {
      setToastConfig({ show: false, text: "", success: false, failed: false });
    }, 3000);
  };

  const closeToast = () => {
    setToastConfig({ show: false, text: "", success: false, failed: false });
  };

  const {
    data: advances = [],
    isLoading,
    isError,
    refetch,
  } = useGetAdvances(selectedBranch);
  const deleteMutation = useDeleteAdvance();

  const handleChange = (path) => navigate(path);

  const handleDelete = async (id) => {
    try {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          showToast("Advance record moved to Recycle Bin safely", "success");
          setIsOpenDelete(false);
          setSelectedId(null);
          refetch?.();
        },
        onError: (error) => {
          console.error(error);
          showToast(
            error?.response?.data?.message || "Failed to delete advance", "error"
          );
        },
      });
    } catch (error) {
      console.error(error);
      showToast("Something went wrong", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--theme-muted-text)" }} className="text-lg">
          Loading advance data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load advance data.</p>
      </div>
    );
  }

  const isModalOpen =
    showAdd || showEdit || showHistory || showAdvanceEdit || isOpenDelete;

  // const isActivePath = (path) =>
  //   location.pathname === path ||
  //   (path === "/AdvancePayments" && location.pathname === "/AdvancePayments");

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      <FinanceSubHeader />

      <div className="px-6 pb-4">
        <div
          className={`transition-all duration-300 ${isModalOpen ? "blur-sm" : ""}`}
        >
          {/* TOP CARD */}
          <div
            className="rounded-[18px] p-5 shadow-sm mb-6"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              border: "1px solid var(--theme-secondary-card-bg)",
            }}
          >
            <div className="flex flex-col justify-between gap-5 p-3">
              <div className="flex flex-wrap items-center gap-4">
                <h1
                  className="text-2xl md:text-[38px] w-full md:w-[300px] leading-none font-bold"
                  style={{ color: "var(--theme-heading-text)" }}
                >
                  Advance Table
                </h1>

                <div className="flex items-center gap-2">
                  {[
                    { label: "Salary", path: "/payroll" },
                    { label: "Advance", path: "/AdvancePayments" },
                  ].map(({ label, path }) => (
                    <label
                      key={path}
                      className="flex items-center gap-2 cursor-pointer px-3 py-[5px] rounded-md text-[15px] font-medium border-2 transition-all"
                      style={
                        location.pathname === path
                          ? {
                              borderColor: "var(--theme-accent)",
                              backgroundColor: "var(--theme-filter-bg)",
                              color: "var(--theme-primary-text)",
                            }
                          : {
                              borderColor: "var(--theme-secondary-card-bg)",
                              backgroundColor: "var(--theme-card-bg)",
                              color: "var(--theme-primary-text)",
                            }
                      }
                    >
                      <input
                        type="checkbox"
                        checked={location.pathname === path}
                        onChange={() => handleChange(path)}
                        style={{ accentColor: "var(--theme-accent)" }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-row justify-between gap-5 mt-4 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                  <DatePicker
                    selectedYearMonth={selectedYearMonth}
                    onChange={(value) => setSelectedYearMonth(value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => dispatch(toggleAdd())}
                    className="px-5 py-3 rounded-xl flex items-center gap-2 shadow-md font-medium text-[15px] transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: "var(--theme-button-bg)",
                      color: "var(--theme-button-text)",
                    }}
                  >
                    <FaPlus size={13} />
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>

         
          {/* EXPORT */}
          <div className="flex justify-end mb-4">
            <AdvanceExport
              advances={advances}
              selectedYearMonth={selectedYearMonth}
              branchName={branchName}
              showToast={showToast}
            />
          </div>

          {/* TABLE */}
          <div
            className="overflow-hidden rounded-[16px] shadow-sm"
            style={{
              border: "1px solid var(--theme-secondary-card-bg)",
              backgroundColor: "var(--theme-card-bg)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead
                  style={{ backgroundColor: "var(--theme-table-header-bg)" }}
                >
                  <tr style={{ color: "var(--theme-white-text)" }}>
                    {[
                      "Name",
                      "Salary",
                      "Amount Borrowed",
                      "Paid Amount",
                      "Balance",
                      "Status",
                      "Action",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-[14px] font-semibold"
                        style={i === 6 ? { textAlign: "center" } : {}}
                      >
                        {h === "Paid Amount" ? (
                          <span className="leading-4">
                            Paid
                            <br />
                            Amount
                          </span>
                        ) : (
                          h
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody style={{ backgroundColor: "var(--theme-table-row-bg)" }}>
                  {advances.length > 0 ? (
                    advances.map((row) => (
                      <tr
                        key={row._id}
                        className="border-b transition"
                        style={{
                          borderColor: "var(--theme-secondary-card-bg)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        <td
                          className="px-5 py-5 text-[15px] font-medium"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {row.staff_name || "-"}
                        </td>
                        <td
                          className="px-5 py-5 text-[15px]"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {formatCurrency(row.salary)}
                        </td>
                        <td
                          className="px-5 py-5 text-[15px]"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {formatCurrency(row.advance)}
                        </td>
                        <td
                          className="px-5 py-5 text-[15px]"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {formatCurrency(row.paid)}
                        </td>
                        <td
                          className="px-5 py-5 text-[15px]"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {formatCurrency(row.balance)}
                        </td>
                        <td className="px-5 py-5">
                          {row.status === "Pending" ? (
                            <div className="w-fit px-5 py-[5px] rounded-full text-[13px] font-medium border bg-[#FFF2F2] text-[#FF2E2E] border-[#FF9A9A]">
                              Pending
                            </div>
                          ) : (
                            <div className="w-fit px-5 py-[5px] rounded-full text-[13px] font-medium border bg-[#F2FFF2] text-[#169B28] border-[#9AD79F]">
                              Paid
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                dispatch(setSelectedAdvance(row));
                                dispatch(toggleHistory());
                              }}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                              style={{
                                backgroundColor: "var(--theme-card-bg)",
                                border:
                                  "1px solid var(--theme-secondary-card-bg)",
                              }}
                              title="History"
                            >
                              <LuHistory
                                style={{ color: "var(--theme-primary-text)" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                dispatch(setSelectedAdvance(row));
                                dispatch(toggleEdit());
                              }}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                              style={{
                                backgroundColor: "var(--theme-card-bg)",
                                border:
                                  "1px solid var(--theme-secondary-card-bg)",
                              }}
                              title="Add Payment"
                            >
                              <FiPlusCircle
                                style={{ color: "var(--theme-primary-text)" }}
                              />
                            </button>
                            <button
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                setSelectedId(row._id);
                                setIsOpenDelete(true);
                              }}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow disabled:opacity-50"
                              style={{
                                backgroundColor: "var(--theme-card-bg)",
                                border: "1px solid #fecaca",
                              }}
                              title="Delete"
                            >
                              <RiDeleteBin6Line className="text-[#FF4B4B]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-10"
                        style={{ color: "var(--theme-muted-text)" }}
                      >
                        No advance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showAdd && (
          <AddAdvancePopup
            isOpen={showAdd}
            onClose={() => dispatch(toggleAdd())}
            showToast={showToast}
          />
        )}
        {showEdit && (
          <EditPaymentPopup
            isOpen={showEdit}
            onClose={() => dispatch(toggleEdit())}
            data={selectedAdvance}
            selectedBranch={selectedBranch}
            showToast={showToast}
          />
        )}
        {showHistory && (
          <HistoryPopup
            isOpen={showHistory}
            onClose={() => dispatch(toggleHistory())}
            data={selectedAdvance}
            showToast={showToast}
          />
        )}
        {showAdvanceEdit && (
          <EditAdvancePopup
            isOpen={showAdvanceEdit}
            onClose={() => dispatch(toggleAdvanceEdit())}
            data={selectedAdvance}
            selectedBranch={selectedBranch}
            showToast={showToast}
          />
        )}
        {isOpenDelete && (
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            deleteData={handleDelete}
            selectedId={selectedId}
            refetch={refetch}
          />
        )}
      </div>
      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default AdvancePayments;
