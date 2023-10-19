sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "../utils/myMapsUtil"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, AnalyticalMap, JSONModel, Device, Filter, Fragment, MessageToast, myMapsUtil) {
        "use strict";

        return Controller.extend("smartstock.controller.Main", {
            onInit: function () {
                console.log('onInit'); // To be removed
                /** Setting size limit of the oModel */
                const oModel = this.getOwnerComponent().getModel()
                oModel.setSizeLimit(1e3)
                this.getView().setModel(oModel);

                /** Creating a Device Model (This model is different than oModel) */
                const oDeviceModel = new JSONModel(Device)
                oDeviceModel.setDefaultBindingMode("OneWay")
                this.getView().setModel(oDeviceModel, "device")

                console.log(this.getView());
            },
            onAfterRendering: function () {
                /**  Description : 
                 *   Function is called when the rendering of the control is completed.
                     Applications must not call this hook method directly, it is called by the framework.
                     
                     - We use it to make sure that we call the setMap() Method only after the view is fully loaded
                     Purpose :  Map Initial Configuration Below 
                */
                // Handling scope
                const that = this
                console.log('hh');
                console.log(that.getView().byId("analyticMap001"));
                this.getView().attachAfterInit(function (that) {
                    // All components in the view have been loaded, and this code will execute only once.
                    myMapsUtil.setMap(that)
                    window.myvRenderGeoMapAuto = "M"
                    sap.ui.getCore().AppContext.globeView = that.getView();

                });
            },
            onGetMaps: function() {
                /** Getting the Main view absolute path not the Filterbar View 
                *  and by using the absolute ID we get our view > Check the Component.js File */
                const aMap001_path = `${sap.ui.getCore().AppContext.MainView}--analyticMap001`
                const aMap002_path = `${sap.ui.getCore().AppContext.MainView}--analyticMap002`
                const gMap1_path = `${sap.ui.getCore().AppContext.MainView}--geographicMap1`
                const gMap2_path = `${sap.ui.getCore().AppContext.MainView}--geographicMap2`
                // We get the view of the Map
                const analyticalMap_001 = sap.ui.getCore().byId(aMap001_path);
                const analyticalMap_002 = sap.ui.getCore().byId(aMap002_path);
                const geographicMap_1 = sap.ui.getCore().byId(gMap1_path);
                const geographicMap_2 = sap.ui.getCore().byId(gMap2_path);

                return analyticalMap_001, analyticalMap_002, geographicMap_1, geographicMap_2
            },
            /**********************  Filter Bar Functions -- Start  ************************/
            onSearch: function () {
                console.log('Go button clicked !'); // To be removed 
            },
            onReset: function () {
                console.log('Reset button clicked !'); // To be removed
            },
            onCountryChange: function (oEvent) {
                console.log('onCountryChange'); // To be removed    
                // Get the value of the input
                const i_country = oEvent.getParameter("selectedItem")
                /** Getting the Main view absolute path not the Filterbar View 
                *  and by using the absolute ID we get our view > Check the Component.js File */
                const aMap001_path = `${sap.ui.getCore().AppContext.MainView}--analyticMap001`
                const aMap002_path = `${sap.ui.getCore().AppContext.MainView}--analyticMap002`
                const gMap1_path = `${sap.ui.getCore().AppContext.MainView}--geographicMap1`
                const gMap2_path = `${sap.ui.getCore().AppContext.MainView}--geographicMap2`
                // We get the view of the Map
                const analyticalMap_001 = sap.ui.getCore().byId(aMap001_path);
                const analyticalMap_002 = sap.ui.getCore().byId(aMap002_path);
                const geographicMap_1 = sap.ui.getCore().byId(gMap1_path);
                const geographicMap_2 = sap.ui.getCore().byId(gMap2_path);
                // Controlling the Plants ListItem based on the country value - Below
                if (i_country !== null) {
                    /** Get the Binding Path : (/ENTITYSET(KEY)) */
                    const countryPath = i_country.getBindingContext().getPath();
                    // console.log(countryPath); // To be removed
                    this.byId("sPlant").setValue("");
                    this.byId("sPlant").removeAllItems();
                    /** 
                     *  In the statement below, we want to get the relative plants of the chosen country
                     *  and update the Plants List using the Association /CountryToPlantNav
                     */
                    this.byId("sPlant").bindAggregation("items", {
                        path: countryPath + "/CountryToPlantNav",
                        showSecondaryValues: true,
                        filterSecondaryValues: true,
                        value: "/comboBoxValue",
                        selectedKey: "/comboBoxKey",
                        template: new sap.ui.core.ListItem({
                            key: "{Werks}",
                            text: "{Name1}",
                            additionalText: "{Werks}"
                        })
                    });
                    // If view exists > Based on the Country selected by the user we focus on it on the Map
                    analyticalMap_001.isRendered() && analyticalMap_001.zoomToRegions([i_country.getKey()])
                    analyticalMap_002.isRendered() && analyticalMap_002.zoomToRegions([i_country.getKey()])
                    // Get zoom level currently applied in the map
                    const aMap001_zoomLevel = analyticalMap_001.getZoomlevel()
                    // Retrieve the center position of the current map
                    const aMap001_centerPosition = analyticalMap_001.getCenterPosition()
                    /** Below : 
                     *      If the others maps are used by the user, we want to set the same values 
                     *      set for the AnalyticalMap for them
                     */
                    if (geographicMap_1.isRendered()) {
                        geographicMap_1.setCenterPosition(aMap001_centerPosition)
                        geographicMap_1.setZoomlevel(aMap001_zoomLevel)
                    }

                    if (geographicMap_2.isRendered()) {
                        geographicMap_2.setCenterPosition(aMap001_centerPosition)
                        geographicMap_2.setZoomlevel(aMap001_zoomLevel)
                    }
                } else {
                    /** 
                     *  In the statement below, we want to get all plants since no country
                     *  was chosen by the user 
                     *  Warning : This should be removed since it's the default bevaior /AMEJD
                     */
                    this.byId("sPlant").setValue("");
                    this.byId("sPlant").removeAllItems();
                    this.byId("sPlant").bindAggregation("items", {
                        path: "/Plants",
                        showSecondaryValues: true,
                        filterSecondaryValues: true,
                        value: "/comboBoxValue",
                        selectedKey: "/comboBoxKey",
                        template: new sap.ui.core.ListItem({
                            key: "{Werks}",
                            text: "{Name1}",
                            additionalText: "{Werks}"
                        })
                    });
                    // Set Maps Values
                    geographicMap_1.isRendered() && geographicMap_1.setCenterPosition("0;0;0")
                    geographicMap_2.isRendered() && geographicMap_2.setCenterPosition("0;0;0")
                    analyticalMap_001.isRendered() && analyticalMap_001.setCenterPosition("0;0;0")
                    analyticalMap_002.isRendered() && analyticalMap_002.setCenterPosition("0;0;0")

                    geographicMap_1.isRendered() && geographicMap_1.setZoomlevel(0);
                    geographicMap_2.isRendered() && geographicMap_2.setZoomlevel(0);
                    analyticalMap_001.isRendered() && analyticalMap_001.setZoomlevel(0);
                    analyticalMap_002.isRendered() && analyticalMap_002.setZoomlevel(0);
                }
            },
            onPlantChange: function () {
                console.log('onPlantChange'); // To be removed
                // Get the value of the input
                const i_plant = e.getParameter("selectedItem");
                /** Getting the Main view absolute path not the Filterbar View 
                *  and by using the absolute ID we get our view > Check the Component.js File */
                const aMap001_path = `${sap.ui.getCore().AppContext.MainView}--analyticMap001`
                const aMap002_path = `${sap.ui.getCore().AppContext.MainView}--analyticMap002`
                const gMap1_path = `${sap.ui.getCore().AppContext.MainView}--geographicMap1`
                const gMap2_path = `${sap.ui.getCore().AppContext.MainView}--geographicMap2`
                // We get the view of the Map
                const analyticalMap_001 = sap.ui.getCore().byId(aMap001_path);
                const analyticalMap_002 = sap.ui.getCore().byId(aMap002_path);
                const geographicMap_1 = sap.ui.getCore().byId(gMap1_path);
                const geographicMap_2 = sap.ui.getCore().byId(gMap2_path);
                // Get mainservice Model
                const oModel = this.getOwnerComponent().getModel();
                // Controlling the Plants ListItem based on the country value - Below
                if (i_plant !== null) {
                    oModel.read(`/Plants('${i_plant.getKey()}')`, {
                        success: function (oData) {
                            console.log(oData); // To be removed
                            // Get the Lands relative to the Plant
                            const Land1 = oData.Land1;
                            analyticalMap_001.isRendered() && analyticalMap_001.zoomToRegions([Land1]);
                            analyticalMap_002.isRendered() && analyticalMap_002.zoomToRegions([Land1]);
                            // Get zoom level currently applied in the map
                            const aMap001_zoomLevel = analyticalMap_001.getZoomlevel()
                            // Retrieve the center position of the current map
                            const aMap001_centerPosition = analyticalMap_001.getCenterPosition()
                            /** Below : 
                             *      If the others maps are used by the user, we want to set the same values 
                             *      set for the AnalyticalMap for them
                             */
                            if (geographicMap_1.isRendered()) {
                                geographicMap_1.setCenterPosition(aMap001_centerPosition)
                                geographicMap_1.setZoomlevel(aMap001_zoomLevel)
                            }

                            if (geographicMap_2.isRendered()) {
                                geographicMap_2.setCenterPosition(aMap001_centerPosition)
                                geographicMap_2.setZoomlevel(aMap001_zoomLevel)
                            }
                        },
                        error: function (oError) {
                            console.log(oError);
                            const oMapContainer = sap.ui.getCore().byId(`${sap.ui.getCore().AppContext.MainView}--mapContainer`)
                            if (stockFound == 0) {
                                const warningMessage = "Warning \r\n No stock foud for this selection.";
                                geographicMap_1.show(warningMessage)
                            }
                            oMapContainer.setBusy(false)
                        }
                    })
                } else {
                    if (this.byId("sCountry").getSelectedItem() == null) {
                        // Set Maps Values
                        geographicMap_1.isRendered() && geographicMap_1.setCenterPosition("0;0;0")
                        geographicMap_2.isRendered() && geographicMap_2.setCenterPosition("0;0;0")
                        analyticalMap_001.isRendered() && analyticalMap_001.setCenterPosition("0;0;0")
                        analyticalMap_002.isRendered() && analyticalMap_002.setCenterPosition("0;0;0")

                        geographicMap_1.isRendered() && geographicMap_1.setZoomlevel(0);
                        geographicMap_2.isRendered() && geographicMap_2.setZoomlevel(0);
                        analyticalMap_001.isRendered() && analyticalMap_001.setZoomlevel(0);
                        analyticalMap_002.isRendered() && analyticalMap_002.setZoomlevel(0);
                    }
                }
            },
            onMaterialtTypeChange: function () {
                console.log('onMaterialtTypeChange'); // To be removed
            },
            onMaterialChange: function () {
                console.log('onMaterialChange'); // To be removed
            },
            onStockTypeChange: function () {
                console.log('onStockTypeChange'); // To be removed
            },
            onVendorChange: function () {
                console.log('onVendorChange'); // To be removed
            },
            onCustomerChange: function () {
                console.log('onCustomerChange'); // To be removed
            }
            /**********************  Filter Bar Functions -- End ***************************/


        });
    });
