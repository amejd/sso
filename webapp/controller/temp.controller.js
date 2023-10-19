sap.ui.define([ "sap/ui/core/mvc/Controller", 
                "sap/ui/vbm/AnalyticMap", 
                "sap/ui/model/json/JSONModel", 
                "sap/ui/Device", 
                "sap/ui/model/Filter", 
                "sap/ui/core/Fragment", 
                "sap/m/MessageToast", 
                "../utils/myMapsUtil"], function (e, t, o, a, n, s, r, i) {
    "use strict";
    return e.extend("STK.smartstock.controller.globe", {
        
        onSearch: function (e) {
            var t = this.byId("mapContainer");
            t.setBusy(true);
            var o = sap.ui.getCore().AppContext.globeView.byId("sCountry");
            var a = sap.ui.getCore().AppContext.globeView.byId("sPlant");
            var n = sap.ui.getCore().AppContext.globeView.byId("sMaterialtType");
            var s = sap.ui.getCore().AppContext.globeView.byId("sMaterial");
            var i = sap.ui.getCore().AppContext.globeView.byId("sStockType");
            var l = sap.ui.getCore().AppContext.globeView.byId("sVendor");
            var g = sap.ui.getCore().AppContext.globeView.byId("sCustomer");
            var c = o.getSelectedKey();
            var u = a.getSelectedKey();
            var p = n.getSelectedKey();
            var d = s.getSelectedKey();
            var m = i.getSelectedKey();
            var y = l.getSelectedKey();
            var b = g.getSelectedKey();
            var C = "/PlantStockDataSet";
            var v = new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.EQ, c);
            var I = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, u);
            var M = new sap.ui.model.Filter("Mtart", sap.ui.model.FilterOperator.EQ, p);
            var S = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, d);
            var k = new sap.ui.model.Filter("StockType", sap.ui.model.FilterOperator.EQ, m);
            var f = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, y);
            var P = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, b);
            var h = this.getOwnerComponent().getModel("undefined");
            h.read(C, {
                filters: [v, I, M, S, k, f, P],
                success: function (e, t) {
                    var o = {};
                    var a = [];
                    console.log(e);
                    debugger;
                    sap.ui.getCore().AppContext.globeView.byId("sStockLabels").removeAllItems();
                    sap.ui.getCore().AppContext.globeView.byId("sStockCirclesQuantity").removeAllItems();
                    sap.ui.getCore().AppContext.globeView.byId("sStockCirclesValue").removeAllItems();
                    sap.ui.getCore().AppContext.globeView.byId("sQuantityPies").removeAllItems();
                    sap.ui.getCore().AppContext.globeView.byId("sConformityPies").removeAllItems();
                    var n = 0;
                    var s = 0;
                    for (var i = 0; i < e.results.length; i++) {
                        var l = e.results[i].Address;
                        if (l !== "" && l !== null) {
                            var g = new XMLHttpRequest;
                            var c = sap.ui.getCore().AppContext.HereApiKey;
                            var u = sap.ui.getCore().AppContext.HereGeocoderLink;
                            var p = u + "&apikey=" + c + "&searchtext=" + l;
                            console.log(p);
                            g.open("GET", p, false);
                            g.send();
                            console.log("Labels : " + g.responseText);
                            try {
                                var d = JSON.parse(g.responseText);
                                var m = d.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
                                var y = d.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
                                sap.ui.getCore().AppContext.globeView.byId("sStockCirclesQuantity").addItem(new sap.ui.vbm.Circle({
                                        radius: e.results[i].QuantityValue.replace(/\s/g, ""),
                                        tooltip: "Plant : " + e.results[i].Name1 + "\nAdresse : " + e.results[i].Address + "\nStock quantity : " + e.results[i].TotalStock.replace(/\s/g, ""),
                                        color: "rgba(92,186,230,0.6)",
                                        colorBorder: "rgb(255,255,255)",
                                        hotDeltaColor: "rgba(92,186,230,0.8)",
                                        position: m + ";" + y + ";0"
                                    }));
                                sap.ui.getCore().AppContext.globeView.byId("sStockCirclesValue").addItem(new sap.ui.vbm.Circle({
                                        radius: e.results[i].ValuatedValue.replace(/\s/g, ""),
                                        tooltip: "Plant : " + e.results[i].Name1 + "\nAdresse : " + e.results[i].Address + "\nStock value: " + e.results[i].TotalValuated.replace(/\s/g, ""),
                                        color: "rgba(92,186,230,0.6)",
                                        colorBorder: "rgb(255,255,255)",
                                        hotDeltaColor: "rgba(92,186,230,0.8)",
                                        position: m + ";" + y + ";0"
                                    }));
                                if (e.results[i].TotalStock.replace(/\s/g, "") > 0) {
                                    n = n + 1;
                                    var b = "";
                                    if (e.results[i].Labst.replace(/\s/g, "") > 0) {
                                        b = b + "\n{i18n>LABST} : " + e.results[i].Labst.replace(/\s/g, "")
                                    }
                                    if (e.results[i].Umlme.replace(/\s/g, "") > 0) {
                                        b = b + "\n{i18n>UMLME} : " + e.results[i].Umlme.replace(/\s/g, "")
                                    }
                                    if (e.results[i].Insme.replace(/\s/g, "") > 0) {
                                        b = b + "\n{i18n>INSME} : " + e.results[i].Insme.replace(/\s/g, "")
                                    }
                                    if (e.results[i].Einme.replace(/\s/g, "") > 0) {
                                        b = b + "\n{i18n>EINME} : " + e.results[i].Einme.replace(/\s/g, "")
                                    }
                                    if (e.results[i].Speme.replace(/\s/g, "") > 0) {
                                        b = b + "\n{i18n>SPEME} : " + e.results[i].Speme.replace(/\s/g, "")
                                    }
                                    if (e.results[i].Retme.replace(/\s/g, "") > 0) {
                                        b = b + "\n{i18n>RETME} : " + e.results[i].Retme.replace(/\s/g, "")
                                    }
                                    var C = new sap.ui.vbm.Pie({
                                        scale: "3;1;1",
                                        position: m + ";" + y + ";0",
                                        tooltip: "Plant : " + e.results[i].Name1 + "\nAdresse : " + e.results[i].Address + b,
                                        key: e.results[i].Werks
                                    });
                                    C.addItem(new sap.ui.vbm.PieItem({
                                            color: "{i18n>colorLABST}",
                                            name: "{i18n>LABST}",
                                            value: e.results[i].Labst.replace(/\s/g, "")
                                        }));
                                    C.addItem(new sap.ui.vbm.PieItem({
                                            color: "{i18n>colorEINME}",
                                            name: "{i18n>EINME}",
                                            value: e.results[i].Einme.replace(/\s/g, ""),
                                            click: function (e) {
                                                console.log("var Pie = new sap.ui.vbm.Pie({ ")
                                            }
                                        }));
                                    C.addItem(new sap.ui.vbm.PieItem({
                                            color: "{i18n>colorSPEME}",
                                            name: "{i18n>SPEME}",
                                            value: e.results[i].Speme.replace(/\s/g, "")
                                        }));
                                    C.addItem(new sap.ui.vbm.PieItem({
                                            color: "{i18n>colorINSME}",
                                            name: "{i18n>INSME}",
                                            value: e.results[i].Insme.replace(/\s/g, "")
                                        }));
                                    C.addItem(new sap.ui.vbm.PieItem({
                                            color: "{i18n>colorRETME}",
                                            name: "{i18n>RETME}",
                                            value: e.results[i].Retme.replace(/\s/g, "")
                                        }));
                                    C.addItem(new sap.ui.vbm.PieItem({
                                            color: "{i18n>colorUMLME}",
                                            name: "{i18n>UMLME}",
                                            value: e.results[i].Umlme.replace(/\s/g, "")
                                        }));
                                    sap.ui.getCore().AppContext.globeView.byId("sQuantityPies").addItem(C)
                                }
                                if (e.results[i].ConformityKey != "") {
                                    s = s + 1;
                                    var C = new sap.ui.vbm.Pie({
                                        scale: "3;1;1",
                                        position: m + ";" + y + ";0",
                                        tooltip: "Plant : " + e.results[i].Name1 + "\nAdresse : " + e.results[i].Address,
                                        key: e.results[i].Werks
                                    });
                                    var v = e.results[i].ConformityKey.split("|");
                                    var I = e.results[i].ConformityLabel.split("|");
                                    var M = e.results[i].ConformityValue.split("|");
                                    var S = sap.ui.getCore().byId("application-STKsmartstock-display-component---globe").getModel("i18n");
                                    var k = "";
                                    for (var f = 1; f < v.length; f++) {
                                        if (M[f].replace(/\s/g, "") > 0) {
                                            o = {};
                                            o.key = v[f];
                                            o.label = I[f];
                                            a.push(o);
                                            if (v[f] == "ZZ") {
                                                k = k + "\n" + I[f] + " : " + M[f].replace(/\s/g, "")
                                            } else {
                                                k = k + "\n" + v[f] + " - " + I[f] + " : " + M[f].replace(/\s/g, "")
                                            }
                                            C.addItem(new sap.ui.vbm.PieItem({
                                                    color: S.getProperty(v[f]),
                                                    name: I[f],
                                                    value: M[f]
                                                }))
                                        }
                                    }
                                    debugger;
                                    var P = "Plant : " + e.results[i].Name1 + "\nAdresse : " + e.results[i].Address + k;
                                    C.setTooltip(P);
                                    if (C.getItems().length != 0) {
                                        sap.ui.getCore().AppContext.globeView.byId("sConformityPies").addItem(C)
                                    }
                                }
                            } catch (e) {
                                console.log(e.message)
                            }
                        }
                    }
                    var h = sap.ui.getCore().AppContext.globeView.byId("idLegendConformityColor");
                    h.removeAllItems();
                    h.addItem(new sap.m.GroupHeaderListItem({
                            title: "Conforminty values",
                            upperCase: false
                        }));
                    a = a.sort(function (e, t) {
                        return e.key.localeCompare(t.key)
                    });
                    a = Array.from(new Set(a.map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
                    var A = a.length - 1;
                    var w = "";
                    for (var L = 0; L < a.length; L++) {
                        if (L == A) {
                            w = a[L].label
                        } else {
                            w = a[L].key + " : " + a[L].label
                        }
                        var V = new sap.ui.vk.LegendItem({
                            title: w,
                            color: S.getProperty(a[L].key)
                        });
                        h.addItem(V);
                        f = v.length
                    }
                    if (n == 0) {
                        var x = "Warning \r\n No stock found for this selection.";
                        r.show(x)
                    }
                    if (s == 0) {
                        var x = "Warning \r\n No quality inspection stock found for this selection.";
                        r.show(x)
                    }
                    sap.ui.getCore().AppContext.globeView.byId("idCustomerQuantityRoute").setPosition("");
                    sap.ui.getCore().AppContext.globeView.byId("idCustomerConformityRoute").setPosition("");
                    if (e.results.length == 1) {
                        e.results[0].Land1
                    }
                    var E = sap.ui.getCore().AppContext.globeView.byId("mapContainer");
                    E.setBusy(false)
                },
                error: function (e, t) {
                    console.log(e);
                    var o = sap.ui.getCore().AppContext.globeView.byId("mapContainer");
                    var a = "Error \r\n Communication to the server failed.";
                    r.show(a);
                    o.setBusy(false)
                }
            });
            var A = sap.ui.getCore().AppContext.globeView.byId("idListPanelGeoMap001")
        },
        onSelectdisplayMode: function (e) {
            var t = e.getSource().getSelectedItem();
            var o = sap.ui.getCore().AppContext.globeView.byId("mapContainer");
            var a = 0;
            var n;
            switch (t.getKey()) {
            case "quantityAnalytic":
                a = 0;
                break;
            case "quantityGeo":
                a = 1;
                break;
            case "conformity":
                a = 2;
                break;
            case "stockValue":
                a = 3;
                break;
            default:
            }
            n = o.getSelectedContent().getContent();
            o.setSelectedContent(o.getContent()[a]);
            o.rerender();
            var s = n.getZoomlevel();
            var r = n.getCenterPosition();
            i.setZoom(o.getSelectedContent().getContent().getId(), s, r)
        },
        handlePopoverPress: function (e) {
            console.log("Click Event : handlePopoverPress  ");
            var t = e.getSource();
            if (!this._oPopover) {
                s.load({
                    name: "STK.smartstock.view.Popover",
                    controller: this
                }).then(function (e) {
                    this._oPopover = e;
                    sap.ui.getCore().AppContext.globeView.addDependent(this._oPopover);
                    this._oPopover.openBy(t)
                }
                    .bind(this))
            } else {
                this._oPopover.openBy(t)
            }
        },
    })
}, true);
