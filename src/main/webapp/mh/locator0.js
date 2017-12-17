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

class LocationBasics{
    constructor(height, width, rotation, imgH, imgW){
        this.height = height;
        this.width = width;
        this.rotation = rotation;
        this.imageH = imgH;
        this.imageW = imgW;        
    }
}

var lat, lng,
    options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    },
    myLocs = [], // array of location
    loc,  //selected location
    locBasics;

myLocs.push(new Location("test", new Point(0, 0), new Point(0, 1), new Point(2, 1), new Point(2, 0), "Home2.png"));
myLocs.push(new Location("test2", new Point(0, 0), new Point(0.5, 0.866), new Point(2.233, -0.117), new Point(1.732, -1), "Home2.png")); // Test point 1.366, .366, equivalent to 1,1
myLocs.push(new Location("test45", new Point(0, 0), new Point(0.707, 0.707), new Point(1.414, 0), new Point(0.707, -0.707), "Home2.png"));
myLocs.push(new Location("home", new Point(34.880748, -82.386814), new Point(34.880826, -82.386722), new Point(34.880937, -82.386865), new Point(34.880869, -82.386964), "Home2.png"));
myLocs.push(new Location("makkah", new Point(21.419870, 39.820454), new Point(21.420216, 39.829445), new Point(21.429524, 39.828780), new Point(21.428366, 39.819982), "Makkahgps.jpg"));
myLocs.push(new Location("madinah", new Point(24.465410, 39.607118), new Point(24.465492, 39.614615), new Point(24.471262, 39.614655), new Point(24.471184, 39.607139), "Madinah4.png"));
function init(pLocation) {
    var debug = getQueryParameter("debug");
    if (debug  && debug===1)
        $("#debugdata").style.display = 'block';
    
    if (!pLocation)
        pLocation = getQueryParameter("location");
    if (!pLocation || pLocation === null)
        pLocation = "home";
    pLocation.toLowerCase();
    myLocs.forEach(function(pItem, i) {
        if (pItem.name.toLowerCase() === pLocation)
            loc = pItem;
    });
    document.getElementById("map_wrapper").innerHtml = "<img src=" + loc.image + "/>";
    var img = $('img');
    img.attr("src", loc.image);
    locBasics = new LocationBasics();
    getDistance();
    getLocation();
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
    putImagePoint('realtime');
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
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

//function getAngle(lon1, lat1, lon2, lat2) {
function getAngle(ax, ay, bx, by) {    
    var ab = distance(ax, ay, bx, by),
        xab = distance(ax, ay, bx, ay),
        yab = distance(ax, ay, ax, by),
        angl;
        
    if (ab === 0)
        angl = 0; //PI()/2;
    else
        angl = Math.acos(xab / ab);
    
    if ( bx < ax && by>ay )
        angl = (Math.PI ) - angl; 
    else if ( bx <= ax && by <= ay )
        angl = (Math.PI) + angl; 
    else if ( bx >= ax && by < ay)
            angl += Math.PI * 3/2; // Add 270 or subtract 90      
    return { 'angle' : angl,
             //'angle360' : function() { return Math.round((180 * this.angl) / Math.PI)},
             'angle360' : Math.round((180 * angl) / Math.PI),                          
             'ab' : ab,
             'xab' : xab};             
}

function convertTo360(angl){
    return Math.round((180 * angl) / Math.PI);                          
}
function rotate(angle){
    return { 'x' : Math.cos(angle.angle) * angle.ab,
             'y' : Math.sin(angle.angle) * angle.ab };
}

function getDistance() {
    var angl, ad, x;

    angl = getAngle(loc.pointA.lng, loc.pointA.lat, loc.pointB.lng, loc.pointB.lat);
    ad = distance(loc.pointA.lng, loc.pointA.lat, loc.pointD.lng, loc.pointD.lat);
//    x = getAngle(loc.pointA.lng, loc.pointA.lat, loc.pointD.lng, loc.pointD.lat);
    locBasics.height = ad;
    locBasics.width = angl.ab;
    locBasics.rotation = angl.angle;    
}

function putImagePoint(point) {
    var bx = lng,
        by  = lat,
        ab, xab, angl, angl3, newangl, rot, iposx, iposy,
        map = $('#map_wrapper'),
        img = $('img'),
        point,
        iw = img.width(),
        ih = img.height();
     bx = lng;
     by  = lat;
  
    angl = getAngle(loc.pointA.lng, loc.pointA.lat, bx, by);
    newangl = Object.assign({}, angl);
    newangl.angle =  angl.angle - locBasics.rotation;
    newangl.angle360 =  convertTo360(newangl.angle);
    rot = rotate(newangl);

    iposx =  Math.round(rot.x / locBasics.width * iw);
    iposy = Math.round((rot.y / locBasics.height * ih));
    iposy = ih - iposy; // Image 0 on top
//    if (point && point === 'realtime') {
        point = $('<div class="realtime-point"></div>');
        $('.realtime-point').remove();
        point.css({
            left: iposx + "px",
            top: iposy + "px"
        });
        point.appendTo(map);
  /*  } else {
        point = $('<div class="map-point"></div>');
        $('.map-point').remove();
        point.css({
            left: iposx + "px",
            top: iposy + "px"
        });
        point.appendTo(map);
    }*/
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
    return ;
}