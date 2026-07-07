import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useUsersRoles } from "../../../hooks/useUsersRoles";
import LottieLoader from "../../common_components/LottieLoader";
import { useNavigate } from "react-router-dom";
import Delete from "../../common_components/Delete";
import SearchBar from "../../common_components/SearchBar";
import EditUser from "./EditUser";
import { FaRegTrashAlt } from "react-icons/fa";
import Pagination from "../../common_components/Pagination";
import ToastMessage from "../../common_components/ToastMessage";

const UsersAndRoles = () => {
  const usersFromStore = useSelector((state) => state.users.users);

  const users = useMemo(() => {
    const allUsers = usersFromStore || [];
    return allUsers.filter((u) => u.role !== "Other Employees" && u.username);
  }, [usersFromStore]);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const { isLoading, updateUserMutation, deleteUserMutation } = useUsersRoles();

  const [isEditUserOpen, SetIsEditUserOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  useEffect(() => {
    const filtered = users.filter((user) =>
      (user?.staffName || "").toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);

  const deleteData = async (id) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      showToast("User deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to delete user", "error");
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
      <div className="flex flex-row items-start gap-2 mb-6">
        <button
          className="px-4 py-2 rounded-md text-white font-medium"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
          }}
        >
          User
        </button>
        <button
          onClick={() => navigate("/employee")}
          className="px-4 py-2 rounded-md font-medium border hover:opacity-80 transition-opacity"
          style={{
            borderColor: "var(--theme-accent)",
            color: "var(--theme-accent)",
            backgroundColor: "var(--theme-card-bg)",
          }}
        >
          Employee
        </button>
      </div>

      {/* Main Card */}
      <div
        className="p-4 md:p-6 md:pl-8 rounded-lg shadow-sm min-h-[80vh] flex flex-col"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1
            className="text-3xl font-bold font-montserrat"
            style={{
              color: "var(--theme-heading-text)",
              fontSize: "var(--theme-font-subheading)",
            }}
          >
            User & Role
          </h1>
        </div>

        <div className="relative flex justify-center items-center mb-6">
          <div className="w-full md:w-1/2">
            <SearchBar
              search={search}
              setSearch={setSearch}
              handleSearch={() => {}}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md flex-grow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full border-collapse">
            <thead style={{ backgroundColor: "var(--theme-table-header-bg)" }}>
              <tr
                className="text-[16px]"
                style={{ color: "var(--theme-white-text)" }}
              >
                <th className="px-4 py-3 text-center border-r border-white/20">
                  S.NO
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  STAFF NAME
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  ROLE
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  USER NAME
                </th>
                <th className="px-4 py-3 text-left border-r border-white/20">
                  PASSWORD
                </th>
                <th className="px-4 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-12 text-center font-medium"
                    style={{
                      backgroundColor: "var(--theme-table-row-bg)",
                      color: "var(--theme-muted-text)",
                    }}
                  >
                    No users found. Go to the{" "}
                    <span
                      className="font-bold"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      Employee
                    </span>{" "}
                    tab to grant Login Access.
                  </td>
                </tr>
              ) : (
                paginatedData.map((user, index) => (
                  <tr
                    key={user._id}
                    className="text-[16px] border-b transition font-montserrat hover:opacity-90"
                    style={{
                      backgroundColor: "var(--theme-table-row-bg)",
                      borderColor: "var(--theme-secondary-card-bg)",
                      color: "var(--theme-primary-text)",
                    }}
                  >
                    <td
                      className="px-4 py-3 text-center font-semibold"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      {String(indexOfFirstRow + index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">{user.staffName}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3 font-medium">{user.username}</td>
                    <td
                      className="px-4 py-3 tracking-widest font-bold"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      ******
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-4">
                        {/* Edit */}
                        <div
                          onClick={() => {
                            setSelectedUser(user);
                            SetIsEditUserOpen(true);
                          }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border hover:shadow-lg hover:scale-105 transition-all duration-200"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            borderColor: "var(--theme-secondary-card-bg)",
                          }}
                        >
                          <PencilIcon
                            className="h-5 w-5"
                            style={{ color: "var(--theme-accent)" }}
                          />
                        </div>

                        {/* Delete */}
                        <div
                          onClick={() => {
                            setSelectedUser(user._id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            border: "1px solid #fecaca",
                          }}
                        >
                          <FaRegTrashAlt size={18} className="text-red" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex justify-end py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Modals */}
        {isEditUserOpen && selectedUser && (
          <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md z-[9990] flex justify-center items-start pt-2 px-4 pb-4">
            <div
              className="relative w-[350px] rounded-lg shadow-lg"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <EditUser
                selectedUser={selectedUser}
                onUpdate={(u) =>
                  updateUserMutation.mutate(u, {
                    onSuccess: () => {
                      SetIsEditUserOpen(false);
                      showToast("User updated successfully", "success");
                    },
                    onError: (err) => {
                      showToast(err?.response?.data?.message || "Failed to update user", "error");
                    }
                  })
                }
                onClose={() => SetIsEditUserOpen(false)}
                showToast={showToast}
              />
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <Delete
            setIsOpenDelete={setIsDeleteModalOpen}
            deleteData={deleteData}
            selectedId={selectedUser}
            refetch={() => {}}
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

export default UsersAndRoles;
