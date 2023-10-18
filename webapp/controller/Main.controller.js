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
            },
            onAfterRendering : function(){
                /**  Description : 
                 *   Function is called when the rendering of the control is completed.
                     Applications must not call this hook method directly, it is called by the framework.
                     
                     - We use it to make sure that we call the setMap() Method only after the view is fully loaded
                     Purpose :  Map Initial Configuration Below 
                */
                // Handling scope
                const that = this
                this.getView().attachAfterInit(function(that) {
                    // All components in the view have been loaded, and this code will execute only once.
                    myMapsUtil.setMap(that)
                    window.myvRenderGeoMapAuto = "M"
                    sap.ui.getCore().AppContext.globeView = that.getView();
                });
            },
            /**********************  Filter Bar Functions -- Start  ************************/
            onSearch: function(){
                console.log('Go button clicked !'); // To be removed 
            },
            onReset: function(){
                console.log('Reset button clicked !'); // To be removed
            },
            onCountryChange: function(oEvent){
                console.log('onCountryChange'); // To be removed    
                // Get the value of the input
                const i_country = oEvent.getParameter("selectedItem")
                console.log("Input value"); // To be removed
                console.log(i_country); // To be removed
                if(i_country !== null){
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
                    const analyticalMap = sap.ui.getCore().AppContext.globeView.byId("analyticMap001");
                    analyticalMap.zoomToRegions([i_country.getKey()])
                    console.log(i_country.getKey());
                    
                }else{

                }
            },  
            onPlantChange:function(){
                console.log('onPlantChange'); // To be removed
            },
            onMaterialtTypeChange:function(){
                console.log('onMaterialtTypeChange'); // To be removed
            },
            onMaterialChange:function(){
                console.log('onMaterialChange'); // To be removed
            },
            onStockTypeChange:function(){
                console.log('onStockTypeChange'); // To be removed
            },
            onVendorChange: function(){
                console.log('onVendorChange'); // To be removed
            },
            onCustomerChange:function(){
                console.log('onCustomerChange'); // To be removed
            }
            /**********************  Filter Bar Functions -- End ***************************/


        });
    });
