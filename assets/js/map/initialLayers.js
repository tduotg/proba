global.map;

$(function () {
    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    })

    var projection4326 = new ol.proj.Projection({
        code: 'EPSG:4326',
        units: 'm'
    });
    var projection3857 = new ol.proj.Projection({
        code: 'EPSG:3857',
        units: 'm'
    });

    var projection900913 = new ol.proj.Projection({
        code: 'EPSG:900913',
    });

    //Межа сільської ради
    var vectorSRSidebarWms = new ol.source.TileWMS({
        url: '/gwc',
        params: {
            'LAYERS': 'zp:boundary_srada',
            'ALIAS': 'Сільська рада',
            'ALIAS_E': 'Village council',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 768,
            'HEIGHT': 500,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection4326,
        }
    });

    var vectorSRSidebar = new ol.layer.Tile({
        source: vectorSRSidebarWms,
        visible: 0,
        name: 'vectorSRSidebar',
        isBaseLayer: false,
    });

    //Межа громади
    var vectorGromSidebarWms = new ol.source.TileWMS({
        url: '/gwc',
        params: {
            'LAYERS': 'zp:boundary_gromada',
            'ALIAS': 'Громада',
            'ALIAS_E': 'Communities',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 768,
            'HEIGHT': 500,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection4326,
        }
    });

    var vectorGromSidebar = new ol.layer.Tile({
        source: vectorGromSidebarWms,
        visible: 1,
        name: 'vectorGromSidebar',
        isBaseLayer: false,
    });

    //Межа ділянок по громаді
    var vectorPlotsSidebarWms = new ol.source.TileWMS({
        url: '/zp',
        params: {
            'LAYERS': 'zp:parcel',
            'ALIAS': 'Земельні ділянки',
            'ALIAS_E': 'Plots',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 689,
            'HEIGHT': 768,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection3857,
        }
    });

    var vectorPlotsSidebar = new ol.layer.Tile({
        source: vectorPlotsSidebarWms,
        visible: 1,
        name: 'vectorPlotsSidebar',
        isBaseLayer: false,
    });

   /* //Межі агровиробничих груп грунтів
    var vectorSoilsSidebarWms = new ol.source.TileWMS({
        url: '/zp',
        params: {
            'LAYERS': 'zp:grunt',
            'ALIAS': 'Агровиробничі групи грунтів',
            'ALIAS_E': 'Soils',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 683,
            'HEIGHT': 768,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection3857,
        }
    });

    var vectorSoilsSidebar = new ol.layer.Tile({
        source: vectorSoilsSidebarWms,
        visible: 0,
        name: 'vectorSoilsSidebar',
        isBaseLayer: false,
    });*/

  /*  //Межі сільськогоспожарських районів
    var vectorSgrayonSidebarWms = new ol.source.ImageWMS({
        url: '/zp',
        params: {
            'LAYERS': 'zp:sg_rayon',
            'ALIAS': 'Сільськогосподарські райони',
            'ALIAS_E': 'Agricultural Areas',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 768,
            'HEIGHT': 555,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection3857,
        }
    });

    var vectorSgrayonSidebar = new ol.layer.Image({
        source: vectorSgrayonSidebarWms,
        visible: 0,
        name: 'vectorSgrayonSidebar',
        isBaseLayer: false,
    });*/

    //OSM
    var osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
        name: 'osm',
        visible: 0,
        isBaseLayer: true,
    });

    //Земельні ділянки
    var parcelSidebarWms = new ol.source.TileWMS({
        url: 'http://212.26.144.110/geowebcache/service/wms',
        params: {
            'LAYERS': 'kadastr',
            'ALIAS': 'Кадастровий поділ',
            'ALIAS_E': 'Cadastral Division',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png',
            'WIDTH': 256,
            'HEIGHT': 256,
            'CRS': 'EPSG:900913',
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection3857,
        }
    });

    var parcelSidebar = new ol.layer.Tile({
        source: parcelSidebarWms,
        visible: 0,
        name: 'parcelSidebar'
    });

    //Оглядова карта
    var pubLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: '/96map/dzk_overview/{z}/{x}/{-y}.png',
            crossOrigin: 'null',
        }),
        name: 'pub',
        visible: 1,
        isBaseLayer: true,
    });

    //Орто 10000 в базових шарах
    var kiev2006Layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: '/96map/ortho10k_all/{z}/{x}/{-y}.jpg',
            crossOrigin: 'null'
        }),
        name: 'kiev2006',
        visible: 0,
        isBaseLayer: true,
    });

    //Топографічна карта Ураїни м. 1:10000
    var topoUA = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://map.land.gov.ua/map/topo100k_all/{z}/{x}/{-y}.jpg',
            crossOrigin: 'null'
        }),
        name: 'topoUA',
        visible: 0,
        isBaseLayer: true,
    });

    //Порожній шар рельєфу
    var emptyRelief = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: '/96map/relief/{z}/{x}/{y}.png',
            crossOrigin: 'null',
        }),
        name: 'emptyRelief',
        visible: 0,
        isBaseLayer: true,
    });

    //Порожній шар
    var emptyLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://192.168.33.96/files/404-tile707.png',
            crossOrigin: 'null',
        }),
        name: 'emptyLayer',
        visible: 0,
        isBaseLayer: true,
    });

   /* //Ортофотоплани по громадам
    var rastrPhotoGromSidebar = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: '/96map/zp/ortho/{z}/{x}/{-y}.png',
            crossOrigin: 'null',
        }),
        name: 'rastrPhotoGromSidebar',
        visible: 0,
        params: {
            alias: 'Ортофотоплан'
        },
        isBaseLayer: false,
    });*/

  /*  //Економіко-планувальні зони
    var rastrEpzoneGromSidebar = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: '/96map/zp/epzone/{z}/{x}/{-y}.png',
            crossOrigin: 'null',
        }),
        name: 'rastrEpzoneGromSidebar',
        visible: 0,
        params: {
            alias: 'Економіко-планувальні зони'
        },
        isBaseLayer: false,
    });*/


    //OSM
    var cycleLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=b29e6bf28b894c94958bfd507072f4c8',
            crossOrigin: 'null',
        }),
        name: 'OpenCycleMap',
        visible: 0,
        isBaseLayer: true,
    });

    //Google Map
    var googleLayer = new olgm.layer.Google({name: 'google', visible: 0, mapTypeId: google.maps.MapTypeId.SATELLITE});
    var googleHybridLayer = new olgm.layer.Google({
        name: 'googlehybrid',
        visible: 0,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    var vectorCitiesSidebarWms = new ol.source.TileWMS({
        url: '/zp',
        params: {
            'LAYERS': 'zp:boundary_town',
            'ALIAS': 'Мiста',
            'ALIAS_E': 'Cities',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 768,
            'HEIGHT': 500,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection4326,
        }
    });

    var vectorCitiesSidebar = new ol.layer.Tile({
        source: vectorCitiesSidebarWms,
        visible: 0,
        name: 'vectorCitiesSidebar',
        isBaseLayer: false,
    });

    var visibleSgPlots = false;

    if ($('#vectorSgPlotsSidebar').length > 0){
        visibleSgPlots = true;
    }
    var vectorSgPlotsSidebarWms = new ol.source.TileWMS({
        url: '/zp',
        params: {
            'LAYERS': 'zp:zp_polygon',
            'ALIAS': 'СГ',
            'ALIAS_E': 'SG',
            'VERSION': '1.1.1',
            'TILED': 'true',
            'FORMAT': 'image/png8',
            'WIDTH': 768,
            'HEIGHT': 379,
            serverType: 'geoserver',
            crossOrigin: '',
            projection: projection4326,
        }
    });

    var vectorSgPlotsSidebar = new ol.layer.Tile({
        source: vectorSgPlotsSidebarWms,
        visible: visibleSgPlots,
        name: 'vectorSgPlotsSidebar',
        isBaseLayer: false,
    });
    
    map = new ol.Map({
        target: "mapView",
        layers: [
            topoUA,
            googleLayer,
            googleHybridLayer,
            osmLayer,
            emptyRelief,
            cycleLayer,
            pubLayer,
            kiev2006Layer,
            //rastrPhotoGromSidebar,
            //rastrEpzoneGromSidebar,
           // vectorSgrayonSidebar,
            vectorPlotsSidebar,
            //vectorSoilsSidebar,
            vectorGromSidebar,
            vectorSRSidebar,
            vectorCitiesSidebar,
            emptyLayer,
            parcelSidebar,
            vectorSgPlotsSidebar
        ],
        controls: ol.control.defaults().extend([
            new ol.control.ScaleLine({
                className: 'ol-scale-line',
                target: document.getElementById('scale-line')
            })
        ]),
    });

    var view = new ol.View({
        center: [2740649.6491649942, 6677538.790992998],
        zoom: 12,
        minZoom: 2
    });

    var overview = new ol.control.OverviewMap({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        label: '«',
        collapseLabel: '»',
    });

    map.addControl(overview);
    map.setView(view);
    map.addOverlay(popup);

    var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
    olGM.activate();
    //Додати координати центра карти//
    var center = map.getView().getCenter();

    var coord = ol.proj.transform([center[0], center[1]], 'EPSG:900913', 'EPSG:4326');
    $('.x').text(coord[0].toFixed(4));
    $('.y').text(coord[1].toFixed(4));

    map.on('pointerdrag', function (evt) {
        center = map.getView().getCenter();
        coord = ol.proj.transform([center[0], center[1]], 'EPSG:900913', 'EPSG:4326');
        $('.x').text(coord[0].toFixed(4));
        $('.y').text(coord[1].toFixed(4));
    });

    map.on('moveend', function (evt) {
        center = map.getView().getCenter();
        coord = ol.proj.transform([center[0], center[1]], 'EPSG:900913', 'EPSG:4326');
        $('.x').text(coord[0].toFixed(4));
        $('.y').text(coord[1].toFixed(4));
    });
    //end--Додати координати центра карти//
    $('#mapView').data('map', map);
})