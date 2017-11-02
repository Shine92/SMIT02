﻿var rMarkers = [];
var rMap;
var rLatlng;
var searchType;

window.onload = rScrollRule;

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
                    case error.TIMEOUT:
                        enterAddress('很抱歉，連線逾時，');
                        break;

                    case error.POSITION_UNAVAILABLE:
                        enterAddress('無法取得您的位置，');
                        break;
                        XMLDocument
                    case error.PERMISSION_DENIED: // 拒絕
                        enterAddress('由於您封鎖我們取得您位置的權限，');
                        break;

                    case error.UNKNOWN_ERROR:
                        enterAddress('因為發生不明的錯誤，');
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
                enterAddress('無法取得您的位置！');
            }
        } else {
            enterAddress('由於您封鎖我們取得您位置的權限！');
        }
    }
}

function mapServiceProvider(latitude, longitude) {
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    initMAP(myLatlng);
}

// 成功取得 Gears 定位
function successCallback(p) {
    mapServiceProvider(p.latitude, p.longitude);
}

// 取得 Gears 定位發生錯誤
function errorCallback(err) {
    //var msg = 'Error retrieving your location: ' + err.message;
    //alert(msg);
}

function enterAddress(msg) {
    var rP;

    if (msg != null)
        rP = prompt(msg + "\n" + "請您手動輸入地址");
    else
        rP = prompt("請手動輸入地址");

    if (rP != null) {
        if (rP.trim().length != 0) {
            initLatlng(rP);
        } else {
            enterAddress("地址不得為空白");
        }
    } else {
        if (confirm("台中市南屯區公益路二段51號")) {
            initLatlng("台中市南屯區公益路二段51號");
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
        }
        else {
            if (prompt("定位失敗,請重新搜尋地址", userAddress))
                initLatlng(userAddress);
        }
    });
}

function initMAP(myLatlng) {

    $("#rRange").html("0");
    $("#rMap_Body").show();
    $("#rPrompt").hide();

    var mapDiv = document.getElementById("rMap-Canvas");

    var mapProp = {
        center: myLatlng,
        zoom: 18,
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

    rLatlng = myLatlng;

    intiMarker();
    initRange();
}

function intiMarker() {
    var mainMK = new google.maps.Marker({
        position: rLatlng,
        animation: google.maps.Animation.BOUNCE,
        icon: "../images/Radar_Home.png",
    });
    rMarkers.push(mainMK);
    mainMK.setMap(rMap);
}

function initRange() {

    var service = new google.maps.places.PlacesService(rMap);

    switch (searchType) {

        case "Hospital":
            service.nearbySearch({
                location: rLatlng,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: ["veterinary_care"]
            }, rangeCallBack);
            break

        case "Store":
            service.nearbySearch({
                location: rLatlng,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: ["pet_store"]
            }, rangeCallBack);
            break

        case "Hostel":
            service.textSearch({
                location: rLatlng,
                query: '寵物旅館'
            }, rangeCallBack);
            break

        default:
            break;

    }

}

function rangeCallBack(data, status) {
    switch (status) {
        case google.maps.places.PlacesServiceStatus.OK:
            var placeID = new Array();
            $.each(data, function (index, vul) {
                placeID[index] = vul.place_id;
            });
            var aryRow = [];
            Schedule(aryRow, placeID, 0, data.length);
            break;
        default:
            break;
    }
}

function Schedule(aryRow, data, num, maxNum) {

    $("#rResult_Table").hide();
    $("#rScheduleBar").show();

    var service = new google.maps.places.PlacesService(rMap);
    var directionsService = new google.maps.DirectionsService();

    var elem = document.getElementById("myBar");
    var sWidth = 100 / maxNum;

    elem.style.width = '1%';
    $("#rRatio").html("0");

    var myDetail = setInterval(initDetail, 500);

    function initDetail() {
        if (num < maxNum) {
            service.getDetails({
                placeId: data[num]
            }, function (place, status) {
                switch (status) {
                    case google.maps.places.PlacesServiceStatus.OK:

                        var isNow = ((place["opening_hours"]) != null ? ((place["opening_hours"]["open_now"]) ? "1" : "0") : "2");

                        directionsService.route({
                            origin: rLatlng,
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

                                    if (num != 0) {
                                        if (aryRow[num]["name"] != aryRow[num - 1]["name"]) {
                                            num++;
                                            elem.style.width = sWidth * num + '%';
                                            $("#rRatio").html(sWidth * num);
                                        } else {
                                            aryRow[num].length = 0;
                                        }
                                    } else {
                                        num++;
                                    }
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
            $("#rResult_Table").show();
            $("#rResult_Table").scrollTop(0);
            $("#rScheduleBar").hide();
            $('#rResult_Content').empty();

            aryRow = aryRow.sort(function (x, y) {
                return x.dist > y.dist ? 1 : -1;
            });

            $.each(aryRow, function (index, vul) {
                rResultView(vul);
            });
            rEnd();
            viewMap(aryRow);
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
                            position: rLatlng,
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

                        $("#rRange").html(aryRow["dist"]);

                    }).append(
                        $('<article>').addClass(statusTitleColor).append(
                            $('<div>').addClass('panel-heading').append(
                                $('<a>').addClass('rResult_Content_Title').html(aryRow["name"] + "<br>")),
                            $('<div>').addClass('panel-body').append(
                                $('<font>').addClass('rResult_Content_Text').html(statusText + "<br>")),
                            $('<div>').addClass('panel-footer').append(
                                $('<font>').addClass('rResult_Content_Text').html("電話：" + ((aryRow["tel"] != null) ? aryRow["tel"] : "店家未提供電話") + "<br>")),
                            $('<div>').addClass('panel-body').append(
                                $('<font>').addClass('rResult_Content_Text').html("地址：" + aryRow["address"] + "<br>"))
                        ))))));
}

function viewMap(aryRow) {
    var bounds = new google.maps.LatLngBounds();

    bounds.extend(rLatlng);

    $.each(aryRow, function (index, vul) {
        bounds.extend(new google.maps.LatLng(vul["lat"], vul["lng"]));
    });
    rMap.setCenter(bounds.getCenter());
    rMap.fitBounds(bounds);

    viewRange(aryRow[aryRow.length - 1].dist);
}

function viewRange(Dist) {
    var mRange = new google.maps.Circle({
        center: rLatlng,
        radius: Dist,
        strokeColor: "#33FF33",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#33FF33",
        fillOpacity: 0.2
    });
    mRange.setMap(rMap);
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

function rHospital() {
    searchType = "Hospital";
    rDetect();
}

function rStore() {
    searchType = "Store";
    rDetect();
}

function rHostel() {
    searchType = "Hostel";
    rDetect();
}

function rFind() {

}

function rPick() {

}

function rClaim() {

}

function rEnter() {
    enterAddress();
}