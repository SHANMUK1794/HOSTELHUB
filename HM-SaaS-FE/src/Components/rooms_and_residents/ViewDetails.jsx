// import idIcon from "../../assets/idIcon.png";
// import telephoneIcon from "../../assets/telephoneIcon.png";

const ViewDetails = ({ selectedRoom, onClose }) => {
  const residents = selectedRoom.users || [];

  return (
    <div
      className="font-inter flex flex-col bg-white2 
        md:w-[680px] 
        w-[320px]
        rounded-lg p-2 md:p-8
        md:h-auto h-[500px] overflow-y-auto md:overflow-visible"
    >
      <div className="relative left-[620px] top-[-30px]">
        <button
          className="text-black  whitespace-nowrap text-[25px]"
          onClick={onClose}
        >
          x
        </button>
      </div>
      {/* heading */}
      <div className="flex flex-col md:flex-row items-start  justify-between mb-4">
        <h1 className="text-black font-bold text-[18px] break-words max-w-full">
          Room No: {selectedRoom.RoomNo}
        </h1>
        
        <div className="flex flex-col text-Black gap-1 md:gap-2 md:pt-0">
          <p className="break-words text-xs">Type: {selectedRoom.RoomType}</p>
          <p className="break-words text-xs">
            Occupied: {selectedRoom.Occupied}/{selectedRoom.Capacity}
          </p>
        </div>
      </div>

      {/* residents container */}
      <div className="w-full flex flex-wrap justify-center gap-4">
        {residents.map((resident, index) => (
          <div
            key={index}
            className="bg-white rounded-[15px] 
              md:w-[180px] md:h-[230px] 
              w-full max-w-[260px] h-auto min-h-[150px] 
              flex flex-col justify-between p-4"
          >
            <div className="flex flex-col items-center gap-3">
              <h5 className="text-[15px] font-bold text-secondaryLiteBg break-words text-center">
                {resident.Name}
              </h5>

              <div className="flex flex-col gap-1 text-liteBlack text-[14px] w-full">
                <div className="flex gap-2 items-center break-words">
                  <img
                    src={"https://asset.techjose.com/Hostelos/telephoneIcon.png"}
                    alt="telephone icon"
                    className="w-4 h-4"
                  />
                  <p className="truncate">{resident.MobileNo}</p>
                </div>

                <div
                  className="flex gap-2 items-center break-words max-w-full pr-4"
                  style={{ paddingRight: "1rem" }}
                >
                  <img src={"https://asset.techjose.com/Hostelos/idIcon.png"} alt="id icon" className="w-4 h-4" />
                  <p className="break-words max-w-full">{resident.AddharNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center mt-1 md:mt-1 lg:mt-1">
              <h5 className="text-[13px] font-bold text-secondaryLiteBg text-center">
                Address
              </h5>

              <p className="text-liteBlack text-[14px] text-center break-words">
                {resident.PermanentAddress || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* button */}
      
    </div>
  );
};

export default ViewDetails;
