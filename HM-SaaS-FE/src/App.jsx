import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/sidebar/Sidebar";
import { route1 } from "./utils/AppRoutes";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./hooks/ThemeContext";

function AppInner() {
  const location = useLocation();

  const hideSidebarRoutes = ["/", "/signup", "/reset", "/welcome", "/onboard", "/subscription"];
  const hideHeaderRoutes = ["/", "/signup", "/reset", "/welcome", "/onboard", "/subscription"];
  const publicPaths = ["/", "/signup", "/reset"];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" richColors />
      <ToastContainer position="top-center" autoClose={2000} />

      {!shouldHideHeader && <Header />}

      {/* Use CSS variable for bg so ThemeContext controls it */}
      <div
        className="flex h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
        style={{
          backgroundColor: "var(--theme-app-bg)",
          fontFamily: "var(--theme-font-family-primary)",
          color: "var(--theme-primary-text)",
        }}
      >
        {!shouldHideSidebar && <Sidebar />}

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${!shouldHideHeader ? "mt-[87px]" : ""} ${!shouldHideSidebar ? "max-[555px]:ml-0 min-[556px]:ml-[70px] lg:ml-[240px] 2xl:ml-[210px]" : ""}`}
          style={{ backgroundColor: "var(--theme-app-bg)" }}
        >
          <Routes>
            {route1.map((ele) => {
              if (publicPaths.includes(ele.path)) {
                return (
                  <Route path={ele.path} element={ele.element} key={ele.id} />
                );
              }
              return (
                <Route
                  path={ele.path}
                  key={ele.id}
                  element={<ProtectedRoute>{ele.element}</ProtectedRoute>}
                />
              );
            })}
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
