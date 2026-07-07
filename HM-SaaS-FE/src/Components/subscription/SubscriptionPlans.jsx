import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../utils/axiosInstance";

const SubscriptionPlans = () => {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async (planName) => {
    try {
      setLoading(planName);
      const res = await axiosInstance.post("/api/subscription/v1/activate", { planName });
      if (res.data?.success) {
        toast.success(`Successfully activated the ${planName} plan!`);
        navigate("/Dashboard");
      } else {
        toast.error(res.data?.message || "Failed to activate subscription");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during activation");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#1a237e] sm:text-5xl">
            Plans that grow with your mission
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your hostel journey. Start small, manage with excellence, and scale with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Shepherd Plan */}
          <div className="bg-white rounded-3xl border-2 border-green-100 shadow-xl overflow-hidden flex flex-col relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="p-8 flex-1">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-center text-green mb-2">Shepherd</h3>
              <p className="text-center text-gray-500 mb-6">From humble beginnings.</p>
              
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <span className="text-2xl font-bold text-green block">14-Day Free Trial</span>
                <span className="text-gray-500 text-sm">Full Access to HostelHub Features</span>
              </div>

              
              <ul className="space-y-4 mb-8 text-sm">
                {[
                  "Access to all core modules",
                  "Unlimited Residents & Rooms",
                  "Payment & Expense Management",
                  "Payroll Management",
                  "Kitchen Management",
                  "Complaint Management",
                  "Reports & Analytics",
                  "Free Setup Assistance",
                  "Automated WhatsApp Messages (10/day)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-100 pt-6">
                <p className="text-red-500 font-semibold mb-4 text-sm">Not Included in Trial:</p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Dedicated WhatsApp Business Setup",
                    "Branded WhatsApp Messaging",
                    "Custom WhatsApp Message Templates",
                    "Multi-Hostel Management"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-400">
                      <svg className="h-5 w-5 text-red mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-8 pt-0">
              <button
                onClick={() => handleSubscribe("Shepherd")}
                disabled={loading !== null}
                className="w-full py-4 px-6 bg-green hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md disabled:opacity-50"
              >
                {loading === "Shepherd" ? "Activating..." : "Start Your 14-Day Free Trial"}
              </button>
            </div>
          </div>

          {/* Anointed Plan */}
          <div className="bg-white rounded-3xl border-2 border-yellow-200 shadow-xl overflow-hidden flex flex-col relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="p-8 flex-1">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-center text-yellow-500 mb-2">Anointed</h3>
              <p className="text-center text-gray-500 mb-6">Chosen to lead.</p>
              
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <span className="text-4xl font-extrabold text-gray-900 block">₹999 <span className="text-lg font-medium text-gray-500">/ Month</span></span>
              </div>
              
              <p className="text-center text-yellow-600 font-semibold mb-6">Everything you need to run your hostel efficiently.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  "Long-Term Resident Management",
                  "PG Resident Management",
                  "Unlimited Residents",
                  "Unlimited Rooms",
                  "Room Allocation & Transfers",
                  "Payment Management",
                  "Daily Expense Tracking",
                  "Payroll Management",
                  "Kitchen Management",
                  "Attendance Management",
                  "Vacation Tracking",
                  "Complaints Management",
                  "Store Room Management",
                  "Users & Role Management",
                  "Birthday Reminders",
                  "Automated WhatsApp Messages",
                  "Reports & Analytics",
                  "Free Setup Assistance"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 pt-0">
              <button
                onClick={() => handleSubscribe("Anointed")}
                disabled={loading !== null}
                className="w-full py-4 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold text-lg transition-colors shadow-md disabled:opacity-50"
              >
                {loading === "Anointed" ? "Processing..." : "Choose Anointed Plan"}
              </button>
            </div>
          </div>

          {/* King Plan */}
          <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl overflow-hidden flex flex-col relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-600 text-white py-1 px-6 rounded-bl-xl rounded-tr-xl font-bold text-sm shadow-md">
              Most Powerful
            </div>
            <div className="p-8 flex-1">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 14l9-5 9 5M3 14v4a2 2 0 002 2h14a2 2 0 002-2v-4M3 14l9-5 9 5" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-center text-indigo-600 mb-2">King</h3>
              <p className="text-center text-gray-500 mb-6">Leading with authority.</p>
              
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <span className="text-4xl font-extrabold text-gray-900 block">₹1999 <span className="text-lg font-medium text-gray-500">/ Month</span></span>
              </div>
              
              <div className="bg-indigo-50 text-indigo-800 text-center py-2 px-4 rounded-lg text-sm font-medium mb-6">
                Designed for organizations managing multiple hostels and branches.
              </div>
              
              <p className="font-semibold text-gray-900 mb-4">Everything in Anointed, plus:</p>
              
              <ul className="space-y-4 text-sm">
                {[
                  "Multi-Hostel Management",
                  "Centralized Dashboard",
                  "Advanced Financial Analytics",
                  "Dedicated WhatsApp Business Setup",
                  "Branded WhatsApp Messaging",
                  "Custom WhatsApp Message Templates",
                  "Certificates Management",
                  "Achievements Management",
                  "Data Recovery & Restore",
                  "Priority Support",
                  "Data Migration Assistance",
                  "Free Setup Assistance"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="rounded-full bg-indigo-600 p-0.5 mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 pt-0">
              <button
                onClick={() => handleSubscribe("King")}
                disabled={loading !== null}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md disabled:opacity-50"
              >
                {loading === "King" ? "Processing..." : "Choose King Plan"}
              </button>
            </div>
          </div>

        </div>

        {/* Footer features */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-around items-center gap-8 text-center text-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-green-600">Secure & Reliable</h4>
              <p className="text-gray-500">Your data is safe with us</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-blue-600">Expert Support</h4>
              <p className="text-gray-500">We are here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-orange-500">Cloud Based</h4>
              <p className="text-gray-500">Access anytime, anywhere</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-red-500">Built for Growth</h4>
              <p className="text-gray-500">Scale your organization</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPlans;
