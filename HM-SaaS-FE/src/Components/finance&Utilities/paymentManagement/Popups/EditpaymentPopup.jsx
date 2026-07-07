// import React, { useState } from "react";

// const EditPaymentPopup = ({ onClose, onSave, initialData }) => {
//   const [data, setData] = useState(initialData || {
//     name: "",
//     roomNo: "",
//     total: "",
//     paidAmount: "",
//     paymentMode: "Cash",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
//       <div className="bg-[#f5f5f5] rounded-md shadow-lg w-full max-w-md p-6 relative">
//         <h2 className="text-xl font-bold text-purple-800 mb-6">Edit Payment</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-medium">Name</label>
//             <input
//               name="name"
//               value={data.name}
//               onChange={handleChange}
//               className="w-full border rounded-md px-3 py-2 mt-1"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-sm font-medium">Room No.</label>
//               <input
//                 name="roomNo"
//                 value={data.roomNo}
//                 onChange={handleChange}
//                 className="w-full border rounded-md px-3 py-2 mt-1"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Total</label>
//               <input
//                 name="total"
//                 value={data.total}
//                 readOnly
//                 className="w-full border rounded-md px-3 py-2 mt-1"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Paid Amount</label>
//             <input
//               name="paidAmount"
//               value={data.paidAmount}
//               onChange={handleChange}
//               className="w-full border rounded-md px-3 py-2 mt-1"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Payment Mode</label>
//             <select
//               name="paymentMode"
//               value={data.paymentMode}
//               onChange={handleChange}
//               className="w-full border rounded-md px-3 py-2 mt-1"
//             >
//               <option value="Cash">Cash</option>
//               <option value="Card">Card</option>
//               <option value="UPI">UPI</option>
//             </select>
//           </div>

//           <div className="flex justify-end">
//             <button
//               onClick={() => onSave(data)}
//               className="bg-purple-800 text-white px-5 py-2 rounded-md hover:bg-purple-900"
//             >
//               Save
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={onClose}
//           className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditPaymentPopup;
