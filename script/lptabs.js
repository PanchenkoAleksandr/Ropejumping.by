( ($) => {
    $.fn.lpTabs = function (userParams) {
//В объект defaultParams добавляем:
//                                 свойство 'event', в котором будем хранить название события по умолчанию
//                                 свойство 'firstItem', в котором будем хранить начальную вкладку
        defaultParams = {
            event: 'click',
            firstItem: 0,
            duration: 1000
        }

        let params = $.extend(defaultParams, userParams);

        return $(this).each( () => {

            let tabs = $(this),
                tabsTitlesNames = [];
            tabs.addClass('lp-tabs');
            tabs.children().each( () => {
                tabsTitlesNames.push($(this).attr('title'));
            }).addClass('lp-tab');

            tabs.wrapInner('<div class="lp-tabs-content"></div>');

            tabs.prepend('<div class="lp-tabs-titles"><ul></ul></div>');

            let tabsTitles = tabs.find('.lp-tabs-titles'), // 
                tabsContent = tabs.find('.lp-tabs-content'), // 
                tabsContentTabs = tabsContent.find('.lp-tab');
            tabsTitlesNames.forEach( (value) => {
                tabsTitles.find('ul').append('<li>' + value + '</li>');
            });
            let tabsTitlesItems = tabsTitles.find('ul li');

//Функция для проверки некорректности введенного 
            let check = (number1, number2) => {
                return number1 !== defaultParams.firstItem;
            }
//Создаем и заполняем масиив, соответствующий количеству вкладок табулятора
            let arr = [];
            for (let i = 0; i < tabsTitlesItems.length; i++) {
                arr[i] = tabsTitlesItems.eq(i).index();
            }

//Проверяем введенный пользоваетелем номер начальной вкладки
            if (arr.every(check))
                console.log('Ошибка!\nВ свойстве " firstItem " объекта " defaultParams " введено некорректное значение!\nСкрипт lpTabs не будет работать!!!');
            tabsTitlesItems.eq(defaultParams.firstItem).addClass('active');

//Делаем активной выбранную пользователем вкладку            
            tabsContentTabs.eq(defaultParams.firstItem).addClass('active').show();
            tabsContent.height(tabsContent.find('.active').outerHeight());

//Добавляем в обработчик выбранное пользователем событие
            tabsTitlesItems.on(params.event, () => {

                if (!tabs.hasClass('changing')) {
                    tabs.addClass('changing');
                    tabsTitlesItems.removeClass('active');
                    $(this).addClass('active');

                    let curTab = tabsContent.find('.active'),
                        nextTab = tabsContentTabs.eq($(this).index()),
                        curHeight = curTab.outerHeight();

                    nextTab.show();

                    let nextHeight = nextTab.outerHeight();

                    nextTab.hide();

                    if (curHeight < nextHeight) {

                        tabsContent.animate({
                            height: nextHeight
                        }, params.duration / 2);
                    }

                    curTab.fadeOut(params.duration / 2, () => {

                        if (curHeight > nextHeight) {

                            tabsContent.animate({
                                height: nextHeight
                            }, params.duration / 2);
                        }

                        nextTab.fadeIn(params.duration / 2, () => {

                            curTab.removeClass('active');

                            nextTab.addClass('active');

                            tabs.removeClass('changing');
                        });
                    });
                }
            });

            $(window).on('load resize', () => {
                tabsContent.height(tabsContent.find('.active').outerHeight());
            });
        });
        
    }
})(jQuery);