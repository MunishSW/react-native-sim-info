"use strict";

import NativeSimInfo from "./NativeSimInfo.js";
/**
 * Get information about all SIM card slots
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<SimSlotInfo[]>} Array of SIM slot information
 */
export const getSimSlotInfo = () => {
  return NativeSimInfo.getSimSlotInfo();
};

/**
 * Check if the device has multiple SIM cards
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<boolean>} True if device has multiple SIM cards
 */
export const hasMultipleSims = () => {
  return NativeSimInfo.hasMultipleSims();
};

/**
 * Get the count of active SIM cards
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<number>} Number of active SIM cards
 */
export const getActiveSimCount = () => {
  return NativeSimInfo.getActiveSimCount();
};
//# sourceMappingURL=index.js.map