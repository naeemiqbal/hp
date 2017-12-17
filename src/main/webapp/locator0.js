"use strict";
class Point {
    constructor(lat, lng) {
        this.lat = lat; //y
        this.lng = lng; //x
    }
}

class Location {
    constructor(name, a, b, c, d, img) {
        this.name = name;
        this.pointA = a;
        this.pointB = b;
        this.pointC = c;
        this.pointD = d;
        this.image = img;
    }
}


var
/*Point2 = {
 lat : 0,
 lng : 0
 },
 Location = {
 pointA : Object.create(Point2),
 pointB : Object.create(Point2),
 pointC : Object.create(Point2),
 pointD : Object.create(Point2),
 image : ""
 },*/
    lat, lng,
    options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    },
    myLocs = []; //of location

myLocs.push(new Location("test", new Point(0, 0), new Point(0, 1), new Point(2, 1), new Point(2, 0), "Home2.png"));
myLocs.push(new Location("test2", new Point(0, 0), new Point(0.5, 0.866), new Point(2.233, -0.117), new Point(1.732, -1), "Home2.png")); // Test point 1.366, .366, equivalent to 1,1
myLocs.push(new Location("test45", new Point(0, 0), new Point(0.707, 0.707), new Point(1.414, 0), new Point(0.707, -0.707), "Home2.png"));
myLocs.push(new Location("home", new Point(34.880748, -82.386814), new Point(34.880826, -82.386722), new Point(34.880937, -82.386865), new Point(34.880869, -82.386964), "Home2.png"));
myLocs.push(new Location("masjid", new Point(34.898193, -82.341071), new Point(34.898425, -82.340837), new Point(34.898527, -82.34099), new Point(34.898308, -82.34121), "Masjid.png"));

function init(pLocation) {
    var loc = myLocs[0];
    if (!pLocation)
        pLocation = getQueryParameter("location");
    if (!pLocation)
        pLocation = "home";
    pLocation.toLowerCase();
    myLocs.forEach(function(pItem, i) {
        if (pItem.name.toLowerCase() === pLocation)
            loc = pItem;
    });
    document.getElementById("ay").value = loc.pointA.lat;
    document.getElementById("ax").value = loc.pointA.lng;
    document.getElementById("by").value = loc.pointB.lat;
    document.getElementById("bx").value = loc.pointB.lng;
    document.getElementById("cy").value = loc.pointC.lat;
    document.getElementById("cx").value = loc.pointC.lng;
    document.getElementById("dy").value = loc.pointD.lat;
    document.getElementById("dx").value = loc.pointD.lng;
    document.getElementById("map_wrapper").innerHtml = "<img src=" + loc.image + "/>";
    var img = $('img');
    img.attr("src", loc.image);
    document.getElementById("iw").value = img[0].naturalWidth;
    document.getElementById("ih").value = img[0].naturalHeight;
    getLocation();
}


/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error, options);
        navigator.geolocation.watchPosition(showPosition, error, options);
    } else {
        document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    document.getElementById("currposx").value = lat;
    document.getElementById("currposy").value = lng;
    putImagePoint('realtime');
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

function distance(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Distance in meters
    return d;
}

function getDistance() {
    var ax = parseFloat(document.getElementById("ax").value),
        ay = parseFloat(document.getElementById("ay").value),
        bx = parseFloat(document.getElementById("bx").value),
        by = parseFloat(document.getElementById("by").value),
        cx = parseFloat(document.getElementById("cx").value),
        cy = parseFloat(document.getElementById("cy").value),
        dx = parseFloat(document.getElementById("dx").value),
        dy = parseFloat(document.getElementById("dy").value),
        ab, ad, cd, bc, xab, yab, angl, angl3;
    ab = distance(ax, ay, bx, by);
    xab = distance(ax, ay, bx, ay);
    yab = distance(ax, ay, ax, by);
    //                Angle	Cos^1 (ax-bx)/a-b

    angl = Math.acos(xab / ab);
    //H35/(PI()*2)*360
    angl3 = Math.round((180 * angl) / (Math.PI));
    document.getElementById("ab").value = ab;
    document.getElementById("abf").value = ab * 3.28084;
    ad = distance(ax, ay, dx, dy);
    document.getElementById("ad").value = ad;
    document.getElementById("adf").value = ad * 3.28084;
    bc = distance(bx, by, cx, cy);
    document.getElementById("bc").value = bc;
    document.getElementById("bcf").value = bc * 3.28084;
    cd = distance(dx, dy, cx, cy);
    document.getElementById("cd").value = cd;
    document.getElementById("cdf").value = cd * 3.28084;
    document.getElementById("xangle").value = angl;
    document.getElementById("xangled").value = angl3;
}

function putImagePoint(point) {
    var ax = parseFloat(document.getElementById("ax").value),
        ay = parseFloat(document.getElementById("ay").value),
        bx = parseFloat(document.getElementById("posx").value),
        by = parseFloat(document.getElementById("posy").value),
        ab, xab, angl, angl3, newangl, rotx, roty, iposx, iposy,
        map = $('#map_wrapper'),
        img = $('img'),
        point,
        iw = img.width(),
        ih = img.height();
    if (document.getElementById("ab").value === "") {
        getDistance();
        putImagePoint(point);
        return;
    }

    ab = distance(ax, ay, bx, by);
    xab = distance(ax, ay, bx, ay);
    //                Angle	Cos^1 (ax-bx)/a-b
    if (ab === 0)
        angl = 0; //PI()/2;
    else
        angl = Math.acos(xab / ab);
    //H35/(PI()*2)*360
    angl3 = (180 * angl) / (Math.PI);
    newangl = angl - document.getElementById("xangle").value;
    rotx = ab * Math.cos(newangl);
    roty = ab * Math.sin(newangl);
    document.getElementById("imga").value = angl;
    document.getElementById("imgad").value = angl3;
    document.getElementById("nimga").value = newangl;
    document.getElementById("nimgad").value = newangl * 180 / Math.PI;
    document.getElementById("nposx").value = rotx;
    document.getElementById("nposy").value = roty;
    iposx =  Math.round(rotx / document.getElementById("ab").value * iw);
    iposy = Math.round((roty / document.getElementById("ad").value * ih));
    document.getElementById("iposx").value = iposx;
    document.getElementById("iposy").value = iposy;
    iposy = ih - iposy; // Image 0 on top
    if (point && point === 'realtime') {
        point = $('<div class="realtime-point"></div>');
        $('.realtime-point').remove();
        point.css({
            left: iposx + "px",
            top: iposy + "px"
        });
        point.appendTo(map);
    } else {
        point = $('<div class="map-point"></div>');
        $('.map-point').remove();
        point.css({
            left: iposx + "px",
            top: iposy + "px"
        });
        /*                point.fadeOut(500);
         //    point.fadeIn(500);*/
        point.appendTo(map);
    }
}

function recordLocation(p1) {
    getLocation();
    document.getElementById(p1 + "y").value = lat;
    document.getElementById(p1 + "x").value = lng;
}

function getQueryParameter(parameterName) {
    var queryString = window.top.location.search.substring(1),
        begin, end;
    var parameterName = parameterName + "=";
    if (queryString.length > 0) {
        begin = queryString.indexOf(parameterName);
        if (begin !== -1) {
            begin += parameterName.length;
            end = queryString.indexOf("&", begin);
            if (end === -1) {
                end = queryString.length;
            }
            return unescape(queryString.substring(begin, end));
        }
    }
    return "null";
}