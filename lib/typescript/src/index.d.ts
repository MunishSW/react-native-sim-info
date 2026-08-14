import type { SimSlotInfo } from './NativeSimInfo';
export type { SimSlotInfo };
/**
 * Get information about all SIM card slots
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<SimSlotInfo[]>} Array of SIM slot information
 */
export declare const getSimSlotInfo: () => Promise<SimSlotInfo[]>;
/**
 * Check if the device has multiple SIM cards
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<boolean>} True if device has multiple SIM cards
 */
export declare const hasMultipleSims: () => Promise<boolean>;
/**
 * Get the count of active SIM cards
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<number>} Number of active SIM cards
 */
export declare const getActiveSimCount: () => Promise<number>;
//# sourceMappingURL=index.d.ts.map