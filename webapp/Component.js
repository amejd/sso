/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "smartstock/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("smartstock.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //set the app context object for global program data
                sap.ui.getCore().AppContext = new Object();

                // GeoCoder API Configuration
                sap.ui.getCore().AppContext.Array = [];
                sap.ui.getCore().AppContext.HereApiKey = "qZn4Oejg6GJhFAGgOkEJpCBQYXqSrzX41hIPZpxBGBc";
                sap.ui.getCore().AppContext.HereGeocoderLink = "https://geocoder.ls.hereapi.com/6.2/geocode.json?xnlp=CL_JSMv3.1.9.0";
                sap.ui.getCore().AppContext.HereCalculateRouteLink = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?";

                // Maps 
                sap.ui.getCore().AppContext.MapAnalyticQuantity = "analyticMap001";
                sap.ui.getCore().AppContext.MapGeoQuantity		= "geographicMap1";
                sap.ui.getCore().AppContext.MapGeoValue 		= "geographicMap2";
                sap.ui.getCore().AppContext.MapAnalyticValue	= "analyticMap002";

                // Views Global Declaration
                sap.ui.getCore().AppContext.MainView = "application-smartstock-display-component---Main"
                sap.ui.getCore().AppContext.FilterBarView = "application-smartstock-display-component---Main--filterbarview"
            }
        });
    }
);