import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  search,
  setSearch,
  handleSearch,
  placeholder,
  containerClass,
  inputClass,
  btnClass,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && handleSearch) {
      handleSearch();
    }
  };

  return (
    <div
      className={
        containerClass ||
        "flex items-center justify-between sm:flex-row gap-2 rounded-full p-1 w-[500px]"
      }
      style={
        !containerClass
          ? {
              border: "2px solid var(--theme-secondary-card-bg)",
              background: "var(--theme-card-bg)",
            }
          : undefined
      }
    >
      <div className="flex-1">
        <input
          className={
            inputClass ||
            "text-sm outline-none w-full placeholder:text-gray-400 bg-transparent"
          }
          style={
            !inputClass ? { color: "var(--theme-primary-text)" } : undefined
          }
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder || "    Search Name..."}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div
        onClick={handleSearch}
        className={
          btnClass ||
          "rounded-full items-center flex w-7 h-7 justify-center flex-shrink-0 cursor-pointer hover:opacity-90 transition"
        }
        style={!btnClass ? { background: "var(--theme-button-bg)" } : undefined}
      >
        <FaSearch className="text-white text-sm" />
      </div>
    </div>
  );
};

export default SearchBar;
