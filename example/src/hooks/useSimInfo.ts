import { useState, useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { getSimSlotInfo, hasMultipleSims, getActiveSimCount } from 'react-native-sim-info';
import type { SimSlotInfo } from 'react-native-sim-info';

export interface UseSimInfoResult {
  simSlots: SimSlotInfo[];
  isLoading: boolean;
  error: string | null;
  hasMultipleSims: boolean;
  activeSimCount: number;
  refresh: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

/**
 * Custom hook to get SIM slot information
 * Automatically handles permissions and multi-SIM detection
 * 
 * @example
 * const { simSlots, isLoading, error, hasMultipleSims, refresh } = useSimInfo();
 * 
 * @returns {UseSimInfoResult} SIM information and helper methods
 */
export const useSimInfo = (): UseSimInfoResult => {
  const [simSlots, setSimSlots] = useState<SimSlotInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMultiple, setHasMultiple] = useState<boolean>(false);
  const [activeCount, setActiveCount] = useState<number>(0);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      setError('SIM info is only available on Android');
      return false;
    }

    try {
      // Request READ_PHONE_STATE permission
      const phoneStateGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'SIM Information Permission',
          message: 'This app needs access to read SIM information',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      // For Android 13+, also request READ_PHONE_NUMBERS for better phone number access
      if (Platform.Version >= 33) {
        const phoneNumbersGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS as any,
          {
            title: 'Phone Number Permission',
            message: 'This app needs access to read phone numbers from SIM cards',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return phoneStateGranted === PermissionsAndroid.RESULTS.GRANTED &&
               phoneNumbersGranted === PermissionsAndroid.RESULTS.GRANTED;
      }

      return phoneStateGranted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      setError('Failed to request permission');
      return false;
    }
  }, []);

  const fetchSimInfo = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setError('SIM info is only available on Android');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if permission is granted
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );

      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setError('Permission denied');
          setIsLoading(false);
          return;
        }
      }

      // Fetch all SIM information in parallel
      const [slots, multiple, count] = await Promise.all([
        getSimSlotInfo(),
        hasMultipleSims(),
        getActiveSimCount(),
      ]);

      setSimSlots(slots);
      setHasMultiple(multiple);
      setActiveCount(count);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setSimSlots([]);
      setHasMultiple(false);
      setActiveCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  const refresh = useCallback(async () => {
    await fetchSimInfo();
  }, [fetchSimInfo]);

  useEffect(() => {
    fetchSimInfo();
  }, [fetchSimInfo]);

  return {
    simSlots,
    isLoading,
    error,
    hasMultipleSims: hasMultiple,
    activeSimCount: activeCount,
    refresh,
    requestPermission,
  };
};
