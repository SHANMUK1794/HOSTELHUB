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
            <img
              src={"https://asset.techjose.com/Hostelos/confirm.png"}
              alt="confirm"
            />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1 text-[#FF0000] gap-2 flex items-center border-[#FF0000] border-[2px] rounded-md transition disabled:opacity-50"
          >
            Cancel{" "}
            <img
              src={"https://asset.techjose.com/Hostelos/Cancel.png"}
              alt="cancel"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;