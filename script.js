var map = L.mapbox.map('map', 'chinaenvforum.map-cvdwgvbn', {
    minZoom: 4,
    maxZoom: 8,
    maxBounds: [[10,60],    //[[min-y, min-x],
              [46.5,130]]   //[max-y, max-x]],
    //zoomControl: false,
    //attributionControl: false
})
    .setView([30.0, 98.0], 6);

map.addControl(L.mapbox.shareControl());

// Custom position zoom widget
//map.zoomControl.setPosition('topright');


// Add layer tiles and utf-grids

// mapTileLayers = {
//     dams_en: L.mapbox.tileLayer('chinaenvforum.china_watershed_dams', {zIndex: 999} ),
//     dams_cn: L.mapbox.tileLayer('chinaenvforum.china_watershed_dams', {zIndex: 999} ),
//     dams_minor: L.mapbox.tileLayer('chinaenvforum.china_watershed_dams_minor', {zIndex: 998} ),
//     labels_en: L.mapbox.tileLayer('chinaenvforum.watershed_labels', {zIndex: 997} ),
//     labels_cn: L.mapbox.tileLayer('chinaenvforum.watershed_labels_cn', {zIndex: 997} )
// };

// mapGridLayers ={
//     dams_en: L.mapbox.gridLayer('chinaenvforum.china_watershed_dams'),
//     dams_cn: L.mapbox.gridLayer('chinaenvforum.china_watershed_dams')
// };

// mapGridControls = {
//     dams_en: L.mapbox.gridControl(mapGridLayers.dams_en),
//     dams_cn: L.mapbox.gridControl(mapGridLayers.dams_cn)
// };

// map.addLayer(mapTileLayers.dams_en);
// map.addLayer(mapTileLayers.dams_minor);
// map.addLayer(mapTileLayers.labels_en);

// map.addLayer(mapGridLayers.dams_en);
// map.addControl(mapGridControls.dams_en);

var currentLanguage = 'en';

var englishLayers = {
    dams: L.mapbox.tileLayer('chinaenvforum.china_watershed_dams', {zIndex: 999} ),
    labels: L.mapbox.tileLayer('chinaenvforum.watershed_labels', {zIndex: 997} ),
    dams_grid: L.mapbox.gridLayer('chinaenvforum.china_watershed_dams')
};
englishLayers.dams_gridControl = L.mapbox.gridControl(englishLayers.dams_grid);

var chineseLayers = {
    dams: L.mapbox.tileLayer('chinaenvforum.china_watershed_dams', {zIndex: 999} ),
    labels: L.mapbox.tileLayer('chinaenvforum.watershed_labels_cn', {zIndex: 997} ),
    dams_grid: L.mapbox.gridLayer('chinaenvforum.china_watershed_dams')
};
chineseLayers.dams_gridControl = L.mapbox.gridControl(chineseLayers.dams_grid);



map.addLayer(englishLayers.dams);
map.addLayer(L.mapbox.tileLayer('chinaenvforum.china_watershed_dams_minor', {zIndex: 998} ));
map.addLayer(englishLayers.labels);

map.addLayer(englishLayers.dams_grid);

map.addControl(englishLayers.dams_gridControl);
map.addControl(chineseLayers.dams_gridControl);


// Add custom legend
var mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(
    document.getElementById('legend-content').innerHTML);
map.addControl(mapLegend);


// Layer Handler Functions
function addCheckboxButton(mapId, elementClass) {
    var layer = L.mapbox.tileLayer(mapId);

    $('.' + elementClass).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("clicked " + $(this));

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            $(this).removeClass('active');
        } else {
            map.addLayer(layer, {zIndex: 997} );
            $(this).addClass('active');
        }
    });
}

function navigate(elementClass, latlonzoom) {
    $('.' + elementClass).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var location = latlonzoom.split(',');
        var latLon = [location[0],location[1]];
        var zoom = location[2];
        map.setView(latLon, zoom);

        $(this).parent('li').siblings('li').children('a.active').removeClass('active');
        $(this).addClass('active');
    });
}


//language toggle
$('.lang-change').on('click', 'a', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if($(this).data('lang') == 'en' && currentLanguage != 'en'){
        currentLanguage = 'en';
        console.log("view englishLayers");

        map.removeLayer(chineseLayers.labels);
        map.removeLayer(chineseLayers.dams_grid);

        map.addLayer(englishLayers.labels);
        map.addLayer(englishLayers.dams_grid);
    }else if($(this).data('lang') == 'cn' && currentLanguage != 'cn'){
        currentLanguage = 'cn';
        console.log("view chineseLayers");

        map.removeLayer(englishLayers.labels);
        map.removeLayer(englishLayers.dams_grid);

        map.addLayer(chineseLayers.labels);
        map.addLayer(chineseLayers.dams_grid);
    }else{
        console.log("nope");
    }
});



addCheckboxButton('chinaenvforum.china_biodiversity', 'bio');
//navigate('bio', '30,98,5');
