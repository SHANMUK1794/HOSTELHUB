import { TrashIcon } from "@heroicons/react/24/outline";
import { FaSearch, FaRegEye } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useRoomsResidents } from "../../hooks/useRoomsResident";

import LottieLoader from "../../Components/common_components/LottieLoader";
import Pagination from "../common_components/Pagination";
import AddRoomForm from "./AddRoomForm";
import SwapConfirmModal from "./SwapConfirmModal";
import ViewRoomModal from "./ViewRoomModal";
import EditRoomDetails from "./EditRoomDetails";
import Delete from "../common_components/Delete";

const PGTable = ({ showToast }) => {
  const { deleteRoomMutation, updateRoomMutation, isLoading } =
    useRoomsResidents({ showToast });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [roomToSwap, setRoomToSwap] = useState(null);
  const [toggleStates, setToggleStates] = useState({});

  const allRooms = useSelector((state) => state.rooms.rooms) || [];

  const filteredRooms = allRooms.filter((room) => {
    if (!room) return false;
    const isPG = room.category?.toString().trim().toLowerCase() === "pg";
    const roomNo = room.RoomNo?.toString().toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = roomNo.includes(searchLower);
    const matchesType = typeFilter === "All" || room.RoomType === typeFilter;
    const actualOccupied = Number(room.Occupied) || 0;
    

    const capacity = Number(room.Capacity) || 0;
    let currentStatus = "";
    if (actualOccupied === 0) currentStatus = "Vacant";
    else if (actualOccupied >= capacity) currentStatus = "Full";
    else currentStatus = "Partial";

    const matchesStatus =
      statusFilter === "All" || currentStatus === statusFilter;
    return isPG && matchesSearch && matchesType && matchesStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRooms.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedRooms = filteredRooms.slice(indexOfFirstRow, indexOfLastRow);

  const handleDeleteAction = async (id) => {
    return await deleteRoomMutation.mutateAsync(id);
  };

  const handleToggleClick = (room) => {
    setRoomToSwap(room);
    setIsSwapModalOpen(true);
  };

  const handleCloseSwapModal = () => {
    if (roomToSwap) {
      setToggleStates((prev) => ({ ...prev, [roomToSwap._id]: false }));
    }
    setIsSwapModalOpen(false);
    setRoomToSwap(null);
  };

  const handleConfirmSwap = async () => {
    if (!roomToSwap) return;
    const payload = { ...roomToSwap, category: "Resident" };
    try {
      await updateRoomMutation.mutateAsync(payload);
      setToggleStates((prev) => ({ ...prev, [roomToSwap._id]: false }));
      setIsSwapModalOpen(false);
      setRoomToSwap(null);
    } catch (err) {
      console.error("Swap failed", err);
    }
  };

  const filterSelectStyle = {
    backgroundColor: "var(--theme-filter-bg)",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };

  console.log("Filtered Rooms PG Table:", filteredRooms);
  console.log("Paginated Rooms PG Table:", paginatedRooms);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-md outline-none text-sm font-medium cursor-pointer"
            style={filterSelectStyle}
          >
            <option value="All">Type</option>
            <option value="All">All</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-md outline-none text-sm font-medium cursor-pointer"
            style={filterSelectStyle}
          >
            <option value="All">Status</option>
            <option value="All">All</option>
            <option value="Full">Full</option>
            <option value="Partial">Partial</option>
            <option value="Vacant">Vacant</option>
          </select>
        </div>

        <div className="flex-1 max-w-[700px] relative">
          <input
            type="text"
            placeholder="Search by Room"
            className="w-full border-2 border-gray-100 rounded-full py-2 px-6 pr-12 outline-none text-sm"
            style={{
              fontFamily: "var(--theme-font-family-primary)",
              color: "var(--theme-primary-text)",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--theme-accent)")
            }
            onBlur={(e) => (e.target.style.borderColor = "#f3f4f6")}
          />
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full"
            style={{ backgroundColor: "var(--theme-button-bg)" }}
          >
            <FaSearch className="text-white text-xs" />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          + Add Details
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[450px]">
        <table className="w-full">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--theme-table-header-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              {[
                "Floor No",
                "Room No",
                "Type",
                "Capacity",
                "Occupied",
                "Vacant",
                "Rent",
                "Status",
                "Swap to Resident",
                "Action",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`p-3 px-4 text-left text-xs font-bold uppercase ${i === 0 ? "rounded-tl-xl" : ""} ${i === 9 ? "rounded-tr-xl" : ""}`}
                  style={{ fontFamily: "var(--theme-font-family-primary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="10" className="text-center py-10">
                  <LottieLoader />
                </td>
              </tr>
            ) : paginatedRooms.length > 0 ? (
              paginatedRooms.map((room) => {
                const actualOccupied = Number(room.Occupied) || 0;
const vacant = Number(room.Vacant) || 0;
                const capacity = Number(room.Capacity) || 0;
                const displayStatus =
                  actualOccupied >= capacity
                    ? "Full"
                    : actualOccupied === 0
                      ? "Vacant"
                      : "Partial";

                return (
                  <tr key={room._id} className="hover:bg-gray-50 border-b">
                    <td
                      className="p-4 text-sm font-semibold border-b border-l"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {room.Floor}
                    </td>
                    <td
                      className="p-4 text-sm border-b font-semibold"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {room.RoomNo}
                    </td>
                    <td
                      className="p-4 text-sm border-b"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {room.RoomType}
                    </td>
                    <td
                      className="p-4 text-sm border-b"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {capacity}
                    </td>
                    <td
                      className="p-4 text-sm border-b"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {actualOccupied}
                    </td>
                    <td
                      className="p-4 text-sm border-b"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {vacant}
                    </td>
                    <td
                      className="p-4 text-sm border-b font-bold"
                      style={{ color: "var(--theme-heading-text)" }}
                    >
                      ₹{room.Rate}
                    </td>
                    <td
                      className={`p-4 text-sm border-b font-medium ${
                        displayStatus === "Full"
                          ? "text-red-500"
                          : displayStatus === "Vacant"
                            ? "text-green-500"
                            : "text-orange-500"
                      }`}
                    >
                      {displayStatus}
                    </td>

                    {/* Toggle */}
                    <td className="p-4 border-b">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={toggleStates[room._id] || false}
                          onChange={() => {
                            setToggleStates((prev) => ({
                              ...prev,
                              [room._id]: !prev[room._id],
                            }));
                            handleToggleClick(room);
                          }}
                        />
                        <div
                          className="w-11 h-5 bg-gray-300 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                          style={{
                            "--tw-peer-checked-bg": "var(--theme-accent)",
                          }}
                        >
                          <style>{`input:checked ~ div { background-color: var(--theme-accent) !important; }`}</style>
                        </div>
                      </label>
                    </td>

                    {/* Actions */}
                    <td className="p-4 py-6 flex gap-2 border-b border-r">
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsViewOpen(true);
                        }}
                        className="p-1.5 rounded"
                        style={{
                          backgroundColor: "var(--theme-filter-bg)",
                          color: "var(--theme-primary-text)",
                        }}
                      >
                        <FaRegEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setRoomToEdit(room);
                          setIsEditOpen(true);
                        }}
                        className="p-1.5 rounded"
                        style={{
                          backgroundColor: "var(--theme-filter-bg)",
                          color: "var(--theme-primary-text)",
                        }}
                      >
                        <RiPencilFill className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(room._id);
                          setIsOpenDelete(true);
                        }}
                        className="p-1.5 border border-red-100 rounded hover:bg-red-100 transition-colors"
                        style={{ backgroundColor: "var(--theme-filter-bg)" }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-gray-400">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end py-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 pt-0 pb-10 md:pl-[240px]">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <AddRoomForm onClose={() => setIsModalOpen(false)} category="PG" showToast={showToast} />
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedRoom && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 pt-0 pb-10 md:pl-[240px]">
          <div
            className="absolute inset-0"
            onClick={() => setIsViewOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-6xl">
            <ViewRoomModal
              room={selectedRoom}
              onClose={() => setIsViewOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && roomToEdit && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 pt-0 pb-10 md:pl-[240px]">
          <div
            className="absolute inset-0"
            onClick={() => setIsEditOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <EditRoomDetails
              selectedRoom={roomToEdit}
              onClose={() => setIsEditOpen(false)}
              onUpdate={(updatedData) => updateRoomMutation.mutate(updatedData)}
              showToast={showToast}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isOpenDelete && (
        <Delete
          setIsOpenDelete={setIsOpenDelete}
          deleteData={handleDeleteAction}
          selectedId={deleteId}
          refetch={() => {}}
        />
      )}

      {/* Swap Modal */}
      <SwapConfirmModal
        isOpen={isSwapModalOpen}
        targetMode="Resident"
        room={roomToSwap}
        onClose={handleCloseSwapModal}
        onConfirm={handleConfirmSwap}
      />
    </div>
  );
};

export default PGTable;
