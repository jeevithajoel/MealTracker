#import <Cordova/CDVPlugin.h>

@interface Airwatch : CDVPlugin

- (void)getUsername:(CDVInvokedUrlCommand*)command;
- (void)getProperty:(CDVInvokedUrlCommand*)command;

@end