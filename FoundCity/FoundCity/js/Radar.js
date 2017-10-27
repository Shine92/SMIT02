var rZoom = 18;
var rDistance = 50;
var rMap;
var rMKs = [];
var rAddress;

window.onload = initLoad;

function initLoad() {
    //rDetect();
    //rScrollRule();
    initDistance();
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
    initDistance(map, myLatlng)

}

function intiMarker(myMap, myLatlng) {
    var mainMK = new google.maps.Marker({
        position: myLatlng,
        animation: google.maps.Animation.BOUNCE,
        icon: "../images/Radar_Home.png",
    });
    rMKs.push(mainMK);
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
                var aryRow = new Array();
                initDetailed(myMap, placeID, aryRow, 0, data.length);
                break;
            default:

                break;
        }
    });

}

function initDetailed(myMap, data, aryRow, num, maxNum) {
    if (num < maxNum) {
        var service = new google.maps.places.PlacesService(myMap);
        service.getDetails({
            placeId: data[num]
        }, function (place, status) {
            switch (status) {
                case google.maps.places.PlacesServiceStatus.OK:
                    aryRow[num]["name"] = place.name;
                    aryRow[num]["tel"] = place.formatted_phone_number;
                    aryRow[num]["address"] = place.formatted_address;
                    aryRow[num]["rating"] = place.rating;
                    break;
                default:
                    break;
            }
        });
    } else {
    }
}

function initDistance() {
    var start = "台中市南屯區公益路二段51號";
    var end = "台中市南屯區大墩路671號";
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
    };
    //宣告
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        var strTmp = "";
        if (status == google.maps.DirectionsStatus.OK) {
            var route = response.routes[0];
            for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                strTmp += route.legs[i].distance.text;
            }
            //取得距離(正整數，公尺)
            var dist = parseInt(parseFloat(strTmp) * 1000).toString();
            alert(strTmp);
            alert(parseFloat(strTmp));
            alert(parseInt(parseFloat(strTmp)));
            alert(dist);
        }
    });
}


//----------------------------------------------------------------------------------------------

function rADD() {
    btnClean();
}

function rLower() {
    btnClean();
}

function rRE() {
    btnClean();
}