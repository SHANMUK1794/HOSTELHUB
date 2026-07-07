import React from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEmployeeAttendanceStats } from "../../../hooks/useEmployee";

import { useStaffData } from "../../../hooks/useStaffData";
import { useGetAdvances, useDeleteAdvance } from "../../../hooks/useAdvance";

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {

  const { data: stats, isLoading } = useEmployeeAttendanceStats(employee?._id);

  const { selectedBranch } = useSelector((state) => state.branch || {});

  useStaffData(selectedBranch);

  // GET ADVANCES
  const {
    data: advances = [],
    isError,
    refetch,
  } = useGetAdvances(selectedBranch);

  const employeeAdvance = advances.find(
    (adv) => adv.employee_id === employee?._id,
  );
  if (!isOpen || !employee) return null;

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center py-2">
      <span
        className="font-semibold min-w-[140px]"
        style={{ color: "var(--theme-accent)" }}
      >
        {label}
      </span>
      <span className="mr-4" style={{ color: "var(--theme-muted-text)" }}>
        :
      </span>
      <span
        className="font-medium"
        style={{ color: "var(--theme-primary-text)" }}
      >
        {value || "N/A"}
      </span>
    </div>
  );

  return (
    <div
      className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md z-[60] flex justify-center items-start pt-10 p-4"
    >
      <div
        className="w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: "var(--theme-filter-bg)" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <FaTimes size={24} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="mx-auto w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
</div>
            <h2
              className="text-3xl font-bold"
              style={{
                color: "var(--theme-heading-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              {employee.Name}
            </h2>
          </div>

          {/* Divider */}
          <div
            className="mb-6"
            style={{ borderTop: "1px solid var(--theme-secondary-card-bg)" }}
          />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
            <div className="flex flex-col">
              <InfoRow label="Employee no" value={employee.EmpNo} />
              <InfoRow
                label="Date of Birth"
                value={employee.DOB?.split("T")[0]}
              />
              <InfoRow label="Shift" value={employee.Shift} />
              <InfoRow label="Salary" value={employee.Salary} />
              <InfoRow
                label="Present"
                value={
                  isLoading || stats === undefined
                    ? "Loading..."
                    : `${stats.presentDays} days`
                }
              />

              <InfoRow
                label="Advance"
                value={employeeAdvance?.advance || "0"}
              />
            </div>
            <div className="flex flex-col">
              <InfoRow label="Phone No" value={employee.Mobile} />
              <InfoRow
                label="Date of Joining"
                value={employee.DOJ?.split("T")[0]}
              />
              <InfoRow label="Branch" value={employee.branchName} />
              <InfoRow label="Designation" value={employee.Designation} />
              <InfoRow
                label="Absent"
                value={
                  isLoading || stats === undefined
                    ? "Loading..."
                    : `${stats.absentDays} days`
                }
              />
              <InfoRow
                label="Balance"
                value={employeeAdvance?.balance || "0"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
