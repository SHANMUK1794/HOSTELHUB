import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAchievements from "../../hooks/useAchievements";
import Delete from "../common_components/Delete";
import AchievementsForm from "./AchievementsForm";
import AchievementsUpdateForm from "./AchievementsUpdateForm";
import LottieLoader from "../../Components/common_components/LottieLoader";
import Pagination from "../common_components/Pagination";
import { FaSearch } from "react-icons/fa";
import ToastMessage from "../common_components/ToastMessage";

const Achievements = () => {
  const {
    data: achievementsResponse,
    deleteAchieveData,
    refetch,
    isLoading,
  } = useAchievements();

  const data = Array.isArray(achievementsResponse)
    ? achievementsResponse
    : achievementsResponse?.data || [];

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenFormUpdate, setIsOpenFormUpdate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState({});
  const navigate = useNavigate();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const getBranchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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

  const handleEditData = (rowData) => {
    setSelectedRowData(rowData);
    setIsOpenFormUpdate(true);
  };

  useEffect(() => {
    refetch();
  }, [getBranchName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredData = data.filter(
    (item) =>
      item?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item?.roomno?.toString().includes(searchValue) ||
      item?.branchName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item?.position?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  return (
    <>
      <div
        className="px-4 md:px-10 pt-2 m-4 lg:ml-15 rounded-xl shadow-md overflow-hidden border border-[#D9D9D9]"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-10">
          <div
            className="mt-8 flex items-center font-bold text-[32px]"
            style={{
              color: "var(--theme-heading-text)",
              fontSize: "var(--theme-font-heading)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Achievements
          </div>

          <div className="flex flex-col justify-between lg:flex-row md:justify-between lg:items-center lg:justify-between gap-3 w-full">
            {/* Search Input */}
            <div className="w-full lg:w-[600px] flex justify-start">
              <div
                className="flex items-center gap-2 rounded-full py-1.5 px-4 border w-full"
                style={{
                  borderColor: "#B0B0B0",
                  backgroundColor: "var(--theme-card-bg)",
                }}
              >
                <input
                  className="text-sm outline-none w-full px-2"
                  style={{
                    color: "var(--theme-primary-text)",
                    backgroundColor: "transparent",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                  type="text"
                  placeholder="Search name / Room no."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div
                  className="rounded-full flex items-center justify-center w-6 h-6 flex-shrink-0 cursor-pointer"
                  style={{ backgroundColor: "var(--theme-button-bg)" }}
                >
                  <FaSearch
                    className="text-sm"
                    style={{ color: "var(--theme-button-text)" }}
                  />
                </div>
              </div>
            </div>

            {/* Add Button */}
            <div className="w-full lg:w-auto flex justify-start lg:justify-end">
              <button
                onClick={() => setIsOpenForm(true)}
                className="px-4 py-2 rounded-xl text-[14px] flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                <PlusIcon
                  className="w-5 h-5"
                  style={{ color: "var(--theme-button-text)" }}
                />
                Add New Details
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5">
          <div
            className="overflow-x-auto border-gray-300 border-[1px] rounded-[6px]"
            style={{ backgroundColor: "var(--theme-table-row-bg)" }}
          >
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead
                style={{ backgroundColor: "var(--theme-table-header-bg)" }}
              >
                <tr className="border-b-2 border-gray-200">
                  {[
                    "S NO.",
                    "Name",
                    "Floor No.",
                    "Room No.",
                    "DATE",
                    "Position",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-4 font-[600] text-[16px] leading-[100%] tracking-[0%] align-bottom"
                      style={{
                        color: "var(--theme-button-text)",
                        fontFamily: "var(--theme-font-family-primary)",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody style={{ backgroundColor: "var(--theme-table-row-bg)" }}>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 border-b">
                      <LottieLoader />
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5 font-bold border-b"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      No records available.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((achieve, idx) => (
                    <tr
                      key={achieve._id || idx}
                      className="text-sm border-b border-[#CDCDCD] text-left font-bold"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      <td
                        className="px-4 py-4 font-[500] text-[16px] leading-[100%] tracking-[0%] align-bottom"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      <td>
                        <h3
                          className="cursor-pointer px-4 py-4 font-[500] text-[16px] leading-[100%] tracking-[0%] align-bottom"
                          style={{
                            color: "var(--theme-primary-text)",
                            fontFamily: "var(--theme-font-family-primary)",
                          }}
                          onClick={() =>
                            navigate("/AchievementView", { state: { achieve } })
                          }
                        >
                          {achieve.name}
                        </h3>
                      </td>
                      {[
                        achieve.floorno,
                        achieve.roomno,
                        formatDate(achieve.date),
                        achieve.position,
                      ].map((val, i) => (
                        <td
                          key={i}
                          className="px-4 py-4 font-[500] text-[16px] leading-[100%] tracking-[0%] align-bottom"
                          style={{
                            color: "var(--theme-primary-text)",
                            fontFamily: "var(--theme-font-family-primary)",
                          }}
                        >
                          {val}
                        </td>
                      ))}
                      <td className="p-2">
                        <div className="flex gap-3">
                          <div
                            onClick={() => handleEditData(achieve)}
                            className="p-2 rounded-md hover:opacity-80 transition cursor-pointer flex items-center justify-center"
                            style={{ backgroundColor: "var(--theme-card-bg)" }}
                          >
                            <img
                              src="https://asset.techjose.com/Hostelos/basileditoutline.png"
                              alt="Edit"
                              className="w-5 h-5"
                            />
                          </div>
                          <div
                            onClick={() => {
                              setIsOpenDelete(true);
                              setSelectedId(achieve._id);
                            }}
                            className="p-2 rounded-md hover:opacity-80 transition cursor-pointer flex items-center justify-center"
                            style={{ backgroundColor: "var(--theme-card-bg)" }}
                          >
                            <img
                              src="https://asset.techjose.com/Hostelos/materialsymbolsdeleteoutline.png"
                              alt="Delete"
                              className="w-5 h-5"
                            />
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
          {filteredData.length > 0 && (
            <div className="flex justify-end mt-4 mb-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isOpenForm && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-2 px-4 pb-4 z-[9990]">
          <AchievementsForm setIsOpenForm={setIsOpenForm} showToast={showToast} />
        </div>
      )}

      {isOpenFormUpdate && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-2 px-4 pb-4 z-[9990]">
          <AchievementsUpdateForm
            setIsOpenFormUpdate={setIsOpenFormUpdate}
            selectedRowData={selectedRowData}
            showToast={showToast}
          />
        </div>
      )}

      {isOpenDelete && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-2 px-4 pb-4 z-[9990]">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            deleteData={(id) => deleteAchieveData(id).then(() => showToast("Achievement deleted successfully", "success")).catch(err => { showToast(err?.response?.data?.message || "Failed to delete achievement", "error"); throw err; })}
            selectedId={selectedId}
            refetch={refetch}
          />
        </div>
      )}

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default Achievements;
