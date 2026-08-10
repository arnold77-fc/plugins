(function () {
    'use strict';

    // Защита от повторного запуска
    if (window.menu_editor_v4_running) return;
    window.menu_editor_v4_running = true;

    function startPlugin() {
        console.log('[Menu Editor v4] Старт инициализации...');

        function initialize() {
            console.log('[Menu Editor v4] Плагин успешно запущен.');

            // Всплывающее уведомление при успешном старте
            setTimeout(() => {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('✅ Menu Editor (v4) активен!');
                }
            }, 1200);

            // ==========================================
            // 1. УТИЛИТЫ И CSS
            // ==========================================

            // Очистка и нормализация текста для 100% совпадения
            function normText(str) {
                if (str === null || str === undefined) return '';
                return str
                    .toString()
                    .replace(/\u00a0/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toLowerCase();
            }

            // Внедрение критических CSS правил
            function injectStyles() {
                if ($('#menu_editor_style').length) return;
                $('head').append(`
                    <style id="menu_editor_style">
                        /* Принудительное скрытие */
                        [data-me-hidden="true"],
                        .menu .menu__item[data-me-hidden="true"],
                        .head .head__action[data-me-hidden="true"],
                        .settings-folder[data-me-hidden="true"],
                        .navigation-bar[data-me-hidden="true"],
                        .me-hidden {
                            display: none !important;
                            opacity: 0 !important;
                            visibility: hidden !important;
                            pointer-events: none !important;
                            width: 0 !important;
                            height: 0 !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            overflow: hidden !important;
                            border: none !important;
                        }

                        /* Стили редактора */
                        .menu-edit-list {
                            padding: 10px 0;
                            max-height: 65vh;
                            overflow-y: auto;
                        }
                        .menu-edit-list__item {
                            display: flex;
                            align-items: center;
                            padding: 12px 15px;
                            margin-bottom: 8px;
                            background: rgba(255, 255, 255, 0.06);
                            border-radius: 8px;
                        }
                        .menu-edit-list__icon {
                            width: 32px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                        }
                        .menu-edit-list__icon svg {
                            width: 24px;
                            height: 24px;
                        }
                        .menu-edit-list__title {
                            flex: 1;
                            font-size: 16px;
                            color: #ffffff;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .menu-edit-list__move,
                        .menu-edit-list__toggle {
                            width: 38px;
                            height: 38px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 8px;
                            border-radius: 6px;
                            cursor: pointer;
                            background: rgba(255, 255, 255, 0.12);
                        }
                    </style>
                `);
            }

            function hideEl($el) {
                if (!$el || !$el.length) return;
                $el.attr('data-me-hidden', 'true')
                   .addClass('me-hidden hide hidden')
                   .removeClass('selector'); // Снимаем фокус ТВ-пульта
                $el.each(function () {
                    this.style.setProperty('display', 'none', 'important');
                    this.style.setProperty('opacity', '0', 'important');
                    this.style.setProperty('visibility', 'hidden', 'important');
                });
            }

            function showEl($el) {
                if (!$el || !$el.length) return;
                $el.removeAttr('data-me-hidden')
                   .removeClass('me-hidden hide hidden')
                   .addClass('selector'); // Возвращаем фокус
                $el.each(function () {
                    this.style.removeProperty('display');
                    this.style.removeProperty('opacity');
                    this.style.removeProperty('visibility');
                });
            }

            injectStyles();

            // ==========================================
            // 2. ЯЗЫКИ
            // ==========================================
            Lampa.Lang.add({
                menu_editor_title: { ru: 'Редактирование меню', uk: 'Редагування меню', en: 'Menu Editor', zh: '菜单编辑器' },
                menu_editor_left: { ru: 'Левое меню', uk: 'Ліве меню', en: 'Left Menu', zh: '左侧菜单' },
                menu_editor_top: { ru: 'Верхнее меню', uk: 'Верхнє меню', en: 'Top Menu', zh: '顶部菜单' },
                menu_editor_settings: { ru: 'Меню настроек', uk: 'Меню налаштувань', en: 'Settings Menu', zh: '设置菜单' },
                menu_editor_hide_nav: { ru: 'Скрыть панель навигации', uk: 'Приховати панель навігації', en: 'Hide Navigation Bar', zh: '隐藏导航栏' },
                menu_editor_add_reload_button: { ru: 'Кнопка перезагрузки в шапке', uk: 'Кнопка перезавантаження', en: 'Add reload button', zh: '添加刷新按钮' },
                menu_editor_add_clear_cache_button: { ru: 'Кнопка очистки кеша в шапке', uk: 'Кнопка очищення кешу', en: 'Add clear cache button', zh: '添加清除缓存按钮' },
                head_action_clear_cache: { ru: 'Очистить кеш', uk: 'Очистити кеш', en: 'Clear cache', zh: '清除缓存' },
                head_action_reload: { ru: 'Перезагрузка', uk: 'Перезавантаження', en: 'Reload', zh: '重新加载' },
                head_action_search: { ru: 'Поиск', en: 'Search', uk: 'Пошук', zh: '搜索' },
                head_action_feed: { ru: 'Лента', en: 'Feed', uk: 'Стрічка', zh: '动态' },
                head_action_notice: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення', zh: '通知' },
                head_action_settings: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування', zh: '设置' },
                head_action_profile: { ru: 'Профиль', en: 'Profile', uk: 'Профіль', zh: '个人资料' },
                head_action_fullscreen: { ru: 'Полный экран', en: 'Fullscreen', uk: 'Повноекранний режим', zh: '全屏' },
                head_action_broadcast: { ru: 'Трансляции', en: 'Broadcast', uk: 'Трансляції', zh: '直播' },
                no_name: { ru: 'Элемент', en: 'Element', uk: 'Елемент', zh: '元素' }
            });

            // ==========================================
            // 3. ИДЕНТИФИКАЦИЯ ЭЛЕМЕНТОВ
            // ==========================================
            function getHeadActionKey($el) {
                let classes = $el.attr('class') ? $el.attr('class').split(/\s+/) : [];
                let mainClass = classes.find(c =>
                    c.startsWith('open--') ||
                    c.startsWith('notice--') ||
                    c.startsWith('full--') ||
                    c.startsWith('head__action--')
                );
                if (mainClass) return mainClass;

                let actionAttr = $el.attr('data-action') || $el.attr('action');
                if (actionAttr) return 'action--' + actionAttr;

                return 'index--' + $el.index();
            }

            function getHeadActionName(key, $el) {
                if (key.includes('open--search')) return Lampa.Lang.translate('head_action_search');
                if (key.includes('open--feed')) return Lampa.Lang.translate('head_action_feed');
                if (key.includes('notice--')) return Lampa.Lang.translate('head_action_notice');
                if (key.includes('open--settings')) return Lampa.Lang.translate('head_action_settings');
                if (key.includes('open--profile')) return Lampa.Lang.translate('head_action_profile');
                if (key.includes('full--screen')) return Lampa.Lang.translate('head_action_fullscreen');
                if (key.includes('open--broadcast')) return Lampa.Lang.translate('head_action_broadcast');
                if (key === 'head__action--clear-cache') return Lampa.Lang.translate('head_action_clear_cache');
                if (key === 'head__action--reload') return Lampa.Lang.translate('head_action_reload');

                let title = $el ? ($el.attr('title') || $el.find('title').text()) : '';
                if (title) return title.trim();

                return Lampa.Lang.translate('no_name') + ' (' + key + ')';
            }

            // ==========================================
            // 4. ПРИМЕНЕНИЕ И ФИЛЬТРАЦИЯ ИНТЕРФЕЙСА
            // ==========================================
            function applyLeftMenu() {
                let sort = Lampa.Storage.get('menu_sort', []);
                let hide = Lampa.Storage.get('menu_hide', []);
                let menu = $('.menu');
                if (!menu.length) return;

                let items = menu.find('.menu__item');
                if (!items.length) return;

                items.each(function () {
                    let $this = $(this);
                    let txt = normText($this.find('.menu__text').text());
                    if (!txt) return;

                    let shouldHide = hide.some(h => normText(h) === txt);
                    if (shouldHide) {
                        hideEl($this);
                    } else {
                        showEl($this);
                    }
                });

                if (sort.length) {
                    let mainList = menu.find('.menu__list:eq(0)');
                    if (mainList.length) {
                        sort.forEach((name) => {
                            let normName = normText(name);
                            let target = mainList.find('.menu__item').filter(function () {
                                return normText($(this).find('.menu__text').text()) === normName;
                            });
                            if (target.length) target.appendTo(mainList);
                        });
                    }
                }
            }

            function applyTopMenu() {
                let sort = Lampa.Storage.get('head_menu_sort', []);
                let hide = Lampa.Storage.get('head_menu_hide', []);
                let actionsContainer = $('.head__actions');
                if (!actionsContainer.length) return;

                // Доп. кнопка "Очистить кеш"
                if (Lampa.Storage.get('add_clear_cache_button', false) && !$('.head__action--clear-cache').length) {
                    let clearBtn = Lampa.Head.addIcon(
                        `<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>`,
                        () => {
                            Lampa.Storage.clear(false);
                            Lampa.Cache.clearAll();
                            Lampa.Noty.show(Lampa.Lang.translate('settings_clear_cache_only'));
                        }
                    );
                    if (clearBtn) clearBtn.addClass('head__action head__action--clear-cache');
                }

                // Доп. кнопка "Перезагрузка"
                if (Lampa.Storage.get('add_reload_button', false) && !$('.head__action--reload').length) {
                    let reloadBtn = Lampa.Head.addIcon(
                        `<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/></svg>`,
                        () => { window.location.reload(); }
                    );
                    if (reloadBtn) reloadBtn.addClass('head__action head__action--reload');
                }

                let allActions = $('.head__action');
                allActions.each(function () {
                    let $this = $(this);
                    let key = getHeadActionKey($this);
                    if (hide.includes(key)) {
                        hideEl($this);
                    } else {
                        showEl($this);
                    }
                });

                if (sort.length) {
                    sort.forEach((key) => {
                        let item = allActions.filter(function () {
                            return getHeadActionKey($(this)) === key;
                        });
                        if (item.length) item.appendTo(actionsContainer);
                    });
                }
            }

            function applySettingsMenu() {
                let sort = Lampa.Storage.get('settings_menu_sort', []);
                let hide = Lampa.Storage.get('settings_menu_hide', []);
                let settingsFolders = $('.settings-folder');
                if (!settingsFolders.length) return;

                settingsFolders.each(function () {
                    let $this = $(this);
                    let name = normText($this.find('.settings-folder__name').text());
                    if (!name) return;

                    let shouldHide = hide.some(h => normText(h) === name);
                    if (shouldHide) {
                        hideEl($this);
                    } else {
                        showEl($this);
                    }
                });

                let settingsContainer = $('.settings .scroll__body > div');
                if (sort.length && settingsContainer.length) {
                    sort.forEach((name) => {
                        let normName = normText(name);
                        let item = settingsFolders.filter(function () {
                            return normText($(this).find('.settings-folder__name').text()) === normName;
                        });
                        if (item.length) item.appendTo(settingsContainer);
                    });
                }
            }

            function applyNavBar() {
                let nav = $('.navigation-bar');
                if (Lampa.Storage.field('hide_navigation_bar') == true) {
                    hideEl(nav);
                } else {
                    showEl(nav);
                }
            }

            function applyAll() {
                injectStyles();
                applyLeftMenu();
                applyTopMenu();
                applySettingsMenu();
                applyNavBar();
            }

            // ==========================================
            // 5. РЕДАКТОРЫ (РАБОТАЮТ ЧЕРЕЗ ПАМЯТЬ/STORAGE)
            // ==========================================
            function editLeftMenu() {
                let currentHide = Lampa.Storage.get('menu_hide', []);
                let itemsData = [];

                // Считываем список
                $('.menu .menu__item').each(function () {
                    let txt = $(this).find('.menu__text').text().trim();
                    let iconHtml = $(this).find('.menu__ico').html() || '';
                    let isFirstList = $(this).closest('.menu__list').is('.menu__list:eq(0)');
                    if (txt && !itemsData.some(i => normText(i.title) === normText(txt))) {
                        itemsData.push({ title: txt, icon: iconHtml, isFirstList: isFirstList });
                    }
                });

                if (!itemsData.length) {
                    let savedSort = Lampa.Storage.get('menu_sort', []);
                    savedSort.forEach(txt => {
                        if (txt) itemsData.push({ title: txt, icon: '', isFirstList: true });
                    });
                }

                if (!itemsData.length) {
                    Lampa.Noty.show('Откройте боковое меню один раз для чтения списка');
                    return;
                }

                let list = $('<div class="menu-edit-list"></div>');

                itemsData.forEach((item) => {
                    let isHidden = currentHide.some(h => normText(h) === normText(item.title));
                    let moveBtns = item.isFirstList ? `
                        <div class="menu-edit-list__move move-up selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                        <div class="menu-edit-list__move move-down selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>` : '';

                    let row = $(`<div class="menu-edit-list__item" data-title="${item.title}">
                        <div class="menu-edit-list__icon">${item.icon}</div>
                        <div class="menu-edit-list__title">${item.title}</div>
                        ${moveBtns}
                        <div class="menu-edit-list__toggle toggle selector"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1.89" y="1.78" width="21.79" height="21.79" rx="3.5" stroke="currentColor" stroke-width="3"/><path d="M7.44 12.96L10.81 16.33L18.12 9.02" stroke="currentColor" stroke-width="3" class="dot" opacity="${isHidden ? 0 : 1}" stroke-linecap="round"/></svg></div>
                    </div>`);

                    row.find('.toggle').on('hover:enter', function () {
                        let normT = normText(item.title);
                        let idx = currentHide.findIndex(h => normText(h) === normT);
                        if (idx !== -1) {
                            currentHide.splice(idx, 1);
                            row.find('.dot').attr('opacity', 1);
                        } else {
                            currentHide.push(item.title);
                            row.find('.dot').attr('opacity', 0);
                        }
                    });

                    row.find('.move-up').on('hover:enter', () => {
                        let prev = row.prev();
                        if (prev.length) row.insertBefore(prev);
                    });
                    row.find('.move-down').on('hover:enter', () => {
                        let next = row.next();
                        if (next.length) row.insertAfter(next);
                    });

                    list.append(row);
                });

                Lampa.Modal.open({
                    title: Lampa.Lang.translate('menu_editor_left'),
                    html: list,
                    size: 'small',
                    scroll_to_center: true,
                    onBack: () => {
                        let newSort = [];
                        list.find('.menu-edit-list__item').each(function () {
                            newSort.push($(this).attr('data-title'));
                        });
                        Lampa.Storage.set('menu_sort', newSort);
                        Lampa.Storage.set('menu_hide', currentHide);
                        Lampa.Modal.close();
                        applyAll();
                        Lampa.Controller.toggle('settings_component');
                    }
                });
            }

            function editTopMenu() {
                let currentHide = Lampa.Storage.get('head_menu_hide', []);
                let itemsData = [];

                $('.head .head__action').each(function () {
                    let key = getHeadActionKey($(this));
                    let name = getHeadActionName(key, $(this));
                    let svgHtml = $(this).find('svg').parent().html() || '';
                    if (key && !itemsData.some(i => i.key === key)) {
                        itemsData.push({ key: key, name: name, icon: svgHtml });
                    }
                });

                if (!itemsData.length) {
                    Lampa.Noty.show('Верхнее меню не найдено');
                    return;
                }

                let list = $('<div class="menu-edit-list"></div>');

                itemsData.forEach((item) => {
                    let isHidden = currentHide.includes(item.key);

                    let row = $(`<div class="menu-edit-list__item" data-key="${item.key}">
                        <div class="menu-edit-list__icon">${item.icon}</div>
                        <div class="menu-edit-list__title">${item.name}</div>
                        <div class="menu-edit-list__move move-up selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                        <div class="menu-edit-list__move move-down selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                        <div class="menu-edit-list__toggle toggle selector"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1.89" y="1.78" width="21.79" height="21.79" rx="3.5" stroke="currentColor" stroke-width="3"/><path d="M7.44 12.96L10.81 16.33L18.12 9.02" stroke="currentColor" stroke-width="3" class="dot" opacity="${isHidden ? 0 : 1}" stroke-linecap="round"/></svg></div>
                    </div>`);

                    row.find('.toggle').on('hover:enter', function () {
                        let idx = currentHide.indexOf(item.key);
                        if (idx !== -1) {
                            currentHide.splice(idx, 1);
                            row.find('.dot').attr('opacity', 1);
                        } else {
                            currentHide.push(item.key);
                            row.find('.dot').attr('opacity', 0);
                        }
                    });

                    row.find('.move-up').on('hover:enter', () => {
                        let prev = row.prev();
                        if (prev.length) row.insertBefore(prev);
                    });
                    row.find('.move-down').on('hover:enter', () => {
                        let next = row.next();
                        if (next.length) row.insertAfter(next);
                    });

                    list.append(row);
                });

                Lampa.Modal.open({
                    title: Lampa.Lang.translate('menu_editor_top'),
                    html: list,
                    size: 'small',
                    scroll_to_center: true,
                    onBack: () => {
                        let newSort = [];
                        list.find('.menu-edit-list__item').each(function () {
                            newSort.push($(this).attr('data-key'));
                        });
                        Lampa.Storage.set('head_menu_sort', newSort);
                        Lampa.Storage.set('head_menu_hide', currentHide);
                        Lampa.Modal.close();
                        applyAll();
                        Lampa.Controller.toggle('settings_component');
                    }
                });
            }

            function editSettingsMenu() {
                Lampa.Controller.toggle('settings');
                setTimeout(() => {
                    let settings = $('.settings');
                    let folders = settings.find('.settings-folder');

                    if (!settings.length || !folders.length) {
                        Lampa.Noty.show('Настройки еще не загружены');
                        return;
                    }

                    let currentHide = Lampa.Storage.get('settings_menu_hide', []);
                    let itemsData = [];

                    folders.each(function () {
                        let name = $(this).find('.settings-folder__name').text().trim();
                        let iconHtml = $(this).find('.settings-folder__icon').html() || '';
                        if (name && !itemsData.some(i => normText(i.name) === normText(name))) {
                            itemsData.push({ name: name, icon: iconHtml });
                        }
                    });

                    let list = $('<div class="menu-edit-list"></div>');

                    itemsData.forEach((item) => {
                        let isHidden = currentHide.some(h => normText(h) === normText(item.name));

                        let row = $(`<div class="menu-edit-list__item" data-name="${item.name}">
                            <div class="menu-edit-list__icon">${item.icon}</div>
                            <div class="menu-edit-list__title">${item.name}</div>
                            <div class="menu-edit-list__move move-up selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                            <div class="menu-edit-list__move move-down selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                            <div class="menu-edit-list__toggle toggle selector"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1.89" y="1.78" width="21.79" height="21.79" rx="3.5" stroke="currentColor" stroke-width="3"/><path d="M7.44 12.96L10.81 16.33L18.12 9.02" stroke="currentColor" stroke-width="3" class="dot" opacity="${isHidden ? 0 : 1}" stroke-linecap="round"/></svg></div>
                        </div>`);

                        row.find('.toggle').on('hover:enter', function () {
                            let normN = normText(item.name);
                            let idx = currentHide.findIndex(h => normText(h) === normN);
                            if (idx !== -1) {
                                currentHide.splice(idx, 1);
                                row.find('.dot').attr('opacity', 1);
                            } else {
                                currentHide.push(item.name);
                                row.find('.dot').attr('opacity', 0);
                            }
                        });

                        row.find('.move-up').on('hover:enter', () => {
                            let prev = row.prev();
                            if (prev.length) row.insertBefore(prev);
                        });
                        row.find('.move-down').on('hover:enter', () => {
                            let next = row.next();
                            if (next.length) row.insertAfter(next);
                        });

                        list.append(row);
                    });

                    Lampa.Modal.open({
                        title: Lampa.Lang.translate('menu_editor_settings'),
                        html: list,
                        size: 'small',
                        scroll_to_center: true,
                        onBack: () => {
                            let newSort = [];
                            list.find('.menu-edit-list__item').each(function () {
                                newSort.push($(this).attr('data-name'));
                            });
                            Lampa.Storage.set('settings_menu_sort', newSort);
                            Lampa.Storage.set('settings_menu_hide', currentHide);
                            Lampa.Modal.close();
                            applyAll();
                            Lampa.Controller.toggle('settings_component');
                        }
                    });
                }, 250);
            }

            // ==========================================
            // 6. ИНТЕГРАЦИЯ В НАСТРОЙКИ
            // ==========================================
            function addSettings() {
                try {
                    Lampa.SettingsApi.addComponent({
                        component: 'menu_editor',
                        icon: `<svg width="30" height="29" viewBox="0 0 30 29" fill="none"><path d="M18.29 5.27L2.6 20.97C2.52 21.05 2.47 21.14 2.44 21.25L0.7 28.23C0.68 28.34 0.68 28.45 0.71 28.55C0.73 28.65 0.79 28.75 0.86 28.82C0.98 28.94 1.14 29 1.3 29C1.35 29 1.4 28.99 1.45 28.98L8.43 27.24C8.54 27.22 8.64 27.16 8.72 27.08L24.41 11.39L18.29 5.27ZM28.3 3.14L26.55 1.39C25.38 0.22 23.35 0.22 22.18 1.39L20.04 3.53L26.16 9.64L28.3 7.5C28.88 6.92 29.2 6.14 29.2 5.32C29.2 4.49 28.88 3.72 28.3 3.14Z" fill="currentColor"/></svg>`,
                        name: Lampa.Lang.translate('menu_editor_title')
                    });

                    Lampa.SettingsApi.addParam({
                        component: 'menu_editor',
                        param: { name: 'edit_left_menu', type: 'button' },
                        field: { name: Lampa.Lang.translate('menu_editor_left') },
                        onChange: editLeftMenu
                    });

                    Lampa.SettingsApi.addParam({
                        component: 'menu_editor',
                        param: { name: 'edit_top_menu', type: 'button' },
                        field: { name: Lampa.Lang.translate('menu_editor_top') },
                        onChange: editTopMenu
                    });

                    Lampa.SettingsApi.addParam({
                        component: 'menu_editor',
                        param: { name: 'edit_settings_menu', type: 'button' },
                        field: { name: Lampa.Lang.translate('menu_editor_settings') },
                        onChange: editSettingsMenu
                    });

                    Lampa.SettingsApi.addParam({
                        component: 'menu_editor',
                        param: { name: 'add_reload_button', type: 'trigger', default: false },
                        field: { name: Lampa.Lang.translate('menu_editor_add_reload_button') },
                        onChange: function () { setTimeout(applyTopMenu, 100); }
                    });

                    Lampa.SettingsApi.addParam({
                        component: 'menu_editor',
                        param: { name: 'add_clear_cache_button', type: 'trigger', default: false },
                        field: { name: Lampa.Lang.translate('menu_editor_add_clear_cache_button') },
                        onChange: function () { setTimeout(applyTopMenu, 100); }
                    });

                    Lampa.SettingsApi.addParam({
                        component: 'menu_editor',
                        param: { name: 'hide_navigation_bar', type: 'trigger', default: false },
                        field: { name: Lampa.Lang.translate('menu_editor_hide_nav') },
                        onChange: function () { applyNavBar(); }
                    });
                } catch (e) {
                    console.error('[Menu Editor] Ошибка регистратора настроек:', e);
                }
            }

            addSettings();

            // ==========================================
            // 7. НАБЛЮДАТЕЛИ И ХУКИ
            // ==========================================
            let isApplying = false;
            let observerTimeout = null;

            let observer = new MutationObserver((mutations) => {
                if (isApplying) return;
                let shouldReapply = false;

                for (let i = 0; i < mutations.length; i++) {
                    let target = mutations[i].target;
                    if (target && target.closest && (target.closest('.head') || target.closest('.menu') || target.closest('.settings'))) {
                        shouldReapply = true;
                        break;
                    }
                }

                if (shouldReapply) {
                    isApplying = true;
                    clearTimeout(observerTimeout);
                    observerTimeout = setTimeout(() => {
                        applyAll();
                        isApplying = false;
                    }, 100);
                }
            });

            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }

            // Фоновый интервал для непредвиденных перерисовок
            setInterval(applyAll, 1000);

            // Слушатели событий Lampa
            Lampa.Listener.follow('menu', (e) => {
                if (e.type === 'end' || e.type === 'open') setTimeout(applyLeftMenu, 30);
            });

            Lampa.Listener.follow('activity', (e) => {
                if (e.type === 'start') setTimeout(applyAll, 50);
            });

            if (Lampa.Settings && Lampa.Settings.listener) {
                Lampa.Settings.listener.follow('open', () => {
                    setTimeout(applySettingsMenu, 150);
                });
            }
        }

        if (window.appready) {
            initialize();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') initialize();
            });
        }
    }

    startPlugin();
})();
