sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "../utils/myMapsUtil"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, AnalyticalMap, JSONModel, Device, Filter, FilterOperator, Fragment, MessageToast, myMapsUtil) {
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

                window.myvRenderGeoMapAuto = "M"
                Window.myvRenderGeoMapAuto = "M";

                

                // console.log(this._onGetViewById('geographicMap1').isRendered());
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
                    myMapsUtil.setMap(this)
                    // window.myvRenderGeoMapAuto = "M"
                    // Window.myvRenderGeoMapAuto = "M";
                    sap.ui.getCore().AppContext.globeView = that.getView();

                    // console.log(this._onGetViewById('geographicMap1').isRendered());

                });
            },
            /**********************  Filter Bar Functions -- Start  ************************/
            onSearch: function () {
                console.log('Go button clicked !'); // To be removed 
                // Get mapcontainer view
                const mapContainer = this._onGetViewById('mapContainer')
                mapContainer.setBusy(true)
                // Get all input values
                const i_country = this.byId('sCountry').getSelectedKey()
                const i_plant = this.byId('sPlant').getSelectedKey();
                const i_materialType = this.byId('sMaterialtType').getSelectedKey();
                const i_material = this.byId('sMaterial').getSelectedKey();
                const i_stockType = this.byId('sStockType').getSelectedKey();
                const i_vendor = this.byId('sVendor').getSelectedKey();
                const i_customer = this.byId('sCustomer').getSelectedKey();
                // Preparing filter values
                const filter_country = new Filter("Land1", FilterOperator.EQ, i_country);
                const filter_plant = new Filter("Werks", FilterOperator.EQ, i_plant);
                const filter_materialType = new Filter("Mtart", FilterOperator.EQ, i_materialType);
                const filter_material = new Filter("Matnr", FilterOperator.EQ, i_material);
                const filter_stockType = new Filter("StockType", FilterOperator.EQ, i_stockType);
                const filter_vendor = new Filter("Lifnr", FilterOperator.EQ, i_vendor);
                const filter_customer = new Filter("Kunnr", FilterOperator.EQ, i_customer);
                // Get the Model
                const oModel = this.getOwnerComponent().getModel()
                // Scope def
                const that = this
                // Getting the views 
                const sStockCirclesQuantity = this._onGetViewById('sStockCirclesQuantity')
                const sStockCirclesValue = this._onGetViewById('sStockCirclesValue')
                // Flag variables
                let n = 0
                let s = 0
                
                oModel.read('/PlantStockDataSet', {
                    filters: [filter_country, filter_plant, filter_materialType, filter_material, filter_stockType, filter_vendor, filter_customer],
                    success: function (oData) {
                        // Declare variables 
                        let g_array = []
                        let g_object = {}
                        // Get related views and remove all items
                        that._onGetViewById('sStockLabels').removeAllItems()
                        that._onGetViewById('sStockCirclesQuantity').removeAllItems()
                        that._onGetViewById('sStockCirclesValue').removeAllItems()
                        that._onGetViewById('sQuantityPies').removeAllItems()
                        that._onGetViewById('sConformityPies').removeAllItems()
                        // Logic Below
                        console.log(oData); // TO BE REMOVED
                        // debugger
                        // Check if there is some data coming from the backend !
                        if (oData.results.length > 0) {
                            oData.results.map((element, index) => {
                                const address = element.Address
                                if (address) {
                                    const xmlHttpRequest = new XMLHttpRequest()
                                    
                                    const apiKey = sap.ui.getCore().AppContext.HereApiKey;
                                    const geoCoderLink = sap.ui.getCore().AppContext.HereGeocoderLink;
                                    // Prepare URI
                                    const uriAPI = `${geoCoderLink}?apikey=${apiKey}&searchtext=${address.trim().split(" ").join("+")}`
                                    console.log(uriAPI); // To be removed

                                    xmlHttpRequest.open('GET', uriAPI, false)
                                    debugger
                                    xmlHttpRequest.send()
                                    console.log("Labels : " + xmlHttpRequest.responseText);

                                    try {
                                        const apiResponse = JSON.parse(XMLHttpRequest.responseText)
                                        const Longitude = apiResponse.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
                                        const Latitude = apiResponse.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

                                        // Set item to views
                                        sStockCirclesQuantity.addItem(
                                            new sap.ui.vbm.Circle({
                                                radius: element.QuantityValue.replace(/\s/g, ""),
                                                tooltip: "Plant : " + element.Name1 + "\nAdresse : " + element.Address + "\nStock quantity : " + element.TotalStock.replace(/\s/g, ""),
                                                color: "rgba(92,186,230,0.6)",
                                                colorBorder: "rgb(255,255,255)",
                                                hotDeltaColor: "rgba(92,186,230,0.8)",
                                                position: Longitude + ";" + Latitude + ";0"
                                            })
                                        )
                                        sStockCirclesValue.addItem(
                                            new sap.ui.vbm.Circle({
                                                radius: element.ValuatedValue.replace(/\s/g, ""),
                                                tooltip: "Plant : " + element.Name1 + "\nAdresse : " + element.Address + "\nStock value: " + element.TotalValuated.replace(/\s/g, ""),
                                                color: "rgba(92,186,230,0.6)",
                                                colorBorder: "rgb(255,255,255)",
                                                hotDeltaColor: "rgba(92,186,230,0.8)",
                                                position: Longitude + ";" + Latitude + ";0"
                                            })
                                        )

                                        // Adding some logic
                                        
                                        let fieldValue = ""
                                        if (element.TotalStock.replace(/\s/g, "") > 0) {
                                            n++;
                                            if (element.Labst.replace(/\s/g, "") > 0) {
                                                fieldValue = fieldValue + "\n{i18n>LABST} : " + element.Labst.replace(/\s/g, "")
                                            }

                                            if (element.Umlme.replace(/\s/g, "") > 0) {
                                                fieldValue = fieldValue + "\n{i18n>UMLME} : " + element.Umlme.replace(/\s/g, "")
                                            }

                                            if (element.Insme.replace(/\s/g, "") > 0) {
                                                fieldValue = fieldValue + "\n{i18n>INSME} : " + element.Insme.replace(/\s/g, "")
                                            }
                                            if (element.Einme.replace(/\s/g, "") > 0) {
                                                fieldValue = fieldValue + "\n{i18n>EINME} : " + element.Einme.replace(/\s/g, "")
                                            }
                                            if (element.Speme.replace(/\s/g, "") > 0) {
                                                fieldValue = fieldValue + "\n{i18n>SPEME} : " + element.Speme.replace(/\s/g, "")
                                            }
                                            if (element.Retme.replace(/\s/g, "") > 0) {
                                                fieldValue = fieldValue + "\n{i18n>RETME} : " + element.Retme.replace(/\s/g, "")
                                            }

                                            // Creating the PIE
                                            const pie = new sap.ui.vbm.Pie({
                                                scale: "3;1;1",
                                                position: Longitude + ";" + Latitude + ";0",
                                                tooltip: "Plant : " + element.Name1 + "\nAdresse : " + element.Address + fieldValue,
                                                key: element.Werks
                                            });
                                            pie.addItem(
                                                new sap.ui.vbm.PieItem({
                                                    color: "{i18n>colorLABST}",
                                                    name: "{i18n>LABST}",
                                                    value: element.Labst.replace(/\s/g, "")
                                                })
                                            )
                                            pie.addItem(new sap.ui.vbm.PieItem({
                                                color: "{i18n>colorEINME}",
                                                name: "{i18n>EINME}",
                                                value: element.Einme.replace(/\s/g, ""),
                                                // click: function (e) {
                                                //     console.log("var Pie = new sap.ui.vbm.Pie({ ")
                                                // }
                                            }));
                                            pie.addItem(new sap.ui.vbm.PieItem({
                                                color: "{i18n>colorSPEME}",
                                                name: "{i18n>SPEME}",
                                                value: element.Speme.replace(/\s/g, "")
                                            }));
                                            pie.addItem(new sap.ui.vbm.PieItem({
                                                color: "{i18n>colorINSME}",
                                                name: "{i18n>INSME}",
                                                value: element.Insme.replace(/\s/g, "")
                                            }));
                                            pie.addItem(new sap.ui.vbm.PieItem({
                                                color: "{i18n>colorRETME}",
                                                name: "{i18n>RETME}",
                                                value: element.Retme.replace(/\s/g, "")
                                            }));
                                            pie.addItem(new sap.ui.vbm.PieItem({
                                                color: "{i18n>colorUMLME}",
                                                name: "{i18n>UMLME}",
                                                value: element.Umlme.replace(/\s/g, "")
                                            }));
                                            // Add Pie to the view
                                            that._onGetViewById('sQuantityPies').addItem(pie)
                                        }

                                        // ConformityKey logic
                                        
                                        if (element.ConformityKey != "") {
                                            s++
                                            const conformityPie = new sap.ui.vbm.Pie({
                                                scale: "3;1;1",
                                                position: Longitude + ";" + Latitude + ";0",
                                                tooltip: "Plant : " + element.Name1 + "\nAdresse : " + element.Address,
                                                key: element.Werks
                                            });

                                            const conformityKey = element.ConformityKey.split("|");
                                            const conformityLabel = element.ConformityLabel.split("|");
                                            const conformityValue = element.ConformityValue.split("|");

                                            conformityKey.map((key, idx) => {
                                                // Pay attention to the key -- Starting from 1
                                                if (conformityValue[idx].replace(/\s/g, "") > 0) {
                                                    let object = {}
                                                    object.key = key
                                                    object.label = conformityLabel[idx]
                                                    g_array.push(object)

                                                    let tooltipValueToAdd = ''
                                                    if (key == "ZZ") {
                                                        tooltipValueToAdd = tooltipValueToAdd + "\n" + conformityLabel[idx] + " : " + conformityValue[idx].replace(/\s/g, "")
                                                    } else {
                                                        tooltipValueToAdd = tooltipValueToAdd + "\n" + conformityKey[idx] + " - " + conformityLabel[idx] + " : " + conformityValue[idx].replace(/\s/g, "")
                                                    }

                                                    conformityPie.addItem(
                                                        new sap.ui.vbm.PieItem({
                                                            color: sap.ui.getCore().byId("application-smartstock-display-component---Main").getModel("i18n").getProperty(conformityKey[idx]),
                                                            name: conformityLabel[idx],
                                                            value: conformityValue[idx]
                                                        })
                                                    )
                                                }
                                            })

                                            var P = "Plant : " + element.Name1 + "\nAdresse : " + element.Address + tooltipValueToAdd;
                                            conformityPie.setTooltip(P);
                                            if (conformityPie.getItems().length != 0) {
                                                that._onGetViewById('sConformityPies').addItem(conformityPie)
                                            }
                                        }

                                    } catch (error) {
                                        console.log(error);
                                    }

                                }
                            })
                        }

                        // Another part 
                        const legendConformityColor = that._onGetViewById('idLegendConformityColor')
                        legendConformityColor.removeAllItems()
                        legendConformityColor.addItem(
                            new sap.m.GroupHeaderListItem({
                                title: "Conforminty values",
                                upperCase: false
                            })
                        )
                        g_array = g_array.sort((e, t) => {
                            return e.key.localeCompare(t.key)
                        })
                        g_array = Array.from(new Set(g_array.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                        let labelLegendItem = ''
                        g_array.map((gelem, gidx) => {
                            if (gidx == g_array.length - 1) {
                                labelLegendItem = gelem.label
                            } else {
                                labelLegendItem = gelem.key + " : " + gelem.label
                            }
                            const legentItem = new sap.ui.vk.LegendItem({
                                title: labelLegendItem,
                                color: sap.ui.getCore().byId("application-smartstock-display-component---Main").getModel("i18n").getProperty(gelem.key),
                            });
                            legendConformityColor.addItem(legentItem);
                            const conformityKeyLength = conformityKey.length
                        })

                        if (n == 0) {
                            const msgToShow = "Warning \r\n No stock found for this selection.";
                            MessageToast.show(msgToShow)
                        }
                        if (s == 0) {
                            const msgToShow = "Warning \r\n No quality inspection stock found for this selection.";
                            MessageToast.show(msgToShow)
                        }


                        that._onGetViewById('idCustomerQuantityRoute').setPosition("");
                        that._onGetViewById("idCustomerConformityRoute").setPosition("");
                        // if (oData.results.length == 1) {
                        //     oData.results[0].Land1
                        // }
                        // var E = sap.ui.getCore().AppContext.globeView.byId("mapContainer");
                        mapContainer.setBusy(false)

                    },
                    error: function (oError) {
                        var aMsg = "Error \r\n Communication to the server failed.";
                        MessageToast.show(aMsg);
                        mapContainer.setBusy(false)
                    }
                })
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
            onPlantChange: function (oEvent) {
                console.log('onPlantChange'); // To be removed
                // Get the value of the input
                const i_plant = oEvent.getParameter("selectedItem");
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
                                MessageToast.show(warningMessage)
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
            onMaterialtTypeChange: function (oEvent) {
                console.log('onMaterialtTypeChange'); // To be removed
                // Get value of the input
                const i_materialType = oEvent.getSource().getSelectedItem();
                // Controlling the MaterialType value - Below
                if (i_materialType !== null) {
                    /** Get the Binding Path : (/ENTITYSET(KEY)) */
                    const materialTypePath = i_materialType.getBindingContext().getPath();
                    /** 
                     *  In the statement below, we want to get the relative Materials 
                     *  Based on the MaterialType
                     */
                    this.byId("sMaterial").bindAggregation("items", {
                        path: materialTypePath + "/TypeToMaterialNav",
                        template: new sap.ui.core.ListItem({
                            key: "{Matnr}",
                            text: "{Maktx}",
                            additionalText: "{Matnr}"
                        })
                    })
                } else {
                    this.byId("sMaterial").bindAggregation("items", {
                        path: "/Materials",
                        template: new sap.ui.core.ListItem({
                            key: "{Matnr}",
                            text: "{Maktx}",
                            additionalText: "{Matnr}"
                        })
                    })
                }
            },
            onMaterialChange: function (oEvent) {
                console.log('onMaterialChange'); // To be removed
            },
            onStockTypeChange: function (oEvent) {
                console.log('onStockTypeChange'); // To be removed
            },
            onVendorChange: function (oEvent) {
                console.log('onVendorChange'); // To be removed
            },
            onCustomerChange: function (oEvent) {
                console.log('onCustomerChange'); // To be removed
                // Get Views & Components
                const customerQuantityRoute = this._onGetViewById('idCustomerQuantityRoute')
                customerQuantityRoute.setPosition("")
                const customerConformityRoute = this._onGetViewById('idCustomerConformityRoute')
                customerConformityRoute.setPosition("")
                const customerQuantitySport = this._onGetViewById('sCustomerQuantitySpot')
                customerQuantitySport.removeAllItems()
                const customerConformitySpot = this._onGetViewById('sCustomerConformitySpot')
                customerConformitySpot.removeAllItems()
                // Get value of the input
                const i_customer = oEvent.getSource().getSelectedItem().getKey();
                // Get Model
                const oModel = this.getOwnerComponent().getModel()
                // Read Data
                oModel.read(`/Customer('${i_customer}')`, {
                    success: function (oData) {
                        const address = oData.address
                        if (address !== "" && address !== null) {
                            const xmlHttpRequest = new XMLHttpRequest()
                            const apiKey = sap.ui.getCore().AppContext.HereApiKey;
                            const geoCoderLink = sap.ui.getCore().AppContext.HereGeocoderLink;
                            // Prepare URI
                            const uriAPI = `${geoCoderLink}&apikey=${apiKey}&searchtext${address}`
                            console.log(uriAPI); // To be removed

                            xmlHttpRequest.open('GET', uriAPI, false)
                            xmlHttpRequest.send()
                            console.log("Customer Spot : " + xmlHttpRequest.responseText); // To be removed

                            try {
                                const apiResponse = JSON.parse(xmlHttpRequest.responseText);
                                const Longitude = apiResponse.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
                                const Latitude = apiResponse.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

                                customerQuantitySport.addItem(
                                    new sap.ui.vbm.Spot({
                                        tooltip: oData.Name1 + "\nAdresse : " + oData.Address,
                                        type: "Success",
                                        position: Longitude + ";" + Latitude + ";0",
                                        contextMenu: function (e) {
                                            myMapsUtil.customerSpotContext(e)
                                        }
                                    })
                                )

                                customerConformitySpot.addItem(
                                    new sap.ui.vbm.Spot({
                                        tooltip: oData.Name1 + "\nAdresse : " + oData.Address,
                                        type: "Success",
                                        position: Longitude + ";" + Latitude + ";0",
                                        contextMenu: function (e) {
                                            myMapsUtil.customerSpotContext(e)
                                        }
                                    }));

                                const position = Longitude + ";" + Latitude;
                                const gMap1_path = sap.ui.getCore().AppContext.MapGeoQuantity;
                                const geographicMap1 = this._onGetViewById(gMap1_path)
                                geographicMap1.setCenterPosition(position);

                                const gMap2_path = sap.ui.getCore().AppContext.MapGeoValue
                                const geographicMap2 = this._onGetViewById(gMap2_path)
                                geographicMap2.setCenterPosition(position)

                            } catch (error) {
                                console.log(error.message);
                                const errMessage = "Warning \r\n Customer address not found.";
                                MessageToast.show(errMessage)
                            }
                        }
                    },
                    error: function (oError) {
                        console.log(oError);
                        const oMapContainer = this._onGetViewById('mapContainer')
                        oMapContainer.setBusy(false)
                    }
                })


            },
            /**********************  Filter Bar Functions -- End ***************************/

            /**********************  Map Container Functions -- Start ***************************/
            onClickMapContainer: function (oEvent) {
                console.log('ClickMapContainer fired ! '); // To be removed
                // Call the configuration of the MAPS
                myMapsUtil.setMap(this)
                // debugger;
                // Get parent ID 
                const parentID = oEvent.mParameters.selectedItemId.substr(0, oEvent.mParameters.selectedItemId.length - 14);
                console.log(parentID); // To be removed
                // Get path of all maps using the ParentID
                const analyticMap001_path = parentID + sap.ui.getCore().AppContext.MapAnalyticQuantity;
                const analyticMap002_path = parentID + sap.ui.getCore().AppContext.MapAnalyticValue;
                const geographicMap_1_path = parentID + sap.ui.getCore().AppContext.MapGeoQuantity;
                const geographicMap2_path = parentID + sap.ui.getCore().AppContext.MapGeoValue;
                // If the geomaps are selected by the used - follow the logic below 
                if (oEvent.mParameters.selectedItemId == geographicMap_1_path || oEvent.mParameters.selectedItemId == geographicMap2_path) {
                    // Set the Panel of keys to Visible
                    this._onGetViewById('idListPanelGeoMap001').setVisible(true)
                    if (oEvent.mParameters.selectedItemId == geographicMap_1_path) {
                        this._onGetViewById('idLegendStokColor').setVisible(true)
                        this._onGetViewById('idLegendConformityColor').setVisible(false)
                    } else {
                        this._onGetViewById('idLegendStokColor').setVisible(false)
                        this._onGetViewById('idLegendConformityColor').setVisible(true)
                    }
                } else {
                    // For other maps don't display this
                    this._onGetViewById('idListPanelGeoMap001').setVisible(false)
                }
                // Current Map selected By user
                let currentMapSelected = null;
                if (this._onGetViewById('geographicMap1')) {
                    currentMapSelected = sap.ui.getCore().byId(geographicMap_1_path)
                }
                if (sap.ui.getCore().byId(geographicMap2_path).isRendered()) {
                    currentMapSelected = sap.ui.getCore().byId(geographicMap2_path)
                }
                if (sap.ui.getCore().byId(analyticMap001_path).isRendered()) {
                    currentMapSelected = sap.ui.getCore().byId(analyticMap001_path)
                }
                if (sap.ui.getCore().byId(analyticMap002_path).isRendered()) {
                    currentMapSelected = sap.ui.getCore().byId(analyticMap002_path)
                }

                const currentMapZoomLevel = currentMapSelected.getZoomlevel();
                const currentMapCenterPosition = currentMapSelected.getCenterPosition();
                // Set THE mapUtil
                myMapsUtil.setZoom(oEvent.mParameters.selectedItemId, currentMapZoomLevel, currentMapCenterPosition)
            },
            sCustomerSpotsContextMenu: function (oEvent) {
                console.log('sCustomerSpotsContextMenu fired !'); // To be removed
                console.log(oEvent); // To be removed
                const source = oEvent.getSource();
                if (!this._oQuickView) {
                    Fragment.load({
                        name: "smartstock.view.CustomerQuickView",
                        controller: this
                    }).then(function (e) {
                        this._oQuickView = e;
                        this._oQuickView.openBy(source)
                    }
                        .bind(this))
                } else {
                    this._oQuickView.openBy(source)
                }
            },
            handlePopoverPress: function (oEvent) {
                console.log("Click Event : handlePopoverPress  ");
                var source = oEvent.getSource();
                if (!this._oPopover) {
                    Fragment.load({
                        name: "smartstock.view.Popover",
                        controller: this
                    }).then(function (e) {
                        this._oPopover = e;
                        sap.ui.getCore().AppContext.globeView.addDependent(this._oPopover);
                        this._oPopover.openBy(source)
                    }
                        .bind(this))
                } else {
                    this._oPopover.openBy(source)
                }
            },
            onSelectdisplayMode: function (oEvent) {
                var selectedMode = oEvent.getSource().getSelectedItem();
                var mapContainer = this._onGetViewById('mapContainer')
                let flag = 0;
                switch (selectedMode.getKey()) {
                    case "quantityAnalytic":
                        flag = 0;
                        break;
                    case "quantityGeo":
                        flag = 1;
                        break;
                    case "conformity":
                        flag = 2;
                        break;
                    case "stockValue":
                        flag = 3;
                        break;
                    default:
                }
                const selectedContent = mapContainer.getSelectedContent().getContent();
                mapContainer.setSelectedContent(mapContainer.getContent()[flag]);
                mapContainer.rerender();

                const selectedContentZoomLevel = selectedContent.getZoomlevel();
                const selectedContentCenterPosition = selectedContent.getCenterPosition();
                myMapsUtil.setZoom(mapContainer.getSelectedContent().getContent().getId(), selectedContentZoomLevel, selectedContentCenterPosition)
            },
            /**********************  Map Container Functions -- End ***************************/

            /**********************  Controller Private Functions -- Start ***************************/
            _onGetViewById: function (componentId, filterbarview = false) {
                /** This function return the View by using the absolute Path to it, check the Component.js 
                 *  to see the paths defined there
                 */
                if (!filterbarview) {
                    return sap.ui.getCore().byId(`${sap.ui.getCore().AppContext.MainView}--${componentId}`);
                } else {
                    return sap.ui.getCore().byId(`${sap.ui.getCore().AppContext.FilterBarView}--${componentId}`);
                }
            },
            _onGetMaps: function () {
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
            _onCreatePie: function (scale, longitude, latitude, tooltip, key) {
                return new sap.ui.vbm.Pie({
                    scale: scale,
                    position: longitude + ";" + latitude + ";0",
                    tooltip: tooltip,
                    key: key
                });
            }
            /**********************  Controller Private Functions -- End ***************************/




        });
    });
