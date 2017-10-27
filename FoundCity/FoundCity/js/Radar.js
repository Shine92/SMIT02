var rLat = 0;
var rLng = 0;
var rZoom = 18;
var rDistance = 50;
var rMap;
var rMarkers = [];

function btnClean() {
    $('.btn').button();
}

window.onload = rDetect;

$('.scrollable').
    bind('mousewheel DOMMouseScroll', function (e) {
        var delta = e.wheelDelta || -e.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });

//----------------------------------------------------------------------------------------------

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
                    rFailDetect('定位失敗');
                    break;
                default:
                    rFailDetect('定位失敗');
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
                rFailDetect('定位失敗');
            }
        } else {
            rFailDetect('定位失敗');
        }
    }
}

function rFailDetect(msg) {
    alert(msg);
    var rC = confirm("是否手動輸入地址");
    if (rC) {
        rUserAddress();
    } else {

    }
}

function rUserAddress() {
    var rP = prompt("請輸入地址");
    if (rP != null && rP.trim.length != 0) {
        rInitLatLng(rP);
    } else {
        if (confirm("將使用預設位置：台中市南屯區公益路二段51號")) {
            rInitLatLng("台中市南屯區公益路二段51號");
        } else {
            rUserAddress();
        }
    }
}

function rInitLatLng(userAddress) {

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': userAddress }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            rLat = results[0].geometry.location.lat();
            rLng = results[0].geometry.location.lng();
            rInitMAP();
        }
        else {
            if (prompt("搜尋失敗,請在試一次", userAddress)) {
                rConversionLatLng(userAddress);
            }
            else {
                rUserAddress();
            }
        }
    });
}

function rInitMAP() {

    var mapDiv = document.getElementById("rMap-Canvas");

    var myLatlng = new google.maps.LatLng(rLat, rLng);

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

    rMap = new google.maps.Map(mapDiv, mapProp);

    var marker = new google.maps.Marker({
        position: myLatlng,
        animation: google.maps.Animation.BOUNCE,
        icon: "../images/Radar_Home.png",
    });

    rMarkers.push(marker);

    marker.setMap(rMap);

    var mRange = new google.maps.Circle({
        center: myLatlng,
        radius: rDistance,
        strokeColor: "#33FF33",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#33FF33",
        fillOpacity: 0.2
    });

    mRange.setMap(rMap);

    var infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(rMap);

    service.nearbySearch({
        location: myLatlng,
        radius: rDistance,
        type: ['food']
    }, callback);

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