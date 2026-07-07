import { useEffect, useState } from "react";
import useCertificate from "../../hooks/useCertificate";
import LottieLoader from "../common_components/LottieLoader";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Delete from "../common_components/Delete";
import CertificatesForm from "./CertificatesForm";
import CertificatesUpdateForm from "./CertificatesUpdateForm";
import Pagination from "../common_components/Pagination";
import ToastMessage from "../common_components/ToastMessage";

const Certificates = () => {
  const {
    data,
    isLoading,
    deleteCertificate: originalDeleteCertificate,
    refetch,
  } = useCertificate();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  
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

  const deleteCertificate = async (id) => {
    try {
      await originalDeleteCertificate(id);
      setFilteredData((prev) => prev.filter((item) => item._id !== id));
      refetch();
      showToast("Certificate deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast(err?.response?.data?.message || "Failed to delete certificate", "error");
    }
  };

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const result = data.data.filter(
        (e) =>
          String(e.certificate_name)
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          String(e.certificate_no)
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          String(e.remainder_date)
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          String(e.renewal_date)
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      );
      setFilteredData(result);
      setCurrentPage(1);
    } else {
      setFilteredData([]);
    }
  }, [data, searchValue]);

  const handleEditData = (rowData) => {
    setIsOpenUpdateForm(true);
    setSelectedRowData(rowData);
  };

  useEffect(() => {
    refetch();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div
      className="p-4 md:p-6 min-h-screen"
      style={{
        backgroundColor: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      {/* Top Controls Card */}
      <div
        className="rounded-xl shadow-sm p-6 mb-6"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <h1
          className="text-[28px] md:text-[32px] font-bold mb-6"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Certificate
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 flex justify-start w-full max-w-xl">
            <div
              className="flex items-center rounded-full px-4 py-1 w-full"
              style={{ border: "1px solid var(--theme-secondary-card-bg)" }}
            >
              <input
                className="w-full outline-none text-sm bg-transparent"
                style={{
                  color: "var(--theme-primary-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                  backgroundColor: "transparent",
                }}
                type="text"
                placeholder="Search Name / Room / Mobile"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div
                className="rounded-full p-2 flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
              >
                <MagnifyingGlassIcon
                  className="w-4 h-4 font-bold"
                  style={{ color: "var(--theme-button-text)" }}
                />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="w-full md:w-auto flex justify-end">
            <button
              onClick={() => setIsOpen(true)}
              className="px-5 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 w-full md:w-auto hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              <PlusIcon className="w-5 h-5" />
              Add Certificates
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div
        className="rounded-xl shadow-sm overflow-hidden"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-secondary-card-bg)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead style={{ backgroundColor: "var(--theme-table-header-bg)" }}>
              <tr>
                {[
                  "S.NO",
                  "Certificate Name",
                  "Certificate No",
                  "Remainder Date",
                  "Renewal Date",
                  "Renewal Days Left",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 font-medium text-[16px] leading-[20px] tracking-[0.7px] uppercase text-left"
                    style={{
                      color: "var(--theme-white-text)",
                      fontFamily: "var(--theme-font-family-secondary)",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody style={{ fontFamily: "var(--theme-font-family-primary)" }}>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    <LottieLoader />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No records available.
                  </td>
                </tr>
              ) : (
                paginatedData.map((ele, idx) => (
                  <tr
                    key={ele._id}
                    className="border-b transition-colors"
                    style={{
                      borderColor: "var(--theme-secondary-card-bg)",
                      backgroundColor: "var(--theme-table-row-bg)",
                      color: "var(--theme-primary-text)",
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
                    <td className="px-6 py-4 font-medium text-[18px] leading-[30px]">
                      {indexOfFirstRow + idx + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-[18px] leading-[30px]">
                      {ele.certificate_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-[18px] leading-[30px]">
                      {ele.certificate_no}
                    </td>
                    <td className="px-6 py-4 font-medium text-[18px] leading-[30px]">
                      {formatDate(ele.remainder_date)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[18px] leading-[30px]">
                      {formatDate(ele.renewal_date)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[18px] leading-[30px]">
                      {ele.daysUntilRenewal || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <div
                          onClick={() => handleEditData(ele)}
                          className="p-2 rounded-md transition cursor-pointer flex items-center justify-center hover:opacity-80"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            border: "1px solid var(--theme-secondary-card-bg)",
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600 cursor-pointer hover:scale-110 transition-all duration-200">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>
                        </div>
                        <div
                          onClick={() => {
                            setIsOpenDelete(true);
                            setSelectedId(ele._id);
                          }}
                          className="p-2 rounded-md transition cursor-pointer flex items-center justify-center hover:opacity-80"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            border: "1px solid #fecaca",
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition-all duration-200">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div
            className="flex justify-end py-4 px-6 border-t"
            style={{ borderColor: "var(--theme-secondary-card-bg)" }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <CertificatesForm setIsOpen={setIsOpen} showToast={showToast} />
        </div>
      )}
      {isOpenUpdateForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <CertificatesUpdateForm
            setIsOpenUpdateForm={setIsOpenUpdateForm}
            selectedRowData={selectedRowData}
            showToast={showToast}
          />
        </div>
      )}
      {isOpenDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            deleteData={deleteCertificate}
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
    </div>
  );
};

export default Certificates;
