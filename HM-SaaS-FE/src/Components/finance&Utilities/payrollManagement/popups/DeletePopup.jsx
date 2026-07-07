import React from "react";
// import Confirm from '../../../../assets/confirm.png';
// import Cancel from '../../../../assets/Cancel.png';
const DeletePopup = ({ onClose, onConfirm }) => {

  const handleConfirm = () => {
    if (onConfirm) onConfirm(); // delete API call + toast from parent
    onClose(); // close popup immediately
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
        <h2 className="text-xl font-bold text-center mb-6">
          Are you sure want to Delete this Data?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="px-4 py-1 text-[#324371] gap-2 flex items-center rounded-md border-[2px] border-[#324371] transition disabled:opacity-50"
          >
            Confirm{" "}
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
</div>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1 text-[#FF0000] gap-2 flex items-center border-[#FF0000] border-[2px] rounded-md transition disabled:opacity-50"
          >
            Cancel{" "}
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;