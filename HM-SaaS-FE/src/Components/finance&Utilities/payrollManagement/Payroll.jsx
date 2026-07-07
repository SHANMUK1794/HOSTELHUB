import React, { useState} from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetPayroll, useDeletePayroll } from "../../../hooks/usePayroll";
import AddPaymentPopup from "./popups/AddPaymentPopup";
import EditPopup from "./popups/EditPopup";
import ViewDetailsPopup from "./popups/ViewDetailsPopup";
import ProfilePopup from "./popups/ProfilePopup";
import Delete from "../../common_components/Delete";
import FinanceSubHeader from "../FinanceAndUtilities";
import PayRollExport from "../../common_components/PayRollExport";
import DatePicker from "../../common_components/DatePicker";
import ToastMessage from "../../common_components/ToastMessage";

const formatCurrency = (amount) =>
  `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

const SalaryTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const deleteMutation = useDeletePayroll();
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();

  const {
    data: payrolls = [],
    isLoading: payrollLoading,
    refetch,
  } = useGetPayroll(selectedYearMonth || `${currentYear} ${currentMonth}`);


  const handleViewClick = (row) => {
    setSelectedRowData(row);
    setShowViewModal(true);
  };

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

  const handleDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId, {
        onSuccess: () => {
          setSelectedId(null);
          setIsOpenDelete(false);
          showToast("Payroll record moved to Recycle Bin safely!", "success");
          refetch();
        },
        onError: (error) => {
          const errMsg = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.message || 
            "Failed to remove item";
          showToast(errMsg, "error");
        },
      });
    }
  };

  const handleChange = (path) => navigate(path);
  const isModalOpen =
    showAddModal ||
    showViewModal ||
    showProfileModal ||
    isOpenDelete ||
    editRow;

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
                  Salary Table
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
                    onClick={() => setShowAddModal(true)}
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
            <PayRollExport
              month={selectedYearMonth?.split(/[-\s]/)[1] || currentMonth}
              year={selectedYearMonth?.split(/[-\s]/)[0] || currentYear}
              branchName={payrolls?.[0]?.branchName || ""}
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
              <table className="w-full min-w-[1050px]">
                <thead
                  style={{ backgroundColor: "var(--theme-table-header-bg)" }}
                >
                  <tr style={{ color: "var(--theme-white-text)" }}>
                    {[
                      "S.NO",
                      "NAME",
                      "JOINING DATE",
                      "SALARY",
                      "WORKING DAYS",
                      "RETENTION SALARY",
                      "STATUS",
                      "ACTION",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-5 py-4 text-[14px] font-semibold whitespace-nowrap"
                        style={{
                          textAlign: head === "ACTION" ? "center" : "left",
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {payrollLoading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-10"
                        style={{
                          color: "var(--theme-muted-text)",
                          backgroundColor: "var(--theme-table-row-bg)",
                        }}
                      >
                        Loading data...
                      </td>
                    </tr>
                  ) : payrolls.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-10"
                        style={{
                          color: "var(--theme-muted-text)",
                          backgroundColor: "var(--theme-table-row-bg)",
                        }}
                      >
                        No payroll data found.
                      </td>
                    </tr>
                  ) : (
                    payrolls.map((row, index) => (
                      <tr
                        key={row._id || index}
                        className="border-b transition"
                        style={{
                          borderColor: "var(--theme-secondary-card-bg)",
                          backgroundColor: "var(--theme-table-row-bg)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--theme-filter-bg)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--theme-table-row-bg)")
                        }
                      >
                        <td
                          className="px-5 py-4 text-[15px]"
                          style={{ color: "var(--theme-muted-text)" }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td
                          className="px-5 py-4 text-[15px] font-medium"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {row.staff_name || row.name}
                        </td>
                        <td
                          className="px-5 py-4 text-[15px]"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {row.DOJ
                            ? new Date(row.DOJ).toLocaleDateString("en-GB")
                            : "-"}
                        </td>
                        <td
                          className="px-5 py-4 text-[15px] font-medium"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {formatCurrency(row.salary)}
                        </td>
                        <td
                          className="px-5 py-4 text-[15px]"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {row.workingdays ?? "-"}
                        </td>
                        <td
                          className="px-5 py-4 text-[15px] font-medium"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          {formatCurrency(row.total)}
                        </td>
                        <td className="px-5 py-4">
                          <div
                            className={`w-fit px-5 py-[5px] rounded-full text-[13px] font-medium border ${
                              row.status === "Paid"
                                ? "bg-[#F2FFF2] text-[#169B28] border-[#9AD79F]"
                                : "bg-[#FFF2F2] text-[#FF2E2E] border-[#FF9A9A]"
                            }`}
                          >
                            {row.status || "Pending"}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewClick(row)}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                              style={{
                                backgroundColor: "var(--theme-card-bg)",
                                border:
                                  "1px solid var(--theme-secondary-card-bg)",
                              }}
                            >
                              <IoMdEye
                                style={{ color: "var(--theme-primary-text)" }}
                              />
                            </button>
                            <button
                              onClick={() => setEditRow(row)}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                              style={{
                                backgroundColor: "var(--theme-card-bg)",
                                border:
                                  "1px solid var(--theme-secondary-card-bg)",
                              }}
                            >
                              <MdEdit
                                style={{ color: "var(--theme-primary-text)" }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(row._id);
                                setIsOpenDelete(true);
                              }}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                              style={{
                                backgroundColor: "var(--theme-card-bg)",
                                border: "1px solid #fecaca",
                              }}
                            >
                              <FaRegTrashAlt className="text-[#FF4B4B]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showAddModal && (
          <AddPaymentPopup onClose={() => setShowAddModal(false)} showToast={showToast} />
        )}
        {editRow && (
          <EditPopup rowData={editRow} onClose={() => setEditRow(null)} showToast={showToast} />
        )}
        {showViewModal && (
          <ViewDetailsPopup
            rowData={selectedRowData}
            onClose={() => setShowViewModal(false)}
          />
        )}
        {showProfileModal && (
          <ProfilePopup
            rowData={selectedRowData}
            onClose={() => setShowProfileModal(false)}
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

export default SalaryTable;
