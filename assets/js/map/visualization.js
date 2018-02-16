(function($) {
    var conclusion_target = '';
    var prim_conclusion_target = '';

    $(document).ready(function () {
        $('.dtp-btn-ok').click(function (e) {
            e.preventDefault();
        });
    });


    $('.open_menu_but').click(function() {
        $('.demo-drawer').toggleClass('left_menu_open');
        $('.edit_buttons').toggleClass('left_menu_open');
        $('.map_mode_select').toggleClass('left_menu_open');
        $('.ol-zoom').toggleClass('left_menu_open');
       // $('.ol-overviewmap').toggleClass('left_menu_open');
        $('.new_legend').toggleClass('left_menu_open');
        $('.coordinate').toggleClass('left_menu_open');
        $('.scale-line').toggleClass('left_menu_open');
    });

    $('.left_menu li').click(function() {
        $('.left_menu li').removeClass('focus');
        $(this).toggleClass('focus');
    });

    $('.right_menu_content-block-item').click(function() {
        $('.right_menu_content-block-item').removeClass('open');
        $(this).toggleClass('open');
    });

    $('.bid_list_button, .bid_list-footer').click(function() {
        $('.bid_list').toggleClass('open');

    });

    $('.bid_list-footer .btn').click(function() {
        $('.bids_list').toggleClass('open');
    });
    $('.bids_list .dialog_window_publication_bids_list-footer .btn-cancel').click(function() {
        $('.bids_list').toggleClass('open');
    });

    $('#modal-help .btn-cancel').click(function() {
        $('#modal-help').toggleClass('open');
    });

    $('#modal-copy .btn-cancel').click(function() {
        $('#modal-copy').toggleClass('open');
    });
    
    $('.dialog_window_publication_bids_list-footer .btn-public').click(function() {
        var snackbarContainer = document.querySelector('#snackbar_container');
        var handler = function(event) {
        };
        var data = {
            message: 'Ваш перелік заявок опубліковано.',
            timeout: 2000,
            actionHandler: handler,
            actionText: 'СКАСУВАТИ'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        $('.bids_list').toggleClass('open');
    });

    $('.new_bid .btn-cancel').click(function() {
        $('.new_bid').toggleClass('open');
    });
    $(' .right_menu_footer-block .btn-add').click(function() {
        $('.new_bid').toggleClass('open');
    });
    $(' .meet_item').click(function() {
        $(this).toggleClass('open');
        var tr_count = this.getElementsByTagName('tr').length;
        if (tr_count < 5) {
            this.getElementsByClassName('meet_item_container')[0].classList.add('overflow_y_hidden');
        }
    });

    $(window).scroll(function(e) {
        var scrolled = $(window).scrollTop();
        var scrolled1 = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled1 >= 20) {
            $('.sub_header').addClass('close');
            $('.meetings_wrap').addClass('close');
        } else {
            $('.sub_header').removeClass('close');
            $('.meetings_wrap').removeClass('close');
        }
    });

    $(function() {

        $('.up').click(function() {
            var currentImgBlock = $(this).parent().parent();
            var prevImgBlock = currentImgBlock.prev();
            swap(currentImgBlock, prevImgBlock);
            return false;
        });

        $('.down').click(function() {
            var currentImgBlock = $(this).parent().parent();
            var nextImgBlock = currentImgBlock.next();
            swap(nextImgBlock, currentImgBlock);
            return false;
        });
    });

    function swap(a, b) {
        if (a.size() > 0 && b.size() > 0) {
            a.insertBefore(b);
        }
    }

    $('#sort_list_1').click(function() {
        $('.sub_header_control-btn').addClass('fix_popup');
        $('.back_block_fix').addClass('open');
    });

    $('.back_block_fix').click(function() {
        $('.sub_header_control-btn').removeClass('fix_popup');
        $('.back_block_fix').removeClass('open');

    });

    $('.btn_save_meet').click(function() {
        $('.modal_bg.save_meeting').addClass('open');
    });
    $('.btn_cancel_save_meet').click(function() {
        $('.modal_bg.save_meeting').removeClass('open');
    });
    $('.clear_icon').click(function() {
        $('#site-search').val('');
        $('.is-dirty').removeClass('is-dirty');
    });
    $('.right_menu_button').click(function() {
        $('.right_menu').toggleClass('close');
        //$('.bid_list').toggleClass('close');
        $('.main_search_container').toggleClass('close');
        $('.ol-overviewmap').toggleClass('close');
        $('.account_container').toggleClass('close');
        $('.language_container').toggleClass('close');

    });

    $('.button_add_block .text-white').click(function() {
        $('.button_add_block').toggleClass('open');

    });

    $('.main_search_block_button').click(function() {
        $('.main_search_block').toggleClass('open');

    });
    $('.main_clear_block_button').click(function() {
        $('#main_search_input').val('');
    });
    $('.open_info_modal').click(function() {
        $('.info_modal').toggleClass('open');
    });

    $('.open_info_modal').click(function() {
        document.getElementById("file").onchange = function() {
            document.getElementById("uploadFile").value = this.files[0].name;
        };
    });


    $('.file_input_clear_icon').click(function() {
        $('#uploadFile').val('');
        $('#file').val('');
        $('.file_input_clear_icon').removeClass('not_empty');
    });

    $('#file').change(function() {
        $('.file_input_clear_icon').addClass('not_empty');
    });

    $('.conclusion_span').click(function() {
        $(this).parent($('.conclusion_container')).children($('.conclusion_Input_block')).addClass('active');
        $(this).parent($('.conclusion_container')).children($('.conclusion_Input_block')).children($('.conclusion_Input_block_container')).children($('.mdl-textfield')).children($('textarea')).addClass('active');
        $('.conclusion_back_block_fix').addClass('open');
        conclusion_target = $(this);
        prim_conclusion_target = $(this).parent($('.conclusion_container')).find($('.prim_cont'));
    });

    $('.conclusion_back_block_fix').click(function() {
        $('.conclusion_back_block_fix').removeClass('open');
        $('.conclusion_Input_block').removeClass('active');
        $('textarea').removeClass('active');
    });

    $('.visn textarea').keyup(function() {
        conclusion_target.html($('textarea.active').val());
    });

    $('.prim textarea').keyup(function() {
        conclusion_target.html($('textarea.active').val());
        prim_conclusion_target.html($('textarea.active').val());
    });
    $('.mdl-navigation__level1').click(function(event) { //при клике на пункт меню:

        if ((event.target.className == 'mdl-checkbox__tick-outline') || (event.target.className == 'mdl-checkbox__input')) {

        } else {
            $(this).toggleClass('active'); //делаем данный пункт активным/неактивным
            $(this).next('.mdl-navigation__level2').slideToggle(400); //раскрываем/скрываем следующий за "кликнутым" p блок div с эффектом slide
        }
    });

    //Убираем выключения слоя при перетаскивании слайдера//
    var flag_slide = true;
     $('.slider_tr').on('mousedown', function(event){
        flag_slide = false;
     })
     $('.slider_tr').on('click', function(event){
        event.stopImmediatePropagation();
        flag_slide = true;
     })

    $('.mdl-navigation__level3').on('click',function(event) { //при клике на пункт меню:
        if(flag_slide == true){
            event.relatedTarget;
            if (event.target.className != 'material-icons' && $(this).hasClass('document_download') == false) {
                $(this).toggleClass('active');//делаем данный пункт активным/неактивным
            }
        }else{
            flag_slide = true;
        }
    });
    //---------------------------------------------------------------//
})(jQuery);
