import { Platform } from 'react-native';
import NativeSimInfo from './NativeSimInfo';
import type { SimSlotInfo } from './NativeSimInfo';

export type { SimSlotInfo };

/**
 * Get information about all SIM card slots.
 *
 * iOS: rejects with NOT_SUPPORTED_IOS. Apple restricts ICCID/carrier/phone
 * number access on iOS for privacy reasons -- there is no way to provide
 * this data on that platform, so this is documented explicitly here rather
 * than surfacing only as an undocumented runtime rejection.
 *
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted (Android)
 * @throws {Error} NOT_SUPPORTED_IOS on iOS
 * @returns {Promise<SimSlotInfo[]>} Array of SIM slot information
 */
export const getSimSlotInfo = (): Promise<SimSlotInfo[]> => {
  if (Platform.OS !== 'android') {
    return Promise.reject(
      new Error(
        'getSimSlotInfo is not supported on iOS: SIM/carrier data access is restricted by the platform.'
      )
    );
  }
  return NativeSimInfo.getSimSlotInfo();
};

/**
 * Check if the device has multiple SIM cards
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<boolean>} True if device has multiple SIM cards
 */
export const hasMultipleSims = (): Promise<boolean> => {
  return NativeSimInfo.hasMultipleSims();
};

/**
 * Get the count of active SIM cards
 * @throws {Error} SECURITY_EXCEPTION if READ_PHONE_STATE permission is not granted
 * @returns {Promise<number>} Number of active SIM cards
 */
export const getActiveSimCount = (): Promise<number> => {
  return NativeSimInfo.getActiveSimCount();
};
