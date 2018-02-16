var coordinate;
var marker;
var searchMarker;
var activeLayers = ['parcelSidebar', 'rastrPhotoGromSidebar', 'rastrEpzoneGromSidebar', 'parcelSidebar', 'vectorSgrayonSidebar', 'vectorSoilsSidebar', 'vectorPlotsSidebar', 'vectorGromSidebar', 'vectorSgPlotsSidebar', 'vectorSRSidebar', 'vectorCitiesSidebar', 'wms3', 'orto10000sidebar', 'dynamicSidebar'];

//Перемикаємо базові шари
function toggleOL(layer, elem) {
    map.getLayers().forEach(function (l, i) {
        if (($.inArray(l.get('name'), activeLayers)) > -1) {
            if (l.get('name') === layer) {
                if (l.getVisible() == true && !elem.hasClass('active')) {
                    l.setVisible(false);
                    $(elem).removeClass('on_layer');
                } else {
                    l.setVisible(true);
                }
            }
        }
    });
}

//Перемикаємо шари в сайдбарі
function layersOff() {

    $('.mdl-navigation__level3').click(function () {
        if ($(this).hasClass('active')) {
            $(this).closest('.mdl-navigation__level2').prev().find('.layersOff').show().children('label').addClass('is-checked');
        } else {
            var isActive = false;
            $(this).closest('.mdl-navigation__level2').find('a.mdl-navigation__link').each(function () {
                if ($(this).hasClass('active')) {
                    isActive = true;

                    return false;
                }
            });
            if (isActive == false) {
                $(this).closest('.mdl-navigation__level2').prev().find('.layersOff').hide().removeClass('is-checked');
            }
        }
    });

    $('.layersOff').on('mousedown', function (event) {
        var layersName = [];
        $(this).parents('.mdl-navigation__level1').next().find('a.mdl-navigation__link').each(function () {
            $(this).next('form').slideUp(500);
            $(this).removeClass('active');
            $(this).children('.ui-slider').hide();
            $(this).children('.legend-button').hide();
            if ($(this).children('.legend-button').hasClass('active')) {
                $('.legend-button').removeClass('active')
                $('.new_legend').hide();
            }
            layersName.push($(this).attr('href').substring(1));
        });

        if ($(this).parents('.mdl-navigation__level1').next('.mdl-navigation__level2').css('display') == 'none') {
            $(this).parents('.mdl-navigation__level1').removeClass('active');
        }

        if (layersName.length > 0) {
            map.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined) {
                    if ((layersName.indexOf(layer.get('name'))) != -1) {
                        layer.setVisible(false);
                    }
                }
            });
        }

        $('#slider_wms3').hide();
        $(this).prop('checked', false).hide();
        event.stopPropagation();
    });

    $('.mdl-navigation__level3.active').each(function () {
        var block = $(this).closest('.mdl-navigation__level2').prev();
        if (block.hasClass('active') != true) {
            block.addClass('active');

            $('.layersOff').show()
            $('.layersOffCheck').addClass('is-checked');
        }
    });
}

//Геолокація (тільки при https://)
function geolocation(map) {
    if ($('#main_tt4').hasClass('active')) {
        var view = map.getView();
        // set up the geolocation api to track our position
        var geolocation = new ol.Geolocation({
            tracking: true,
            projection: view.getProjection()
        });

        // bind the view's projection
        // when we get a position update, add the coordinate to the track's
        // geometry and recenter the view
        if (marker === undefined) {
            $('#location').show();
            marker = new ol.Overlay({
                element: document.getElementById('location'),
                positioning: 'center-center',
            });
        }
        map.addOverlay(marker);

        geolocation.on('change:position', function () {
            coordinate = geolocation.getPosition();
            view.setCenter(coordinate);
            marker.setPosition(coordinate)
        });
        view.setCenter(coordinate);
        view.setZoom(14);
    } else {
        map.removeOverlay(marker);
    }
}

//Якщо шар включений за замомвуванням, то підсвічуємо в сайдбарі
function addActiveForLayers() {
    map.getLayers().forEach(function (layer) {
        i = false;
        if (layer.getVisible() && layer.get('isBaseLayer') == false) {
            layerSidebar = document.getElementById(layer.get('name'));
            $(layerSidebar).addClass('active');
            i++;
        }
    });
}


$(function () {
    //Перемикаємо мову
    $('.language_container').click(function () {
        if ($('.language_container i').text() == "UA") {
            $('.language_container i').text("EN")
            $('.language_container .mdl-tooltip').text("English");
            window.location.replace(Routing.generate('map_index', {_locale: "en"}));
        } else {
            $('.language_container i').text("UA");
            $('.language_container .mdl-tooltip').text("Українською");
            window.location.replace(Routing.generate('map_index', {_locale: "uk"}));
        }
    });

    //Показуэмо центр карти
    $('.map-center').show();

    var windowHeight;
    var windowWidth;
    var contentHeight;

    //Перемикаємо налаштування
    $('.bid_list_button').click(function () {
        var height = $('.layersAll').height()
        if ($('.bid_list').hasClass('open')) {
            $('.layersAll').height(height - 180);
        } else {
            $('.layersAll').height(height + 180);
        }
    });

    // calculations for elements that changes size on window resize
    var windowResizeHandler = function () {
        windowHeight = $(window).height();
        windowWidth = $(window).width();
        contentHeight = windowHeight - $('header').height();
        $('#wrapper').height(contentHeight);

        $('#mapView').height(contentHeight);
        $('#wrapper').width(windowWidth);
        $('#content').height(contentHeight);
        $('#external_control').css({top: windowHeight / 2});
        var mapCenterWidth = $('.map-center').width();
        var mapCenterHeigth = $('.map-center').width();
        $('.map-center').css('left', (windowWidth - mapCenterWidth) / 2);
        $('.map-center').css('top', (windowHeight - mapCenterHeigth) / 2);

        var logoWidth = $('.head_block_logo').width();
        $('.head_block_logo').css('left', (windowWidth - logoWidth) / 2);
        var carousel_block_height = $('.carousel-block').height();
        if ($('.carousel-block').closest('.bx-wrapper').css('display') == 'none') {
            carousel_block_height = 0;
        }
        $('.layersAll').height(windowHeight - $('.bid_list').height() - $('.mdl-layout-title').height());

        var right_menu_content_block = windowHeight - $('.right_menu_footer-block').height() - $('.right_menu_title-block').height() - carousel_block_height;
        $('.right_menu_content-block').css('height', right_menu_content_block);
        $('.right_menu_content-block').closest('.bx-viewport').height(windowHeight - $('.right_menu_footer-block').height());

        if ($('.mdl-card__title').is(':visible')) {
            $('.mdl-card__supporting-text').height(windowHeight - $('.mdl-card__title').height() - $('.demo-card__title').height() - $('.mdl-card__actions').height() * 2.6);
        } else {
            $('.mdl-card__supporting-text').height(windowHeight - $('.demo-card__title').height() - $('.mdl-card__actions').height() * 2.1);
        }

        if (map) {
            map.updateSize();
        }
    }

    $(window).resize(function () {
        windowResizeHandler();
    });

    var navExpanded = true;

    $('a.mdl-navigation__link').on('click', function () {
        toggleOL($(this).attr('href').substr(1), $(this));
        if ($(this).next().find('a.mdl-navigation__link').hasClass('active') && $(this).hasClass('active') == false) {
            $(this).addClass('active');
        }
    });

    $('.navHandler, .closeLeftSide').click(function () {
        if (!navExpanded) {
            $('.logo').addClass('expanded');

            $('#leftSide').addClass('expanded');
            if (windowWidth < 768) {
                $('.closeLeftSide').show();
            }
            $('#bazlayer').addClass('expanded');
            $('#external_control').addClass('expanded');
            $('.hasSub').addClass('hasSubActive');
            $('.leftNav').addClass('bigNav');
            $('#tools').addClass('expanded');
            if (windowWidth > 767) {
                $('.full').addClass('m-full');
            }
            windowResizeHandler();
            navExpanded = true;
        } else {
            $('.logo').removeClass('expanded');
            $('#leftSide').removeClass('expanded');
            $('.closeLeftSide').hide();
            $('#bazlayer').removeClass('expanded');
            $('#external_control').removeClass('expanded');
            $('.hasSub').removeClass('hasSubActive');
            $('.bigNav').slimScroll({destroy: true});
            $('.leftNav').removeClass('bigNav');
            $('#tools').removeClass('expanded');
            $('.leftNav').css('overflow', 'visible');
            $('.full').removeClass('m-full');
            navExpanded = false;
        }
    });

    addActiveForLayers();
    layersOff();

    $('#main_tt9').on('click', function () {
        window.print();
    });

    $('.ol-overviewmap button').attr("id", "ol-overviewmap");
    $('.ol-overviewmap button').append('<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-overviewmap" >Оглядова карта</div>');
    $('.ol-zoom-in').attr("id", "ol-zoom-in");
    if ($('.language_container i').text() == "UA") {
        $('.ol-zoom-in').after('<button class="ol-zoom-all" type="button" id="ol-zoom-all" tabindex="0"><i class="material-icons">language</i></button> ' +
                '<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-zoom-all">Показати повністю</div>');
        $('.ol-zoom-in').append('<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-zoom-in" >Збільшити</div>');

        $('.ol-zoom-out').attr("id", "ol-zoom-out");
        $('.ol-zoom-out').append('<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-zoom-out" >Зменшити</div>');
    } else {
        $('.ol-zoom-in').after('<button class="ol-zoom-all" type="button" id="ol-zoom-all" tabindex="0"><i class="material-icons">language</i></button> ' +
                '<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-zoom-all">Show completely</div>');
        $('.ol-zoom-in').append('<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-zoom-in" >Enlarge</div>');
        $('.ol-zoom-out').attr("id", "ol-zoom-out");
        $('.ol-zoom-out').append('<div class="mdl-tooltip main_mdl-tooltip" data-mdl-for="ol-zoom-out" >Decrease</div>');
    }

    $('div.mapPlaceholder').remove();
    windowResizeHandler();
    addMeasure();

    $('#main_tt4').on('click', function () {
        $('#main_tt4').toggleClass('active');
        geolocation(map);
    });

    $('.ol-zoom-all').on('mousedown', function () {
        $(this).addClass('active');
    });
    $('.ol-zoom-all').on('mouseup', function () {
        $(this).removeClass('active');
    });

    $('.ol-zoom-all').on('click', function () {
        var view = new ol.View({
            center: [3506000, 6125000],
            zoom: 6
        });
        map.setView(view);
    });
    $('.zoomOff .mdl-checkbox').on('mouseup', function () {
        $('.ol-zoom').toggleClass('hide');
    });
    $('.centerOff .mdl-checkbox').on('mouseup', function () {
        $('.map-center').toggleClass('hide');
    });

    $('.map_mode_select li').on('click', function (event) {
        var selected = $(this).attr('data-val');
        var artbaz = ['pub', 'osm', 'OpenCycleMap', 'google', 'googlehybrid', 'kiev2006', 'emptyRelief', 'emptyLayer', 'topoUA'];
        map.getLayers().forEach(function (l, i) {
            if (($.inArray(l.get('name'), artbaz)) > -1) {
                if (l.get('name') !== selected) {
                    l.setVisible(false);
                } else {
                    if (l.get('name') == 'OpenCycleMap' || l.get('name') == 'osm') {
                        $('.osm-copyright').show();
                    } else {
                        $('.osm-copyright').hide();
                    }
                    l.setVisible(true);
                }
            }
        });
    });

    $('#bazlayer select').change();

    var sliderInfo;
    var sliderCarousel;

    map.on('singleclick', function (evt) {
        if (!$('#length').hasClass('active') && !$('#area').hasClass('active') && !$('#mbrush').hasClass('active')) {
            var viewResolution = (map.getView().getResolution());
            var infocontainer = $('#information');
            var url;
            var flah = false;
            var infostr = "";
            var layerAlias;
            var indic;
            var arta = ['parcelSidebar', 'vectorSgrayonSidebar', 'vectorPlotsSidebar', 'vectorSoilsSidebar', 'vectorGromSidebar', 'vectorSgPlotsSidebar', 'vectorCitiesSidebar', 'vectorSRSidebar', 'wms3', 'gryntSidebar', 'razgrafkaSidebar', 'boundVinSidebar', 'hydroVinSidebar', 'geodeticSidebar', 'buildingsVinSidebar', 'fencesVinSidebar', 'engcommVinSidebar', 'vegetVinSidebar', 'streetsVinSidebar', 'transportVinSidebar', 'citiesSidebar', 'waterSidebar', 'waterPolygonSidebar', 'waterRiverSubbassinSidebar', 'waterRiverSidebar', 'ecoregionsSidebar', 'waterHouseholdSidebar', 'waterCoastalSidebar', 'waterTransientSidebar'];

            map.getLayers().forEach(function (l, i) {
                if ((($.inArray(l.get('name'), arta)) > -1) && (l.getVisible())) {
                    $('html, body').css("cursor", "wait");
                    setTimeout(function () {
                        if (l.getSource().getParams().ALIAS) {
                            if ($('.language_container i').text() == "UA") {
                                layerAlias = l.getSource().getParams().ALIAS;
                            } else {
                                layerAlias = l.getSource().getParams().ALIAS_E;
                            }
                        } else {
                            layerAlias = "Не визначено";
                        }
                        if (l.get('name') === 'parcelSidebar') {
                            $.ajax({
                                type: 'GET',
                                url: 'http://map.land.gov.ua/kadastrova-karta/getobjectinfo',
                                data: {
                                    'x': evt.coordinate[1],
                                    'y': evt.coordinate[0],
                                    'actLayers[]': 'kadastr',
                                    'zoom': map.getView().getZoom()
                                },
                                async: false,
                                success: function (data) {
                                    $('html, body').css("cursor", "auto");
                                    if (data.pusto == 1) {
                                        alert('Інформація відсутня!');
                                    } else {
                                        for (var item in data) {
                                            var attr_arr = [];
                                            var result = data[item].match(/<li>(.*?)<\/li>/g).map(function (val) {
                                                return val.replace(/<\/?li>/g, '');
                                            });
                                            var regexp = /<div class=\"label\">(.*?)<\/div>(.*)/;
                                            result.forEach(function (res) {
                                                var tmp = regexp.exec(res);
                                                if (tmp != null) {
                                                    if (tmp[1] != null) {
                                                        attr_arr.push(tmp[1]);
                                                    }
                                                    if (tmp[2] != null) {
                                                        attr_arr.push(tmp[2]);
                                                    }
                                                }
                                            });
                                            if (!flah) {
                                                flah = true;
                                            }
                                            switch (item) {
                                                case 'ikk':
                                                    layerAlias = 'ІКК';
                                                    break;
                                                case 'rajonunion':
                                                    layerAlias = 'Район';
                                                    break;
                                                case 'obl':
                                                    layerAlias = 'Область';
                                                    break;
                                                case 'dilanka':
                                                    layerAlias = 'Земельні ділянки (кадастровий поділ)';
                                                    break;
                                            }
                                            infostr += '<div>'
                                            infostr += "<div class='right_menu_title-block'><span class='layer-alias'><p> " + layerAlias + "</p></span>";
                                            infostr += "</div><div class='right_menu_content-block'>";
                                            var i = 0;
                                            while (i < attr_arr.length) {
                                                infostr += "<span class='right_menu_content-title'>" + attr_arr[i++] + "</span><span class='right_menu_content-description'>" + attr_arr[i++] + "</span>";
                                            }
                                            infostr += "</div></div></div>";
                                        }
                                    }
                                },
                                error: function () {
                                    $('html, body').css("cursor", "auto");
                                }
                            })
                        } else {
                            url = l.getSource().getGetFeatureInfoUrl(
                                    evt.coordinate, viewResolution, 'EPSG:900913',
                                    {'INFO_FORMAT': 'application/json'});
                            $.ajax({
                                url: url,
                                async: false,
                                dataType: 'json',
                            }).then(function (response) {
                                $('html, body').css("cursor", "auto");
                                if (l.getSource().getParams().ALIAS) {
                                    if ($('.language_container i').text() == "UA") {
                                        layerAlias = l.getSource().getParams().ALIAS;
                                    } else {
                                        layerAlias = l.getSource().getParams().ALIAS_E;
                                    }
                                } else {
                                    layerAlias = "Не визначено";
                                }
                                for (var i = 0; i < response.features.length; i++) {
                                    if (!flah) {
                                        flah = true;
                                    }
                                    infostr += '<div>'
                                    infostr += "<div class='right_menu_title-block'><span class='layer-alias'><p> " + layerAlias + "</p></span>";
                                    infostr += "</div><div class='right_menu_content-block'>";
                                    for (var key in response.features[i].properties) {
                                        if (/[а-яё]/i.test(key)) {
                                            if (key == 'Інформація') {
                                                var inf = response.features[i].properties[key] == null ? '#' : response.features[i].properties[key];
                                                var infText = inf == "#" ? "-" : inf;
                                                infostr += "<span class='right_menu_content-title'>" + key + "</span><span class='right_menu_content-description'><a href='" + inf + "' target='_blank'>" + infText + "</a></span>";
                                            } else {
                                                infostr += "<span class='right_menu_content-title'>" + key + "</span><span class='right_menu_content-description'>"// + response.features[i].properties[key] + "</span>";
                                                if ((response.features[i].properties[key] == null) || (response.features[i].properties[key] == 0)) {
                                                    infostr += "-</span>"
                                                } else {
                                                    if (key != 'Інформація') {
                                                        infostr += response.features[i].properties[key] + "</span>";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    infostr += "</div></div></div>";
                                }
                                if (l.get('name') === 'vectorSgPlotsSidebar') {
                                    var sg_id = response.features[0].properties['id'];
                                    $.ajax({
                                        type: "POST",
                                        url: Routing.generate('sg_polygon_ajax_geometry'),
                                        data: {input: sg_id},
                                        timeout: 3000,
                                        success: function (response) {
                                            var map = $('#mapView').data('map');
                                            map.getInteractions().forEach(function (interaction) {
                                                if (
                                                        (interaction instanceof ol.interaction.Draw) ||
                                                        (interaction instanceof ol.interaction.Snap) ||
                                                        (interaction instanceof ol.interaction.Modify)
                                                        )
                                                {
                                                    map.removeInteraction(interaction);
                                                }
                                            });

                                            var tgeom = new ol.format.WKT().readGeometry(response.geom);
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
                                            var draw = new ol.interaction.Draw({
                                                source: searchSource,
                                                type: 'polygon',
                                                style: style
                                            });
                                            draw.extend(searchFeature);
                                            map.addInteraction(draw);
                                            $('#remsgfooter').after(response.data);
                                            $('#remsgfooter').addClass('remsgfooter-open');
                                        }
                                    });
                                }
                            });
                        }

                    }, 50);
                }
            });

            setTimeout(function () {
                if (infostr != "" && $('.right_menu').hasClass('close')) {
                    $('.right_menu').toggleClass('close');
                    $('.main_search_container').toggleClass('close');
                    $('.ol-overviewmap').toggleClass('close');
                    $('.account_container').toggleClass('close');
                    $('.language_container').toggleClass('close');
                    $('.right_menu_button').show();
                } else if (!$('.right_menu').hasClass('close') && infostr == "") {
                    $('.right_menu').toggleClass('close');
                    $('.main_search_container').toggleClass('close');
                    $('.right_menu_button').hide();
                    $('.ol-overviewmap').toggleClass('close');
                    $('.account_container').toggleClass('close');
                    $('.language_container').toggleClass('close');
                }
                if (infostr == "") {
                    $('.right_menu_button').hide();
                }
                if (flah) {
                    $('ol.carousel-indicators').html(indic);
                    $('#information').html(infostr);
                    if ($('div').is('.carousel-block')) {
                        sliderCarousel = $('.carousel-block').bxSlider();
                    }
                    if (sliderInfo != undefined) {
                        sliderInfo.destroySlider();
                    }
                    sliderInfo = $('.info-slider').bxSlider({
                        pager: false,
                        touchEnabled: false,
                        controls: true,
                        nextText: '<i class="material-icons" role="presentation">navigate_before</i>',
                        prevText: '<i class="fa fa-arrow-circle-left fa-3x"></i>'
                    });
                    $('.mdl-card__supporting-text img:not(:first)').each(function (i, elem) {
                        $(this).hide().wrap("<a href='" + this.src + "' data-toggle='lightbox' data-gallery='multiimages'></a>");
                    });

                    if ($('.mdl-card__supporting-text img').filter(':first').attr("src") != null) {
                        var srcimg = 'url("' + $('.mdl-card__supporting-text img').filter(':first').attr('src') + '")';
                        $('.mdl-card__title').css("background-image", srcimg).show();

                        $('.mdl-card__title').wrap("<a href='" + $('.mdl-card__supporting-text img').filter(':first').attr('src') + "' data-toggle='lightbox' data-gallery='multiimages'></a>");
                        $('.mdl-card__supporting-text img').filter(':first').hide();
                    }
                    windowResizeHandler();
                } else {
                    infocontainer.innerHTML = '&nbsp;';
                    $('.demo-info').hide();
                    $('#view-source').show();
                }
            }, 150);

        }
    });

    //Зумувати до початкового екстенту//
    $('#main_tt12').on('mousedown', function () {
        $(this).toggleClass('active');
        var viewIn = map.getView();
        var bounce = ol.animation.bounce({
            resolution: viewIn.getResolution() * 2
        });
        var pan = ol.animation.pan({source: viewIn.getCenter()});
        var zoom = ol.animation.zoom({resolution: viewIn.getResolution()});
        map.beforeRender(pan, zoom, bounce);
        var viewTo = new ol.View({
            center: [2740649.6491649942, 6677538.790992998],
            zoom: 12
        });
        map.setView(viewTo);
    });

    $('#main_tt12').on('mouseup', function () {
        $(this).toggleClass('active');
    });
    //END Зумувати то початкового екстенту//

    //Автозаповнення адреси
    var input = document.getElementById('main_search_input');
    var searchBox = new google.maps.places.Autocomplete(input);

    $('.main_search_block').click(function () {
        if (!$('.main_search_block').hasClass('open')) {
            if (searchMarker !== undefined) {
                map.removeOverlay(searchMarker);
            }
        }
    });

    $('#main_search_input').bind("enterKey", function (e) {
        $('.pac-container').remove();
        var searchval = $('#main_search_input').val();

        var input = document.getElementById('main_search_input');
        var searchBox = new google.maps.places.Autocomplete(input);
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {'address': searchval},
            success: function (data) {
                if (data.status == 'ZERO_RESULTS') {
                    dialog.showModal();
                    if (searchMarker !== undefined) {
                        map.removeOverlay(searchMarker);
                    }
                } else {
                    if (searchMarker !== undefined) {
                        map.removeOverlay(searchMarker);
                    }
                    var sourceProj = map.getView().getProjection();
                    var c1 = ol.proj.transform([data.results[0].geometry.viewport.northeast.lng, data.results[0].geometry.viewport.northeast.lat], 'EPSG:4326', 'EPSG:900913');
                    var c2 = ol.proj.transform([data.results[0].geometry.viewport.southwest.lng, data.results[0].geometry.viewport.southwest.lat], 'EPSG:4326', 'EPSG:900913');
                    var fitextent = [c1[0], c1[1], c2[0], c2[1]];

                    map.getView().fit(fitextent, map.getSize());
                    if (searchMarker === undefined) {
                        searchMarker = new ol.Overlay({
                            element: document.getElementById('searchLocation'),
                            positioning: 'center-center',
                        });
                    }
                    map.addOverlay(searchMarker);
                    var position = ol.proj.transform([data.results[0].geometry.location.lng, data.results[0].geometry.location.lat], 'EPSG:4326', 'EPSG:900913');
                    searchMarker.setPosition(position);
                    $('#searchLocation').show();
                }

            }
        })
    });
    $('#main_search_input').keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
});

/*----Add measure (START)----*/
function addMeasure() {
    var source = new ol.source.Vector();
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.4)',
        }),
        stroke: new ol.style.Stroke({
            color: '#09f',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    });
    var vector = new ol.layer.Vector({
        source: source,
        style: style
    });

    /**
     * The measure tooltip element.
     * @type {Element}
     */
    var measureTooltipElement;

    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     */
    var measureTooltip;
    /**
     * Currently drawed feature
     * @type {ol.Feature}
     */

    var sketch;
    /**
     * Element for currently drawed feature
     * @type {Element}
     */
    var sketchElement;
    var typeSelect;
    /**
     * handle pointer move
     * @param {Event} evt
     */
    var wgs84Sphere = new ol.Sphere(6378137);

    map.addLayer(vector);
    $('#erase').on('mousedown', function () {
        $(this).addClass('active');

    });
    $('#erase').on('mouseup', function () {
        $('.measure').removeClass('active');
        $('.tooltip.tooltip-static').remove();
        map.removeInteraction(draw);
        source.clear();
    });

    $('.measure:not(#erase)').on('click', function (e) {

        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
            $('.tooltip.tooltip-static').remove();
        } else {
            source.clear();
            $('.measure').removeClass('active')
            $('.tooltip.tooltip-static').remove();

            $(this).addClass('active')
            map.removeInteraction(draw);
        }
        if ($(this).hasClass('active')) {
            typeSelect = $(this).attr('id')

            addInteraction();
        } else {
            map.removeInteraction(draw);
            source.clear();
        }
    });

    createMeasureTooltip();
    var draw; // global so we can remove it later
    function addInteraction() {
        var type = (typeSelect == 'area' ? 'Polygon' : 'LineString');
        draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ (type),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.8)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
        map.addInteraction(draw);
        var listener;
        draw.on('drawstart',
                function (evt) {
                    sketch = evt.feature;
                    var tooltipCoord = evt.coordinate;
                    listener = sketch.getGeometry().on('change', function (evt) {
                        var geom = evt.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = formatArea(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = formatLength(geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        measureTooltipElement.innerHTML = output;
                        measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);
        draw.on('drawend',
                function () {
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -9]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    ol.Observable.unByKey(listener);
                }, this);
    }

    /**
     * format length output
     * @param {ol.geom.LineString} line
     * @return {string}
     */

    var formatLength = function (line) {
        var length;
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                    ' ' + 'км';
        } else {
            output = (Math.round(length * 100) / 100) +
                    ' ' + 'м';
        }
        return output;
    };

    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
     */
    var formatArea = function (polygon) {
        var area;
        var sourceProj = map.getView().getProjection();
        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                    ' ' + 'км<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                    ' ' + 'м<sup>2</sup>';
        }
        return output;
    };

    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
    }

    /*  $('.measure').hover(function(){
     $(this).addClass('is-active');
     });
     $('.measure').mouseleave(function(){
     $(this).removeClass('is-active');
     });*/

    /*----Add measure (END)----*/

}