var currentLanguage = 'en';

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


// build english and chinese tile layers, grid layers, and grid controls
var englishLayers = {
    labels: L.mapbox.tileLayer('chinaenvforum.watershed_labels', {zIndex: 997} ),
    dams_grid: L.mapbox.gridLayer('chinaenvforum.china_watershed_dams_en')
};

var chineseLayers = {
    labels: L.mapbox.tileLayer('chinaenvforum.watershed_labels_cn', {zIndex: 997} ),
    dams_grid: L.mapbox.gridLayer('chinaenvforum.china_watershed_dams_cn')
};
englishLayers.dams_gridControl = L.mapbox.gridControl(englishLayers.dams_grid);
chineseLayers.dams_gridControl = L.mapbox.gridControl(chineseLayers.dams_grid);


// add dams layer
map.addLayer(L.mapbox.tileLayer('chinaenvforum.h4g98a18', {zIndex: 999} ));

// add english labels layer
map.addLayer(englishLayers.labels);

// add english tooltip grid layer and control
map.addLayer(englishLayers.dams_grid);
map.addControl(englishLayers.dams_gridControl);


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

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            $(this).removeClass('active');
            $('.map-legend .shadow').show();
        } else {
            map.addLayer(layer, {zIndex: 997} );
            $(this).addClass('active');
            $('.map-legend .shadow').hide();
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

        $(this).addClass('active').siblings('.active').removeClass('active');

        map.removeLayer(chineseLayers.labels);
        map.removeLayer(chineseLayers.dams_grid);
        map.removeControl(chineseLayers.dams_gridControl);

        $('.cn-text').hide();
        $('.en-text').show();

        map.addLayer(englishLayers.labels);
        map.addLayer(englishLayers.dams_grid);
        map.addControl(englishLayers.dams_gridControl);
    }else if($(this).data('lang') == 'cn' && currentLanguage != 'cn'){
        currentLanguage = 'cn';
        console.log("view chineseLayers");

        $(this).addClass('active').siblings('.active').removeClass('active');

        map.removeLayer(englishLayers.labels);
        map.removeLayer(englishLayers.dams_grid);
        map.removeControl(englishLayers.dams_gridControl);

        $('.en-text').hide();
        $('.cn-text').show();

        map.addLayer(chineseLayers.labels);
        map.addLayer(chineseLayers.dams_grid);
        map.addControl(chineseLayers.dams_gridControl);
    }else{
        console.log("nope");
    }
});



addCheckboxButton('chinaenvforum.china_biodiversity', 'bio');
//navigate('bio', '30,98,5');
