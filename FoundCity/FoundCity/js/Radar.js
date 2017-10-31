var rZoom = 15;
var rDistance = 50;
var rMarkers = [];
var rAddress;
var rMap;
var rLatling;

window.onload = initLoad;

function initLoad() {
    rDetect();
    rScrollRule();
    //initDistance();
    //btnClean();
}

function btnClean() {
    $('.btn').button();
}

//----------------------------------------------------------------------------------------------

function rScrollRule() {
    $('#rResult_Table').bind('mousewheel DOMMouseScroll', function (e) {
        var scrollTo = null;

        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        }
        else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }

        if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });
}

function rDetect() {
    // 瀏覽器支援 HTML5 定位方法
    if (navigator.geolocation) {
        // HTML5 定位抓取
        navigator.geolocation.getCurrentPosition(function (position) {
            mapServiceProvider(position.coords.latitude, position.coords.longitude);
        },
        function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED: // 拒絕
                    rFailDetect('定位失敗1');
                    break;
                default:
                    rFailDetect('定位失敗2');
                    break;
            }
        });
    } else { // 不支援 HTML5 定位
        // 若支援 Google Gears
        if (window.google && google.gears) {
            try {
                // 嘗試以 Gears 取得定位
                var geo = google.gears.factory.create('beta.geolocation');
                geo.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true, gearsRequestAddress: true });
            } catch (e) {
                rFailDetect('定位失敗3');
            }
        } else {
            rFailDetect('定位失敗4');
        }
    }
}

function rFailDetect(msg) {
    alert(msg);
    var rC = confirm("是否手動輸入地址");
    if (rC) {
        initAddress();
    } else {

    }
}

function initAddress() {
    var rP = prompt("請輸入地址");
    if (rP != null && rP.trim.length != 0) {
        initLatlng(rP);
    } else {
        if (confirm("將使用預設位置：台中市南屯區公益路二段51號")) {
            initLatlng("台中市南屯區公益路二段51號");
        } else {
            initAddress();
        }
    }
}

function initLatlng(userAddress) {

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': userAddress }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var rLat = results[0].geometry.location.lat();
            var rLng = results[0].geometry.location.lng();
            var myLatlng = new google.maps.LatLng(rLat, rLng);
            initMAP(myLatlng);
            rAddress = userAddress;
        }
        else {
            if (prompt("搜尋失敗,請在試一次", userAddress)) {
                rConversionLatLng(userAddress);
            }
            else {
                initAddress();
            }
        }
    });
}

function initMAP(myLatlng) {

    var mapDiv = document.getElementById("rMap-Canvas");

    var mapProp = {
        center: myLatlng,
        zoom: rZoom,
        disableDefaultUI: true,
        gestureHandling: 'none',
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
            }
        ]
    };

    var map = new google.maps.Map(mapDiv, mapProp);

    rMap = map;
    rLatling = myLatlng;

    var mRange = new google.maps.Circle({
        center: myLatlng,
        radius: rDistance,
        strokeColor: "#33FF33",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#33FF33",
        fillOpacity: 0.2
    });
    mRange.setMap(map);

    intiMarker(map, myLatlng);
    initRange(map, myLatlng);
}

function intiMarker(myMap, myLatlng) {
    var mainMK = new google.maps.Marker({
        position: myLatlng,
        animation: google.maps.Animation.BOUNCE,
        icon: "../images/Radar_Home.png",
    });
    rMarkers.push(mainMK);
    mainMK.setMap(myMap);
}

function initRange(myMap, myLatlng) {

    var service = new google.maps.places.PlacesService(myMap);

    var request = {
        location: myLatlng,
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: ['veterinary_care']
    };

    service.nearbySearch(request, function (data, status) {
        switch (status) {
            case google.maps.places.PlacesServiceStatus.OK:
                var placeID = new Array();
                $.each(data, function (index, vul) {
                    placeID[index] = vul.place_id;
                });
                var aryRow = {};
                Schedule(myMap, aryRow, placeID, 0, data.length);
                break;
            default:
                break;
        }
    });

}


function Schedule(myMap, aryRow, data, num, maxNum) {

    $("#rResult_Table").hide();
    $("#myProgress").show();

    var service = new google.maps.places.PlacesService(myMap);
    var directionsService = new google.maps.DirectionsService();

    var elem = document.getElementById("myBar");
    var sWidth = 100 / maxNum;

    var myDetail = setInterval(initDetail, 100);

    function initDetail() {
        if (num < maxNum) {
            service.getDetails({
                placeId: data[num]
            }, function (place, status) {
                switch (status) {
                    case google.maps.places.PlacesServiceStatus.OK:

                        var isNow = ((place["opening_hours"]) != null ? ((place["opening_hours"]["open_now"]) ? "1" : "0") : "2");

                        directionsService.route({
                            origin: rAddress,
                            destination: place.formatted_address,
                            travelMode: 'WALKING',
                        }, function (response, status) {
                            switch (status) {
                                case google.maps.DirectionsStatus.OK:
                                    var dist = response.routes[0].legs[0].distance.value;
                                    aryRow[num] = {
                                        name: place.name,
                                        tel: place.formatted_phone_number,
                                        address: place.formatted_address,
                                        rating: place.rating,
                                        now: isNow,
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                        dist: dist
                                    };
                                    num++;
                                    elem.style.width = sWidth * num + '%';
                                    break
                            }
                        });
                        break;

                    default:

                        break;
                }
            });
        } else {
            clearInterval(myDetail);
            $.each(aryRow, function (index, vul) {
                rResultView(vul);
            });
            rEnd();
            $("#rResult_Table").show();
            $("#myProgress").hide();
        }
    }

}

function rResultView(aryRow) {

    var statusIconColor;
    var statusText;
    var statusTitleColor;

    switch (aryRow["now"]) {
        case "0":
            statusIconColor = "bg-danger";
            statusText = "休息中";
            statusTitleColor = "panel-danger";
            break
        case "1":
            statusIconColor = "bg-success";
            statusText = "營業中";
            statusTitleColor = "panel-success";
            break
        case "2":
            statusIconColor = "bg-warning";
            statusText = "店家未提供營業時間";
            statusTitleColor = "panel-warning";
            break;
    }

    $('#rResult_Content').append(
        $('<li>').append(
            $('<article>').addClass('timeline-entry').append(
                $('<div>').addClass('timeline-entry-inner').append(
                    $('<div>').addClass('timeline-icon ' + statusIconColor).append(
                            $('<i>').addClass('entypo-feather')),
                            $('<div>').addClass('timeline-label').on("click", function (e) {

                                setMapOnAll(null);

                                var markerA = new google.maps.Marker({
                                    position: rLatling,
                                    icon: '../images/Radar_Home.png'
                                });
                                rMarkers.push(markerA);
                                markerA.setMap(rMap);

                                var markerB = new google.maps.Marker({
                                    position: new google.maps.LatLng(aryRow["lat"], aryRow["lng"]),
                                    animation: google.maps.Animation.BOUNCE
                                });

                                rMarkers.push(markerB);
                                markerB.setMap(rMap);

                            }).append(
                                $('<article>').addClass(statusTitleColor).append(
                                     $('<div>').addClass('panel-heading').append(
                                         $('<a>').addClass('rResult_Content_Title').html(aryRow["name"] + "<br>")),
                                      $('<div>').addClass('panel-body').append(
                                         $('<font>').addClass('rResult_Content_Text').html("營業狀態：" + statusText + "<br>")),
                                      $('<div>').addClass('panel-footer').append(
                                        $('<font>').addClass('rResult_Content_Text').html("電話：" + ((aryRow["tel"] != null) ? aryRow["tel"] : "店家未提供電話") + "<br>")),
                                      $('<div>').addClass('panel-body').append(
                                         $('<font>').addClass('rResult_Content_Text').html("地址：" + aryRow["address"] + "<br>"))
                            ))))));
}

//----------------------------------------------------------------------------------------------

function rEnd() {
    $('#rResult_Content').append(
        $('<article>').addClass('timeline-entry begin').append(
            $('<div>').addClass('timeline-entry-inner').append(
                $('<div>').addClass('timeline-icon').css('-webkit-transform', 'rotate(-90deg)').css('-moz-transform', 'rotate(-90deg)').append(
                    $('<i>').addClass('entypo-flight')
                )
            )
        )
    );
}

function setMapOnAll(map) {
    for (var i = 0; i < rMarkers.length; i++) {
        rMarkers[i].setMap(map);
    }
}

function rADD() {
    //btnClean();
    $.ajax({
        url: "/Street/County",
        type: "Get",
        success: function (data) {
            alert("OK");
            $("#rResult_Table").text(JSON.stringify(data));
        },
        error: function (error) {
            document.write(error.responseText);
        }
    });

}

function rLower() {
    //btnClean();
    $.ajax({
        url: "/Street/Area",
        type: "POST",
        data: {
            city: "台中市"
        },
        success: function (data) {
            alert(JSON.stringify(data));
        },
        error: function (error) {
            document.write(error.responseText);
        }

    });
}

function rRE() {
    //btnClean();
    $.ajax({
        url: "/Street/Road",
        type: "POST",
        data: {
            code: "100"
        },
        success: function (data) {
            alert(JSON.stringify(data));
        },
        error: function (error) {
            document.write(error.responseText);
        }

    });
}
