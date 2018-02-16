$(function () {
    function clearDraw() {
        var map = $('#mapView').data('map');
        map.getLayers().forEach(function (l) {
            if (l.get('name') === 'drawLayer') {
                l.getSource().clear();
                map.removeLayer(l);
            }
        });
        map.getInteractions().forEach(function (interaction) {
            if (
                (interaction instanceof ol.interaction.Draw) ||
                (interaction instanceof ol.interaction.Snap) ||
                (interaction instanceof ol.interaction.Modify)
            ) {
                map.removeInteraction(interaction);
            }
        });

        $('#updfooter').removeClass('updfooter-open');
        $('#remsgfooter').removeClass('remsgfooter-open');
    }

    function addSgPloygon() {
        var map = $('#mapView').data('map');
        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.4)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,255,0,0.5)',
                width: 9
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
        var drawSource = new ol.source.Vector();
        var drawLayer = new ol.layer.Vector({
            source: drawSource,
            style: style,
            name: 'drawLayer',
//                        features: myCollection,
        });
        map.addLayer(drawLayer);
        var drawSgPolygon = new ol.interaction.Draw({
            source: drawSource,
            type: 'Polygon',
            style: style
        });
        map.addInteraction(drawSgPolygon);
        drawSgPolygon.on('drawend',
            function (evt) {
                $.ajax({
                    url: Routing.generate('sg_polygon_new'),
                    type: 'POST',
                    data: {geom: new ol.format.WKT().writeGeometry(evt.feature.getGeometry())},
                    error: function (jqXHR, textStatus, errorThrown) {
                        bootbox.alert(jqXHR.responseJSON.error);
                    },
                    success: function (response) {
                        var polygon = evt.feature.getGeometry();
                        var area = calacArea(polygon);
                        area = (area / 10000).toFixed(4) + ' га';
                        $('#updfooter').after(response.data);
                        $('#caption_area').text(area);
                        if (!($('#updfooter').hasClass('updfooter-open'))) {
                            $('#updfooter').addClass('updfooter-open');
                        }
                    }
                })
                ;
            },
            this);
        drawSgPolygon.on('drawstart',
            function (evt) {
                var map = $('#mapView').data('map');
                $('#updfooter').removeClass('updfooter-open');
                map.getLayers().forEach(function (l) {
                    if (l.get('name') === 'drawLayer') {
                        l.getSource().clear();
                    }
                });
            });
    }

// (function ($) {
// редирект неавторизованного пользователя
    $(document).ajaxError(function (event, jqXHR) {
        if (403 === jqXHR.status) {
            bootbox.alert('Полігон повинен знаходитись в межах громади!')
        }
    });


    $('#mbrush').on('click', function (e) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            clearDraw();
        } else {
            $(this).addClass('active');
            addSgPloygon();
        }
    });
    $('#updclose').click(function (e) {
        clearDraw();
        addSgPloygon();
    });
    $('#rmsgplotclose').click(function (e) {
        clearDraw();
    });
    $('body').on('submit', '#newsgpolygon', function (e) {
        e.preventDefault();
        $.ajax({
            url: Routing.generate('sg_polygon_create'),
            method: 'POST',
            async: false,
            data: $(this).serialize(),
            success: function (data) {
                $('.modal').modal('hide');
                var map = $('#mapView').data('map');
                map.getLayers().forEach(function (l) {
                    if (l.get('name') === 'vectorSgPlotsSidebar') {
                        l.getSource().updateParams({visible: 1, time: Date.now()});
                    }
                });
                clearDraw();
                addSgPloygon();
            }
        });
    });
    $('#errorclose').click(function () {
        clearDraw();
        $('#mbrush').removeClass('active');
    });

    function calacArea(polygon) {
        var wgs84Sphere = new ol.Sphere(6378137);
        var sourceProj = map.getView().getProjection();
        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
            sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        var area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        return area;
    }

    $('#remsgclose').click(function (e) {
        clearDraw();
    });

    $('body').on('click', '#remsgid', function () {
        $.ajax({
            url: Routing.generate('sg_polygon_remove'),
            method: 'POST',
            data: {input: $(this).val()},
            success: function () {
                $('.modal').modal('hide');
                var map = $('#mapView').data('map');
                map.getLayers().forEach(function (l) {
                    if (l.get('name') === 'vectorSgPlotsSidebar') {
                        l.getSource().updateParams({visible: 1, time: Date.now()});
                    }
                });
                clearDraw();
            }
        });
    });
});