var exec = require('cordova/exec');

var airwatchExport = {};

airwatchExport.getUsername = function (callback, errorCallback) {
	window.cordova.exec(callback, function (err) {

		console.log('Error running Airwatch.getUsername natively', err);
		errorCallback(err);

	}, "Airwatch", "getUsername");
};

airwatchExport.getProperty = function (property, callback, errorCallback) {
	if (!property) {
		console.log('Please specific a system property key to retrieve');
		return;

	}
	//noinspection JSUnresolvedVariable
	window.cordova.exec(callback, function (err) {

		console.log('Error running Airwatch.getProperty natively', err);
		errorCallback(err);
	}, "Airwatch", "getProperty", [property]);
}

module.exports = airwatchExport;