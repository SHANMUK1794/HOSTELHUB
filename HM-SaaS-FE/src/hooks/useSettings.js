import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/AxiosInstance";


const STORAGE_KEY = "hostelBusinessConfig";


const DEFAULT_CONFIG = {
  // Electricity
  ebRatePerUnit: 10,

  // Registration / Rent
  registrationFee: 500,
  ebDeposit: 1000,
  securityDeposit: 2000,

  // Payroll
  workingDaysPerMonth: 30,
  workingHoursPerDay: 8,
  overtimeMultiplier: 1,

  // Leave
  casualLeavePerMonth: 2,

  // WhatsApp Automation
  waEnableRegistration: false,
  waEnableBirthday: false,
  waEnableRentReminder: false,
  waEnableRentLastDay: false,
  waEnablePaymentConfirmation: false,
  waEnableComplaintAck: false,
  waEnableComplaintResolved: false,
  waEnablePayroll: false,
};


// Load settings
const getStoredConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored
      ? {
          ...DEFAULT_CONFIG,
          ...JSON.parse(stored),
        }
      : DEFAULT_CONFIG;

  } catch (error) {
    console.error("Settings load failed:", error);
    return DEFAULT_CONFIG;
  }
};



export const useSettings = () => {

  const [businessConfig, setBusinessConfig] =
    useState(getStoredConfig);

  const [configSaved, setConfigSaved] =
    useState(false);



  // Sync changes from another tab
  useEffect(() => {

    const syncSettings = (event) => {

      if (
        event.key === STORAGE_KEY &&
        event.newValue
      ) {

        setBusinessConfig({
          ...DEFAULT_CONFIG,
          ...JSON.parse(event.newValue),
        });

      }
    };


    window.addEventListener(
      "storage",
      syncSettings
    );


    return () =>
      window.removeEventListener(
        "storage",
        syncSettings
      );

  }, []);





  // Update single field
  const handleBusinessChange = useCallback(
    (key) => (value) => {

      setBusinessConfig((prev) => ({
        ...prev,
        [key]: value,
      }));

      setConfigSaved(false);
    },
    []
  );






  // Save settings
  const saveBusinessConfig = useCallback(
    async () => {

      try {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(businessConfig)
        );


        await axiosInstance.put(
          "/api/settings/v1/update",
          businessConfig
        );


        setConfigSaved(true);


        setTimeout(
          () => setConfigSaved(false),
          3000
        );


      } catch (error) {

        console.error(
          "Settings save failed:",
          error
        );

      }

    },
    [businessConfig]
  );







  // Reset settings
  const resetBusinessConfig = useCallback(
    async () => {

      try {

        localStorage.removeItem(STORAGE_KEY);


        setBusinessConfig(DEFAULT_CONFIG);


        await axiosInstance.put(
          "/api/settings/v1/update",
          DEFAULT_CONFIG
        );


        setConfigSaved(false);


      } catch (error) {

        console.error(
          "Settings reset failed:",
          error
        );

      }

    },
    []
  );






  return {
    businessConfig,
    configSaved,
    handleBusinessChange,
    saveBusinessConfig,
    resetBusinessConfig,
    DEFAULT_CONFIG,
  };
};