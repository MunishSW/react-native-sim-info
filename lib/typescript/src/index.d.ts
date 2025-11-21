import type { SimSlotInfo } from './NativeSimInfo';
export type { SimSlotInfo };
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
export declare const useSimInfo: () => UseSimInfoResult;
//# sourceMappingURL=index.d.ts.map