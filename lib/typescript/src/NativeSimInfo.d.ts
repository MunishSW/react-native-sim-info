import type { TurboModule } from 'react-native';
export interface SimSlotInfo {
    slotIndex: number;
    carrierId: number;
    displayName: string;
    carrierName: string;
    countryIso: string;
    isEmbedded: boolean;
    isActive: boolean;
    phoneNumber: string | null;
    subscriptionId: number;
    iccId: string | null;
    mcc: string | null;
    mnc: string | null;
}
export interface Spec extends TurboModule {
    getSimSlotInfo(): Promise<SimSlotInfo[]>;
    hasMultipleSims(): Promise<boolean>;
    getActiveSimCount(): Promise<number>;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeSimInfo.d.ts.map