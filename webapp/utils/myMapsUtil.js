sap.ui.define(["../utils/myMapsUtil"], function (e) {
    "use strict";
    return {
        vHEREMapURL: String("val"),
        vRenderGeoMapAuto: String("N"),
        setMap: function (ea) {
            console.log(ea);
            var t = "qZn4Oejg6GJhFAGgOkEJpCBQYXqSrzX41hIPZpxBGBc";
            var a = "https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day.grey";
            var o = a + "/{LOD}/{X}/{Y}/256/png8?apiKey=" + t;
            // debugger;
            var r = ea.byId("geographicMap1");
            console.log('LOGS');
            console.log(r);
            var p = {
                MapProvider: [{
                    name: "HEREMAPS",
                    type: "HERETerrainMap",
                    description: "",
                    tileX: "256",
                    tileY: "256",
                    maxLOD: "10",
                    copyright: "Tiles Courtesy of HERE Maps",
                    Source: [{
                        id: "s1",
                        url: "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=15EHQjDvIbWFphnkpHdq&app_code=93Od-jXUopuYmhJlBC9c8g"
                    }, {
                        id: "s2",
                        url: "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=15EHQjDvIbWFphnkpHdq&app_code=93Od-jXUopuYmhJlBC9c8g"
                    }
                    ]
                }, {
                    name: "traffic",
                    type: "traffic",
                    description: "",
                    tileX: "256",
                    tileY: "256",
                    maxLOD: "25",
                    copyright: "Tiles Courtesy of HERE Maps",
                    Source: [{
                        id: "s1",
                        url: "https://1.traffic.maps.api.here.com/maptile/2.1/traffictile/newest/normal.traffic.day/{LOD}/{X}/{Y}/256/png8?app_id=15EHQjDvIbWFphnkpHdq&app_code=93Od-jXUopuYmhJlBC9c8g"
                    }, {
                        id: "s2",
                        url: "https://2.traffic.maps.api.here.com/maptile/2.1/traffictile/newest/normal.traffic.day/{LOD}/{X}/{Y}/256/png8?app_id=15EHQjDvIbWFphnkpHdq&app_code=93Od-jXUopuYmhJlBC9c8g"
                    }
                    ]
                }, {
                    name: "OPENSTREETMAP",
                    type: "HERETerrainMap",
                    description: "",
                    tileX: "256",
                    tileY: "256",
                    maxLOD: "25",
                    copyright: "Tiles Courtesy of HERE Maps",
                    Source: [{
                        id: "s1",
                        url: "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
                    }
                    ]
                }, {
                    name: "google",
                    type: "google",
                    description: "",
                    tileX: "256",
                    tileY: "256",
                    maxLOD: "25",
                    copyright: "Tiles Courtesy of HERE Maps",
                    Source: [{
                        id: "s1",
                        url: "https://mt.google.com/vt/x={X}&y={Y}&z={LOD}"
                    }
                    ]
                }
                ],
                MapLayerStacks: [{
                    name: "HEREMAPS",
                    MapLayer: {
                        name: "layer1",
                        refMapProvider: "HEREMAPS",
                        opacity: "1.0",
                        colBkgnd: "RGB(255,255,255)"
                    }
                }
                ]
            };
            r.setMapConfiguration(p);
            r.setRefMapLayerStack("HEREMAPS");
            var i = {
                MapProvider: [{
                    name: "google",
                    type: "google",
                    description: "",
                    tileX: "256",
                    tileY: "256",
                    maxLOD: "25",
                    copyright: "Tiles Courtesy of HERE Maps",
                    Source: [{
                        id: "s1",
                        url: o
                    }
                    ]
                }
                ],
                MapLayerStacks: [{
                    name: "Google",
                    MapLayer: {
                        name: "google",
                        refMapProvider: "google",
                        opacity: "1.0",
                        colBkgnd: "RGB(255,255,255)"
                    }
                }
                ]
            };
            var s = ea.getView().byId("geographicMap2");
            s.setMapConfiguration(i);
            s.setRefMapLayerStack("Google")
        },
        setZoom: async function (t, a, x) {
            /** 
             *  t = AbsolutePath of the selected Map
             *  a = currentMapZoomLevel taken from the previous map
             *  x = currentMapCenterPosition taken from the previous map
             */
            setTimeout(() => {
                myvRenderGeoMapAuto = "Y";
                var o = sap.ui.getCore().byId(t);
                o.setCenterPosition(x);
                o.setZoomlevel(a);
                myvRenderGeoMapAuto = "N"
            }, 100)
        },
        customerSpotContext: function (e) {
            var t = e.mParameters.menu;
            t.addItem(new sap.ui.unified.MenuItem({
                text: "Calculate Routes",
                icon: "sap-icon://legend",
                select: function (e) {
                    console.log(e);
                    var t = e.getSource().getParent().vbi_data.instance;
                    var a = sap.ui.getCore().byId(t);
                    var o = a.getPosition().split(";")[1];
                    var r = a.getPosition().split(";")[0];
                    var p = [];
                    var i;
                    if (sap.ui.getCore().byId(sap.ui.getCore().AppContext.MapGeoQuantity).isRendered()) {
                        i = sap.ui.getCore().byId("container-StockManagement---globe--idCustomerQuantityRoute");
                        p = sap.ui.getCore().byId("container-StockManagement---globe--sQuantityPies").getItems()
                    }
                    if (sap.ui.getCore().byId(sap.ui.getCore().AppContext.MapGeoValue).isRendered()) {
                        p = sap.ui.getCore().byId("container-StockManagement---globe--sConformityPies").getItems();
                        i = sap.ui.getCore().byId("container-StockManagement---globe--idCustomerConformityRoute")
                    }
                    var s = "";
                    var n = "";
                    var l = parseFloat(n);
                    var u = parseFloat(s);
                    var c = [];
                    var g = {};
                    for (var m = 0; m < p.length; m++) {
                        var d = p[m].getPosition().split(";");
                        n = d[1];
                        s = d[0];
                        l = parseFloat(n) - o;
                        u = parseFloat(s) - r;
                        l = Math.abs(l);
                        u = Math.abs(u);
                        g = {};
                        g.key = p[m].getKey();
                        g.value = l + u;
                        g.longitude = n;
                        g.latitude = s;
                        c.push(g)
                    }
                    c = c.sort(function (e, t) {
                        return e.value - t.value
                    });
                    n = c[0].longitude;
                    s = c[0].latitude;
                    var y = c[0].key;
                    var v = new XMLHttpRequest;
                    var f = sap.ui.getCore().AppContext.HereCalculateRouteLink;
                    var M = sap.ui.getCore().AppContext.HereApiKey;
                    var h = "waypoint0=" + n + "%2C" + s;
                    var C = "waypoint1=" + o + "%2C" + r;
                    var E = f + h + "&" + C + "&mode=fastest%3Btruck&routeattributes=sh" + "&apiKey=" + M;
                    console.log(E);
                    v.open("GET", E, false);
                    v.send();
                    console.log("Customer Route : " + v.responseText);
                    var R = JSON.parse(v.responseText);
                    try {
                        var b = R.response.route[0].shape;
                        var S = R.response.route[0].leg[0].maneuver;
                        var H = "";
                        console.log(b);
                        for (var m = 0; m < b.length; m++) {
                            H = H + ";" + b[m].split(",")[1] + ";" + b[m].split(",")[0] + ";0"
                        }
                        i.setPosition(H.substr(1));
                        var L = R.response.route[0].summary.text;
                        var k = L.split('class="length">')[1].split("</span>");
                        var O = L.split('class="length">')[1].split("</span>")[1];
                        O = O.split('class="time">')[1];
                        i.setTooltip("Distance : " + k[0] + "\nTime : " + O);
                        i.setLabelText("Truck route to the nearest plant " + y)
                    } catch (e) {
                        try {
                            console.log(R.subtype);
                            if (R.subtype == "NoRouteFound") {
                                sap.m.MessageToast.show("No Truck route found.")
                            }
                        } catch (e) { }
                        console.log(e.message)
                    }
                }
            }));
            e.getSource().openContextMenu(t)
        },
        duplicatMapChangeToAnalyti: function (e) { }
    }
});
