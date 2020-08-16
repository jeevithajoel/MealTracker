#import "Airwatch.h"
#import <Cordova/CDVPlugin.h>

@implementation Airwatch

- (void)getUsername:(CDVInvokedUrlCommand*)command
{
	@try{
	    CDVPluginResult* pluginResult = nil;

		NSString *userNameKey = @"awusername";

		if ([[[NSUserDefaults standardUserDefaults] dictionaryForKey:@"com.apple.configuration.managed"] objectForKey:userNameKey] == nil)
		{
	        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"notfound"];
		}
		else
		{
		    NSString *userName = [[[NSUserDefaults standardUserDefaults] dictionaryForKey:@"com.apple.configuration.managed"] objectForKey:userNameKey];

		    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:userName];
		}

	    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}
	@catch (NSException *exception) {

		NSString *exceptionMessage = [NSString stringWithFormat:@"%@/%@/", @"Exception ", exception.reason];

	    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exceptionMessage] callbackId:command.callbackId];
    }
}
- (void)getProperty:(CDVInvokedUrlCommand*)command
{
	@try{
	    CDVPluginResult* pluginResult = nil;

		NSString *propertyKey = [command.arguments objectAtIndex:0];

		if(propertyKey == nil){
		    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"missing argument Property Key, the property to get"];
		}


		if ([[[NSUserDefaults standardUserDefaults] dictionaryForKey:@"com.apple.configuration.managed"] objectForKey:propertyKey] == nil)
		{
	        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"notfound"];
		}
		else
		{
		    NSString *userName = [[[NSUserDefaults standardUserDefaults] dictionaryForKey:@"com.apple.configuration.managed"] objectForKey:propertyKey];

		    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:userName];
		}

	    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}
	@catch (NSException *exception) {

		NSString *exceptionMessage = [NSString stringWithFormat:@"%@/%@/", @"Exception ", exception.reason];

	    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exceptionMessage] callbackId:command.callbackId];
    }
}

@end
