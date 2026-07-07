import React, { useState, useMemo, useEffect } from "react";
import {
  FaPlus,
  FaRegEye,
  FaRegAddressCard,
  FaRegTrashAlt,
} from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEmployees, useDeleteEmployee } from "../../../hooks/useEmployee";
import LottieLoader from "../../common_components/LottieLoader";
import Delete from "../../common_components/Delete";
import SearchBar from "../../common_components/SearchBar";

import AddEmployeeForm from "./AddEmployeeForm";
import EditEmployee from "./EditEmployee";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import LoginAccessModal from "./LoginAccessModal";
import Pagination from "../../common_components/Pagination";
import ToastMessage from "../../common_components/ToastMessage";

const Employee = () => {
  const navigate = useNavigate();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  let userRole = useSelector((state) => state.auth.user?.role);
  if (!userRole) {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));
      userRole = localUser?.role;
    } catch (e) {
      userRole = null;
      console.error(e);
    }
  }
  const isAdmin = userRole?.toLowerCase() === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState("All");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const { data, isLoading, refetch } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();

  const filteredEmployees = useMemo(() => {
    const list = data?.data || data || [];
    if (!Array.isArray(list)) return [];
    return list.filter((emp) => {
      const name = emp.Name ? String(emp.Name).toLowerCase() : "";
      const mobile = emp.Mobile ? String(emp.Mobile) : "";
      const search = searchTerm.toLowerCase();
      return (
        (name.includes(search) || mobile.includes(search)) &&
        (filterShift === "All" || emp.Shift === filterShift)
      );
    });
  }, [data, searchTerm, filterShift]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterShift]);

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredEmployees.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

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

  const handleDelete = async (id) => {
    try {
      await deleteEmployeeMutation.mutateAsync(id);
      showToast("Employee deleted!", "success");
      refetch();
    } catch (error) {
      showToast(error?.response?.data?.message || "Error deleting.", "error");
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LottieLoader />
      </div>
    );

  return (
    <div
      className="lg:pl-5 p-4 md:p-6 min-h-screen"
      style={{
        backgroundColor: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        {isAdmin && (
          <button
            onClick={() => navigate("/UsersAndRoles")}
            className="px-4 py-2 rounded-md border font-medium hover:opacity-80 transition-opacity"
            style={{
              borderColor: "var(--theme-accent)",
              color: "var(--theme-accent)",
              backgroundColor: "var(--theme-card-bg)",
            }}
          >
            User
          </button>
        )}
        <button
          className="px-4 py-2 rounded-md font-medium"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
          }}
        >
          Employee
        </button>
      </div>

      {/* Main Card */}
      <div
        className="md:p-8 rounded-lg shadow-sm min-h-[85vh] flex flex-col"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <h1
          className="text-3xl font-bold font-montserrat mb-8"
          style={{
            color: "var(--theme-heading-text)",
            fontSize: "var(--theme-font-subheading)",
          }}
        >
          User & Role
        </h1>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex gap-4 items-center">
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="rounded-md px-6 py-2 cursor-pointer font-medium"
              style={{
                backgroundColor: "var(--theme-secondary-card-bg)",
                color: "var(--theme-primary-text)",
                border: "1px solid var(--theme-secondary-card-bg)",
              }}
            >
              <option value="All">Shift</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
            <SearchBar
              search={searchTerm}
              setSearch={setSearchTerm}
              placeholder="Search Name / Mobile"
            />
          </div>

          <button
            onClick={() => setShowAddUser(true)}
            className="px-6 py-2 rounded-xl flex items-center font-medium hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            <FaPlus className="mr-2" /> Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl flex-grow">
          <table className="min-w-full border-collapse">
            <thead style={{ backgroundColor: "var(--theme-table-header-bg)" }}>
              <tr
                className="text-[16px]"
                style={{ color: "var(--theme-white-text)" }}
              >
                <th className="px-4 py-3 border-r border-white/20">S.NO</th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  STAFF NAME
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  SALARY
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  SHIFT
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  DESIGNATION
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  PHONE NO
                </th>
                <th className="px-4 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--theme-table-row-bg)" }}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((emp, index) => (
                  <tr
                    key={emp._id || index}
                    className="border-b font-montserrat hover:opacity-90 transition-opacity"
                    style={{
                      borderColor: "var(--theme-secondary-card-bg)",
                      color: "var(--theme-primary-text)",
                    }}
                  >
                    <td
                      className="p-3 text-center font-semibold"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      {String(indexOfFirstRow + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-3 text-center">{emp.Name}</td>
                    <td className="p-3 text-center">{emp.Salary}</td>
                    <td className="p-3 text-center">{emp.Shift}</td>
                    <td className="p-3 text-center">{emp.Designation}</td>
                    <td className="p-3 text-center">{emp.Mobile}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <ActionBox
                        icon={
                          <FaRegAddressCard
                            style={{ color: "var(--theme-accent)" }}
                          />
                        }
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsAccessModalOpen(true);
                        }}
                      />
                      <ActionBox
                        icon={
                          <FaRegEye
                            style={{ color: "var(--theme-primary-text)" }}
                          />
                        }
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowViewModal(true);
                        }}
                      />
                      <ActionBox
                        icon={
                          <RiPencilFill
                            style={{ color: "var(--theme-primary-text)" }}
                          />
                        }
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowEditUser(true);
                        }}
                      />
                      <ActionBox
                        icon={<FaRegTrashAlt className="text-red" />}
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Modals */}
        {showAddUser && (
          <AddEmployeeForm
            onClose={() => setShowAddUser(false)}
            branchName={branchName}
            refetch={refetch}
            showToast={showToast}
          />
        )}
        {isAccessModalOpen && (
          <LoginAccessModal
            employeeId={selectedEmployee._id}
            employee={selectedEmployee}
            onClose={() => setIsAccessModalOpen(false)}
            showToast={showToast}
          />
        )}
        {showEditUser && (
          <EditEmployee
            employee={selectedEmployee}
            onClose={() => setShowEditUser(false)}
            refetch={refetch}
            showToast={showToast}
          />
        )}
        {showViewModal && (
          <EmployeeDetailsModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            employee={selectedEmployee}
          />
        )}
        {isDeleteModalOpen && (
          <Delete
            setIsOpenDelete={setIsDeleteModalOpen}
            deleteData={handleDelete}
            selectedId={selectedEmployee?._id}
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

const ActionBox = ({ icon, onClick }) => (
  <div
    onClick={onClick}
    className="w-8 h-8 rounded flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all"
    style={{
      backgroundColor: "var(--theme-card-bg)",
      border: "1px solid var(--theme-secondary-card-bg)",
    }}
  >
    {icon}
  </div>
);

export default Employee;
