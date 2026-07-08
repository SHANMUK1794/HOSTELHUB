import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "sonner";
import { useTheme } from "../../hooks/ThemeContext";

const CreateTenant = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    organizationName: "",
    branchName: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.organizationName,
        branches: [formData.branchName || "Main Branch"],
      };
      const response = await axiosInstance.post(
        "/api/tenant/v1/create",
        payload,
      );
      if (response.data.success) {
        const tenant = response.data.data;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userObj.tenantId = tenant.id || tenant._id;
            localStorage.setItem("user", JSON.stringify(userObj));
          } catch (e) {
            console.error("Error updating user tenantId in localStorage", e);
          }
        }
        toast.success("Organization created successfully!");
        window.location.href = "/Dashboard";
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.request
          ? "Backend is not reachable. Check VITE_API_URL in Cloudflare Pages and CORS on Railway."
          : "Failed to create organization");

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: "48px",
    borderRadius: "10px",
    border: "1px solid color-mix(in srgb, var(--theme-primary-text) 15%, transparent)",
    background: "var(--theme-card-bg)",
    color: "var(--theme-primary-text)",
    padding: "0 16px",
    fontSize: "var(--theme-font-small)",
    fontFamily: "var(--theme-font-family-primary)",
    outline: "none",
    transition: "all 0.18s ease",
  };

  const textareaStyle = {
    ...inputStyle,
    height: "100px",
    padding: "12px 16px",
    resize: "none",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"
      style={{
        background: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* ── LEFT: Branding Panel ── */}
        <div
          className="hidden lg:flex flex-col justify-between rounded-3xl p-10 h-full min-h-[560px] relative overflow-hidden"
          style={{ background: "var(--theme-sidebar-bg)" }}
        >
          {/* Background blob */}
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: "var(--theme-secondary-card-bg)" }}
          />
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
            style={{ background: "var(--theme-card-bg)" }}
          />

          {/* Logo */}
          <div className="z-10">
            <div className="text-3xl font-extrabold tracking-widest text-white mb-8 bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              HostelHub
            </div>
            <h1
              className="text-4xl font-extrabold mb-4 leading-tight"
              style={{ color: "var(--theme-white-text)" }}
            >
              Set Up Your
              <br />
              Organization
            </h1>
            <p
              className="text-sm leading-relaxed opacity-80"
              style={{ color: "var(--theme-white-text)" }}
            >
              Create your hostel or PG workspace in seconds. Manage rooms,
              staff, finances, and more — all in one place.
            </p>
          </div>

          {/* Steps */}
          <div className="z-10 space-y-4 mt-8">
            {[
              { step: "01", text: "Enter your organization name" },
              { step: "02", text: "Name your first branch" },
              { step: "03", text: "Start managing your hostel" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "var(--theme-white-text)",
                  }}
                >
                  {item.step}
                </div>
                <p
                  className="text-sm font-medium opacity-90"
                  style={{ color: "var(--theme-white-text)" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Banner image strip */}
          <div className="z-10 mt-8 rounded-2xl overflow-hidden opacity-60 h-28">
            <img
              src={
                theme.bannerImage ||
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
              }
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div
          className="rounded-3xl p-8 shadow-sm"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-6">
            <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">
              HostelHub
            </span>
          </div>

          <h2
            className="text-2xl font-extrabold mb-1"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Create Organization
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--theme-muted-text)" }}
          >
            Let's get your hostel / PG set up. Fill in the details below to
            continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization Name */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Organization Name{" "}
                <span style={{ color: "var(--theme-accent)" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kasthuri Hostels"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--theme-accent)";
                  e.target.style.background = "color-mix(in srgb, var(--theme-primary-text) 3%, var(--theme-card-bg))";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "color-mix(in srgb, var(--theme-primary-text) 15%, transparent)";
                  e.target.style.background = "var(--theme-card-bg)";
                }}
              />
            </div>

            {/* Branch Name */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--theme-primary-text)" }}
              >
                First Branch Name{" "}
                <span style={{ color: "var(--theme-accent)" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Main Branch"
                value={formData.branchName}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--theme-accent)";
                  e.target.style.background = "color-mix(in srgb, var(--theme-primary-text) 3%, var(--theme-card-bg))";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "color-mix(in srgb, var(--theme-primary-text) 15%, transparent)";
                  e.target.style.background = "var(--theme-card-bg)";
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Description{" "}
                <span
                  style={{ color: "var(--theme-muted-text)", fontWeight: 400 }}
                >
                  (Optional)
                </span>
              </label>
              <textarea
                placeholder="Brief description of your business..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={textareaStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--theme-accent)";
                  e.target.style.background = "color-mix(in srgb, var(--theme-primary-text) 3%, var(--theme-card-bg))";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "color-mix(in srgb, var(--theme-primary-text) 15%, transparent)";
                  e.target.style.background = "var(--theme-card-bg)";
                }}
              />
            </div>

            {/* Divider */}
            <div
              className="h-px w-full"
              style={{ background: "rgba(0,0,0,0.07)" }}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] rounded-[10px] font-semibold text-[15px] transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
              style={{
                background: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--theme-accent-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--theme-button-bg)")
              }
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </button>

            {/* Error */}
            {error && (
              <p
                className="text-center text-sm font-medium p-3 rounded-xl"
                style={{
                  color: "#DC2626",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTenant;
