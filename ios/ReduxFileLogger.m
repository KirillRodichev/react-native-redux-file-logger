#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReduxFileLogger, NSObject)

RCT_EXTERN_METHOD(
    addLogger: (NSString *)tag
    withFileConfig: (NSDictionary)rawFileConfig
    withResolver: (RCTPromiseResolveBlock)resolve
    withRejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    archive: (NSDictionary)rawFileConfig
    withTag: (nullable NSString *)tag
    withResolver: (RCTPromiseResolveBlock)resolve
    withRejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
    log: (NSString *)tag
    withMessage: (NSString *)message
)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
