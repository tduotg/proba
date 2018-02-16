/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    $('#sidebar_search_input').typeahead({
        source: function (query, process) {
            return $.get(Routing.generate('gromada_autocomplete_elastic'), {input: query}, function (out) {
                return process(out.data);
            });
        },
        hint: true,
        highlight: true,
        minLength: 1,
        name: 'gromada'
    });

    $('.sidebar_clear_block_button').click(function () {
        $('#sidebar_search_input').val('');
        var map = $('#mapView').data('map');
        if (draw !== undefined) {
            map.removeInteraction(draw);
        }
    });

    var draw;
    //We call an event when is pressed "Enter" the button "Search"
    $('.sidebar_search_block_button').on('click', function () {
        zoomToGromada();
    });
    $('#sidebar_search_input').change(function () {
       zoomToGromada();
    });

    function zoomToGromada() {
        var current = $('#sidebar_search_input').typeahead("getActive");
        if($('input.typeahead').val() == current.name) {
            $.ajax({
                type: "POST",
                url: Routing.generate('gromada_search'),
                data: {input: current},
                timeout: 3000,
                success: function (response) {
                    if (response.success) {
                        var map = $('#mapView').data('map');
                        if (draw !== undefined) {
                            map.removeInteraction(draw);
                        }
                        var geom = new ol.format.WKT().readGeometry(response.geom.substring(10));
                        var tgeom = geom.transform('EPSG:4326', 'EPSG:900913');

                        var searchFeature = new ol.Feature({
                            geometry: tgeom
                        });

                        var style = new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.4)',
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 5
                            }),
                            image: new ol.style.Circle({
                                radius: 7,
                                fill: new ol.style.Fill({
                                    color: '#ffcc33'
                                })
                            })
                        });

                        var searchSource = new ol.source.Vector();
                        draw = new ol.interaction.Draw({
                            source: searchSource,
                            type: 'polygon',
                            style: style
                        });
                        draw.extend(searchFeature);
                        map.addInteraction(draw);
                        map.getView().fit(tgeom.getExtent(), map.getSize());
                    }
                }
            });
        }
    }
});