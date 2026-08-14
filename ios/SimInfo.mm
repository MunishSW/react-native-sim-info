#import "SimInfo.h"

// Apple restricts SIM/carrier data access on iOS for privacy reasons
// (CTTelephonyNetworkInfo carrier APIs have been progressively locked down
// in recent iOS versions) -- this module genuinely cannot provide ICCID,
// carrier name, or phone number on iOS the way it can on Android.
//
// Previously, none of the spec methods below were implemented at all --
// only a leftover template "multiply" method existed. That is a real bug
// independent of the platform restriction: an Objective-C class claiming
// to conform to a TurboModule spec protocol without implementing its
// required methods either fails to build cleanly or crashes with
// "unrecognized selector" the first time JS calls one of these on iOS.
// Every spec method is now implemented with an explicit, clear rejection
// instead of being silently missing.

@implementation SimInfo

- (void)getSimSlotInfo:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject
{
  reject(@"NOT_SUPPORTED_IOS",
         @"SIM slot information (ICCID, carrier name, phone number) is not "
         @"accessible on iOS due to platform privacy restrictions.",
         nil);
}

- (void)hasMultipleSims:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
  // Conservative default rather than a hard reject: unlike getSimSlotInfo,
  // callers of hasMultipleSims are often just gating UI, so resolve false
  // rather than force every call site to add iOS-specific error handling.
  resolve(@(NO));
}

- (void)getActiveSimCount:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  resolve(@(0));
}

- (void)addListener:(NSString *)eventName
{
  // Required for NativeEventEmitter support -- no-op, no events are ever emitted on iOS.
}

- (void)removeListeners:(double)count
{
  // Required for NativeEventEmitter support -- no-op.
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSimInfoSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"SimInfoModule";
}

@end
