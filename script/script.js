( ($) => {
    $(document).ready( () => {

//Плавный scroll по клику                      
        var LpNav = $('header ul');
        LpNav.find('li a').on('click',  (event) => {
            let trgtSelector = $(this).attr('href');
            let linkTrgt = $(trgtSelector);
            if (linkTrgt.length > 0) {
                event.preventDefault();
                let headerHeight = $('header').outerHeight(),
                    offset = linkTrgt.offset().top;
                $('body, html').animate({
                    scrollTop: offset - headerHeight
                }, 750);
            }
        });

// Подсветка пунктов header
        let lpSetNavActive = () => {
            let CurItem = '';
            $('section').each(function () {
                if ($(window).scrollTop() > $(this).offset().top - 200) {
                    CurItem = $(this).attr('id');
                }
            });
            let noActiveItem = LpNav.find('li.active').length == 0,
                newActiveRequired = LpNav.find('li.active a').attr('href') != '#' + CurItem;
            if (noActiveItem || newActiveRequired) {
                LpNav.find('li.active').removeClass('active');
                LpNav.find('li a[href="#' + CurItem + '"]').parent().addClass('active');
            }
        };
        lpSetNavActive();
        $(window).on('scroll load', lpSetNavActive);

//Вызываем lptabs с нужными параметрами
        $('.lp-services').lpTabs({
            event: 'click',
            firstItem: 0,
            duration: 500
        });

//Отрисовка отзывов на странице
        let feadbacks = [],
            drawFeadbacks = () => {
                $('.col-sm-9').remove();
                $('#feadback .row-flex').append('<div class="col-sm-9 owl-carousel lp-slider-fb"></div>');

                feadbacks.forEach( (item, i, feadbacks) => {
                    $('.col-sm-9').append('<div class="feadback"></div>');
                });

                feadbacks.forEach( (item, i, feadbacks) => {
                    $('.col-sm-9 .feadback').eq(i).append('<img src="' + item.src + '" alt="Фото" style="width: 100px; height: 100px">');
                    $('.col-sm-9 .feadback').eq(i).append('<div>' + item.name + '</div>');
                    $('.col-sm-9 .feadback').eq(i).append('<div>' + item.date + '</div>');
                    $('.col-sm-9 .feadback').eq(i).append('<q>' + item.text + '</q>');
                    $('.col-sm-9 .feadback').eq(i).append('<div id="' + i + '" class="wi-fb-line"><ul class="wi-fb-line"><li class="fb-star">&#9734;</li><li class="fb-star">&#9734;</li><li class="fb-star">&#9734;</li><li class="fb-star">&#9734;</li><li class="fb-star">&#9734;</ul></div>');

                    $('#' + i + ' .fb-star').each( () => {
                        if ($(this).index() < item.mark) {
                            $(this).addClass('marked');
                        }
                    });

                    localStorage.setItem("feadbacks", JSON.stringify(feadbacks));

                });

                $('.lp-slider-fb').owlCarousel({
                    nav: true,
                    navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
                    responsive: {
                        0: {
                            nav: true,
                            items: 1
                        },
                        750: {
                            nav: true,
                            items: 2
                        },
                    }
                });
            }
        
//Подстраиваем высоту блока под максимальную высоту блока
        let feadBackAutoHeight = () => {
            let fh = $('#feadback .feadback'),
                maxHeight = 0;

            fh.each( (i) => {
                if(maxHeight <= $(this).outerHeight()){
                    maxHeight = $(this).outerHeight();
                }
            });

            fh.each( (i) => {
                $(this).outerHeight(maxHeight);
            });  
        }

//Загрузка отзывов из JSON в LocaleStorage       
        let loadFeadBack = () => {
            feadbacks = JSON.parse(localStorage.getItem("feadbacks"));
            if (!feadbacks) {
                $.ajax({
                    url: 'feadback.json',
                    method: 'GET',
                    dataType: "json"
                }).then( (res) => {
                    feadbacks = res;
                    drawFeadbacks();
                });
            } else {
                drawFeadbacks();
            }
            feadBackAutoHeight();
        }
        loadFeadBack();

//Всплывающие окна "Местоположение"
        $('.button').magnificPopup({
            type: 'inline'
        });

//Инициализация формы Контакты            
        $('#lp-fb').wiFeedBack({
            fbScript: 'PHP/wi-feedback.php',
            fbLink: false
        });

//Инициализация формы Контакты            
        $('#jump').wiFeedBack({
            fbScript: 'PHP/wi-feedback.php',
            fbLink: false
        });

//Яндекс.карты
        $.fn.lpMapInit = () => {

            let lpMapOptions_1 = {
                    center: [53.920007, 27.514722],
                    zoom: 16,
                    controls: ['fullscreenControl', 'zoomControl']
                },
                lpMapOptions_2 = {
                    center: [53.990315, 27.308368],
                    zoom: 16,
                    controls: ['fullscreenControl', 'zoomControl']
                },
                lpMapOptions_3 = {
                    center: [53.977314, 27.298783],
                    zoom: 16,
                    controls: ['fullscreenControl', 'zoomControl']
                },
                lpMapOptions_4 = {
                    center: [53.162226, 29.243562],
                    zoom: 16,
                    controls: ['fullscreenControl', 'zoomControl']
                },
                lpMapOptions_5 = {
                    center: [53.188729, 29.185132],
                    zoom: 16,
                    controls: ['fullscreenControl', 'zoomControl']
                },
                lpMapOptions_6 = {
                    center: [52.453780, 31.076251],
                    zoom: 16,
                    controls: ['fullscreenControl', 'zoomControl']
                }

            if (window.innerWidth < 768) {
                lpMapOptions_1.behaviors = ['multiTouch'];
                lpMapOptions_2.behaviors = ['multiTouch'];
                lpMapOptions_3.behaviors = ['multiTouch'];
                lpMapOptions_4.behaviors = ['multiTouch'];
                lpMapOptions_5.behaviors = ['multiTouch'];
                lpMapOptions_6.behaviors = ['multiTouch'];
            } else {
                lpMapOptions_1.behaviors = ['drag'];
                lpMapOptions_2.behaviors = ['drag'];
                lpMapOptions_3.behaviors = ['drag'];
                lpMapOptions_4.behaviors = ['drag'];
                lpMapOptions_5.behaviors = ['drag'];
                lpMapOptions_6.behaviors = ['drag'];
            }

            let lpMap_1 = new ymaps.Map('lp-map-1', lpMapOptions_1),
                lpMap_2 = new ymaps.Map('lp-map-2', lpMapOptions_2),
                lpMap_3 = new ymaps.Map('lp-map-3', lpMapOptions_3),
                lpMap_4 = new ymaps.Map('lp-map-4', lpMapOptions_4),
                lpMap_5 = new ymaps.Map('lp-map-5', lpMapOptions_5),
                lpMap_6 = new ymaps.Map('lp-map-6', lpMapOptions_6);

            let lpPlacemark_1 = new ymaps.Placemark(lpMapOptions_1.center, {
                    hintContent: '"Радиаторный" мост',
                    balloonContentHeader: '"Радиаторный" мост',
                    balloonContentBody: 'RopeJumping.by',
                    balloonContentFooter: 'г. Минск, Перекресток ул. Тимирязева и Саперов'
                }),
                lpPlacemark_2 = new ymaps.Placemark(lpMapOptions_2.center, {
                    hintContent: '"Заславский" Замок',
                    balloonContentHeader: '"Заславский" Замок',
                    balloonContentBody: 'RopeJumping.by',
                    balloonContentFooter: 'г. Заславль, ул. Гонолес, 2А'
                }),
                lpPlacemark_3 = new ymaps.Placemark(lpMapOptions_3.center, {
                    hintContent: 'Троллейка (д. Зеленая)',
                    balloonContentHeader: 'Троллейка (д. Зеленая)',
                    balloonContentBody: 'RopeJumping.by',
                    balloonContentFooter: 'Минская обл., д. Зеленая, начало ул. Привокзальная'
                }),
                lpPlacemark_4 = new ymaps.Placemark(lpMapOptions_4.center, {
                    hintContent: 'Фандоковский мост (г. Бобруйск)',
                    balloonContentHeader: 'Фандоковский мост (г. Бобруйск)',
                    balloonContentBody: 'RopeJumping.by',
                    balloonContentFooter: 'г. Бобруйск, Фандоковский мост'
                }),
                lpPlacemark_5 = new ymaps.Placemark(lpMapOptions_5.center, {
                    hintContent: 'Вышка (г. Бобруйск)',
                    balloonContentHeader: 'Вышка (г. Бобруйск)',
                    balloonContentBody: 'RopeJumping.by',
                    balloonContentFooter: 'г. Бобруйск, ул. Минская (возле ОАО "Белшина")'
                }),
                lpPlacemark_6 = new ymaps.Placemark(lpMapOptions_6.center, {
                    hintContent: '"Кленковский" мост (г. Гомель)',
                    balloonContentHeader: '"Кленковский" мост (г. Гомель)',
                    balloonContentBody: 'RopeJumping.by',
                    balloonContentFooter: 'г. Гомель, ж/д мост ст. Кленки'
                });

            lpMap_1.geoObjects.add(lpPlacemark_1);
            lpMap_2.geoObjects.add(lpPlacemark_2);
            lpMap_3.geoObjects.add(lpPlacemark_3);
            lpMap_4.geoObjects.add(lpPlacemark_4);
            lpMap_5.geoObjects.add(lpPlacemark_5);
            lpMap_6.geoObjects.add(lpPlacemark_6);
        }

//Выставление оценки по клику на звезду
        let mark = 0;
        $('ul.wi-fb-line li').on('click',  () => {
            mark = $(this).attr('data-mark');
            $('.star').each( () =>{
                if ($(this).attr('data-mark') <= mark) {
                    $(this).addClass('marked');
                }
                if ($(this).attr('data-mark') > mark) {
                    $(this).removeClass('marked');
                }
            });
        });

//Добавление отзыва        
        $('button#fb-add').on('click', () =>{

            let fb = {},
                currentDate = new Date;

            feadbacks = JSON.parse(localStorage.getItem("feadbacks"));

            fb.name = $('#fb-name').val();
            fb.date = currentDate.toLocaleString("ru", {});
            fb.text = $('#fb-text').val();
            fb.src = $('#fb-src').val();
            fb.mark = mark;
            feadbacks.unshift(fb);

            drawFeadbacks();
            feadBackAutoHeight();

            $('button.mfp-close').click();
            $('.star').removeClass('marked');
            mark = 0;
        });
        
//Очистка поля для ввода
        $('button.mfp-close').on('click',  () => {
            mark = 0;
            console.log(mark);
            $('.star.marked').removeClass('marked');
        });

//Слайдер альбомов 
        $('.lp-slider').owlCarousel({
            items: 1,
            nav: true,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>']
        });

//Всплывающие окна для слайдера альбомов
        $('.lp-gallery').each( () => {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });
        
//Динамическое изменение размера окна feadback в зависимости от размера экрана        
        $(window).resize( () => {
            drawFeadbacks();
            feadBackAutoHeight();
        });
        
    });
})(jQuery);