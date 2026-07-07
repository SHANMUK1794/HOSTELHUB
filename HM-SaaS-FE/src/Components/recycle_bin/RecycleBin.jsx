import React, { useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Cards";
import DeletedItemsTable from "./DeletedItemsTable";
import { useDeletedItems } from "../../hooks/useDelete";
import ToastMessage from "../common_components/ToastMessage";

function RecycleBin() {
  const [selectedModule, setSelectedModule] = useState("All");

  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  const { data, isLoading, isError } = useDeletedItems(branchName);

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

  const modules = [
    {
      name: "All",
      gradient: "linear-gradient(135deg, #FFED99 0%, #FFFBEA 100%)",
      glowColor: "rgba(234, 106, 18, 0.3)",
    },
    {
      name: "Register",
      gradient: "linear-gradient(135deg, #D0EFFF 0%, #F0F9FF 100%)",
      glowColor: "rgba(56, 189, 248, 0.4)",
    },
    {
      name: "Finance & Utilities",
      gradient: "linear-gradient(135deg, #C2F0DD 0%, #E8FBF4 100%)",
      glowColor: "rgba(52, 211, 153, 0.4)",
    },
    {
      name: "Users & Roles",
      gradient: "linear-gradient(135deg, #E0DDFE 0%, #F5F3FF 100%)",
      glowColor: "rgba(129, 140, 248, 0.4)",
    },
    {
      name: "Kitchen",
      gradient: "linear-gradient(135deg, #FFD3D9 0%, #FFF0F2 100%)",
      glowColor: "rgba(251, 113, 133, 0.4)",
    },
    {
      name: "Store Room",
      gradient: "linear-gradient(135deg, #FFDFB5 0%, #FFF5EC 100%)",
      glowColor: "rgba(253, 186, 116, 0.4)",
    },
    {
      name: "Complaints",
      gradient: "linear-gradient(135deg, #D8DFE8 0%, #F1F4F8 100%)",
      glowColor: "rgba(148, 163, 184, 0.4)",
    },
    {
      name: "Others",
      gradient: "linear-gradient(135deg, #E2E4E8 0%, #F6F7F9 100%)",
      glowColor: "rgba(156, 163, 175, 0.4)",
    },
  ];

  const explicitModules = modules
    .map((m) => m.name)
    .filter((name) => name !== "All" && name !== "Others");

  const normalizeString = (str) => {
    if (!str) return "";
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.includes("finance") || clean.includes("utilit")) return "finance";
    return clean;
  };

  const isModuleMatch = (itemModule, targetModule) => {
    const normalizedItem = normalizeString(itemModule);
    const normalizedTarget = normalizeString(targetModule);
    if (!normalizedItem || !normalizedTarget) return false;
    return (
      normalizedItem === normalizedTarget ||
      normalizedItem.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedItem)
    );
  };

  const filteredItems =
    data
      ?.map((item) => ({
        ...item,
        _id: item._id || item.id,
        module: item.module || "Others",
      }))
      .filter((item) => {
        if (selectedModule === "All") return true;
        if (selectedModule === "Others") {
          return !explicitModules.some((modName) =>
            isModuleMatch(item.module, modName),
          );
        }
        return isModuleMatch(item.module, selectedModule);
      }) || [];

  return (
    <div
      className="min-h-screen flex justify-center font-sans py-8"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      <main className="flex-1 px-4 sm:px-6 lg:px-4 w-full">
        {!branchName && (
          <div
            className="px-4 py-3 rounded-lg mb-6 border"
            style={{
              backgroundColor: "var(--theme-filter-bg)",
              borderColor: "var(--theme-secondary-card-bg)",
              color: "var(--theme-muted-text)",
            }}
          >
            Please select a branch to view deleted items.
          </div>
        )}

        {branchName && (
          <>
            {/* Top Card with module tabs */}
            <div
              className="rounded-[24px] shadow-md pt-6 pb-8 px-6 mb-8"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                border: "1px solid var(--theme-secondary-card-bg)",
              }}
            >
              <h1
                className="font-bold mb-2"
                style={{
                  color: "var(--theme-heading-text)",
                  fontSize: "var(--theme-font-heading)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                Recycle Bin
              </h1>

              <div className="flex items-center justify-between flex-nowrap gap-6 overflow-x-auto px-2 pt-4 scrollbar-hide">
                {modules.map((m, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedModule(m.name)}
                    className="cursor-pointer"
                  >
                    <Card
                      name={m.name}
                      gradient={m.gradient}
                      glowColor={m.glowColor}
                      isSelected={selectedModule === m.name}
                    />
                  </div>
                ))}
              </div>
            </div>

              <DeletedItemsTable
              data={filteredItems}
              selectedModule={selectedModule}
              showToast={showToast}
            />
          </>
        )}
      </main>

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
}

export default RecycleBin;
