function initMap(elId) {
    var mockDataObj,
        map,
        latLngs,
        infoWindows,
        markers,
        images;

    latLngs = {};
    infoWindows = {};
    markers = {};
    images = {};

    mockDataObj = {
        payload: [
            {name: "156", latitude: "14.860197", longitude: "-89.125342", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "157", latitude: "14.859532", longitude: "-89.126442", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "158", latitude: "14.859089", longitude: "-89.127129", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "159", latitude: "14.857067", longitude: "-89.132509", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "159A33", latitude: "14.856628", longitude: "-89.13243300000001", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "160", latitude: "14.856074", longitude: "-89.132254", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "161", latitude: "14.854935", longitude: "-89.132653", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "162", latitude: "14.853843", longitude: "-89.133015", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "163", latitude: "14.851341", longitude: "-89.134047", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "164", latitude: "14.850167", longitude: "-89.13653100000001", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "155", latitude: "14.860868", longitude: "-89.1242", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "165", latitude: "14.848611", longitude: "-89.139841", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "166", latitude: "14.847081", longitude: "-89.143029", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "167", latitude: "14.846241", longitude: "-89.144839", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "168", latitude: "14.845094", longitude: "-89.147198", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "169", latitude: "14.844757", longitude: "-89.147941", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "170", latitude: "14.843829", longitude: "-89.15021900000001", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "171", latitude: "14.844739", longitude: "-89.14792300000001", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "172", latitude: "14.846315", longitude: "-89.144688", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "154", latitude: "14.861579", longitude: "-89.123081", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "153", latitude: "14.862516", longitude: "-89.121426", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "152", latitude: "14.863463", longitude: "-89.11985300000001", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            },
            {name: "151", latitude: "14.864539", longitude: "-89.118144", images:
                [{
                    full: "/img/str/sample_full.jpg",
                    thumb: "/img/str/sample_thumb.jpg"
                }]
            }
        ]
    };
    
    map = new google.maps.Map(document.getElementById(elId), {
        zoom: 13,
        center: new google.maps.LatLng(14.838664, -89.15529600000001),
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    function handleMarkerClicked(e) {
        var name;

        name = this.getTitle();
        searchForStructureByName(name);
    }

    function searchForStructureByName(name) {
        var header,
            body,
            i,
            ul,
            li_list;

        if (markers[name]) {
            body    = document.createElement("div");
            header  = document.createElement("div");
            ul      = document.createElement("ul");
            li_list = [];

            header.appendChild(document.createTextNode("Estructura: " + name));
            body.appendChild(header);

            for (i = 0; images[name] && i < images[name].length; i++) {
                images[name][i].thumb_img = new Image();
                images[name][i].thumb_img.src = images[name][i].thumb;
                images[name][i].thumb_img.border = "1";
                body.appendChild(images[name][i].thumb_img);
            }

            li_list[0] = document.createElement("li");
            li_list[1] = document.createElement("li");
            li_list[2] = document.createElement("li");

            li_list[0].appendChild(document.createTextNode("Altitud: XXXX"));
            li_list[1].appendChild(document.createTextNode("Posición: " + latLngs[name].toString()));
            li_list[2].appendChild(document.createTextNode("Notas: XYZ XYZ XYZ XYZ"));

            ul.appendChild(li_list[0]);
            ul.appendChild(li_list[1]);
            ul.appendChild(li_list[2]);

            body.appendChild(ul);

            if (!infoWindows[name]) {
                infoWindows[name] = new google.maps.InfoWindow({
                    content: body
                });
            }

            if (infoWindows.showing) {
                infoWindows[infoWindows.showing].close();
            }

            infoWindows[name].open(map, markers[name]);
            infoWindows.showing = name;
            map.panTo(latLngs[name]);
            map.setZoom(16);
        }
    }

    function addMarkersAndToolTips(e) {
        var i,
            button,
            form;

        button = document.getElementById("search_button");
        form   = document.getElementById("search_form");

        for (i = 0; i < mockDataObj.payload.length; i++) {
            latLngs[mockDataObj.payload[i].name] = new google.maps.LatLng(mockDataObj.payload[i].latitude, mockDataObj.payload[i].longitude);
            markers[mockDataObj.payload[i].name] = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: latLngs[mockDataObj.payload[i].name],
                map: map,
                title: mockDataObj.payload[i].name
            });
            images[mockDataObj.payload[i].name] = mockDataObj.payload[i].images;
            google.maps.event.addListener(markers[mockDataObj.payload[i].name], 'click', handleMarkerClicked);
        }

        document.getElementById("search_wrapper").style.visibility = "";

        button.onclick = function(e) {
            var txt;
            txt = document.getElementById("search_text").value;
            searchForStructureByName(txt);
        };

        form.onsubmit = function(e) {
            var txt;
            e.preventDefault();
            txt = document.getElementById("search_text").value;
            searchForStructureByName(txt);
        };
    }

    google.maps.event.addListenerOnce(map, 'tilesloaded', addMarkersAndToolTips);
}