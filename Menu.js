(function () {
    'use strict';

    // Защита от повторного запуска разных версий
    if (window.menu_editor_v3_running) return;
    window.menu_editor_v3_running = true;

    function startPlugin() {
        console.log('[Menu Editor] Инициализация плагина...');

        function initialize() {
            console.log('[Menu Editor] Плагин успешно стартовал.');

            // Уведомление о запуске
            setTimeout(() => {
                if (window.Lampa && Lampa.Noty) {
                    Lampa.Noty.show('✅ Menu Editor запущен!');
                }
            }, 1500);

            // ==========================================
            // 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И СТИЛИ
            // ==========================================

            // Нормализация текста для точного сравнения (убирает nbsp, переносы, лишние пробелы)
            function normText(str) {
                if (!str) return '';
                return str
                    .replace(/\u00a0/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toLowerCase();
            }

            // Инъекция стилей с максимальным приоритетом
            function injectStyles() {
                if ($('#menu_editor_style').length) return;
                $('head').append(`
                    <style id="menu_editor_style">
                        /* Блокировка отображения элементов через атрибут и классы */
                        [data-me-hidden="true"],
                        html body .menu .menu__item[data-me-hidden="true"],
                        html body .head .head__action[data-me-hidden="true"],
                        html body .settings-folder[data-me-hidden="true"],
                        html body .navigation-bar[data-me-hidden="true"],
                        html body .me-hidden {
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

                        /* Стили интерфейса редактора */
                        .menu-edit-list {
                            padding: 10px 0;
                            max-height: 70vh;
                            overflow-y: auto;
                        }
                        .menu-edit-list__item {
                            display: flex;
                            align-items: center;
                            padding: 12px 15px;
                            margin-bottom: 8px;
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 8px;
                        }
                        .menu-edit-list__icon {
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                        }
                        .menu-edit-list__icon svg {
                            width: 24px;
                            height: 24px;
                        }
                        .menu-edit-list__title {
                            flex: 1;
                            font-size: 16px;
                            color: #fff;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .menu-edit-list__move,
                        .menu-edit-list__toggle {
                            width: 36px;
                            height: 36px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 8px;
                            border-radius: 6px;
                            cursor: pointer;
                            background: rgba(255, 255, 255, 0.1);
                        }
                        .menu-edit-list__toggle.active .dot {
                            opacity: 1 !important;
                        }
                    </style>
                `);
            }

            function hideEl($el) {
                if (!$el || !$el.length) return;
                $el.attr('data-me-hidden', 'true').addClass('me-hidden hide hidden');
                $el.each(function () {
                    this.style.setProperty('display', 'none', 'important');
                    this.style.setProperty('opacity', '0', 'important');
                    this.style.setProperty('visibility', 'hidden', 'important');
                });
            }

            function showEl($el) {
                if (!$el || !$el.length) return;
                $el.removeAttr('data-me-hidden').removeClass('me-hidden hide hidden');
                $el.each(function () {
                    this.style.removeProperty('display');
                    this.style.removeProperty('opacity');
                    this.style.removeProperty('visibility');
                });
            }

            injectStyles();

            // ==========================================
            // 2. ЯЗЫКОВЫЕ ПЕРЕВОДЫ
            // ==========================================
            Lampa.Lang.add({
                menu_editor_title: { ru: 'Редактирование меню', uk: 'Редагування меню', en: 'Menu Editor', zh: '菜单编辑器' },
                menu_editor_left: { ru: 'Левое меню', uk: 'Ліве меню', en: 'Left Menu', zh: '左侧菜单' },
                menu_editor_top: { ru: 'Верхнее меню', uk: 'Верхнє меню', en: 'Top Menu', zh: '顶部菜单' },
                menu_editor_settings: { ru: 'Меню настроек', uk: 'Меню налаштувань', en: 'Settings Menu', zh: '设置菜单' },
                menu_editor_hide_nav: { ru: 'Скрыть панель навигации', uk: 'Приховати панель навігації', en: 'Hide Navigation Bar', zh: '隐藏导航栏' },
                menu_editor_add_reload_button: { ru: 'Добавить кнопку перезагрузки', uk: 'Додати кнопку перезавантаження', en: 'Add reload button', zh: '添加刷新按钮' },
                menu_editor_add_clear_cache_button: { ru: 'Добавить кнопку очистки кеша', uk: 'Додати кнопку очищення кешу', en: 'Add clear cache button', zh: '添加清除缓存按钮' },
                head_action_clear_cache: { ru: 'Очистить кеш', uk: 'Очистити кеш', en: 'Clear cache', zh: '清除缓存' },
                head_action_reload: { ru: 'Перезагрузка', uk: 'Перезавантаження', en: 'Reload', zh: '重新加载' },
                head_action_search: { ru: 'Поиск', en: 'Search', uk: 'Пошук', zh: '搜索' },
                head_action_feed: { ru: 'Лента', en: 'Feed', uk: 'Стрічка', zh: '动态' },
                head_action_notice: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення', zh: '通知' },
                head_action_settings: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування', zh: '设置' },
                head_action_profile: { ru: 'Профиль', en: 'Profile', uk: 'Профіль', zh: '个人资料' },
                head_action_fullscreen: { ru: 'Полный экран', en: 'Fullscreen', uk: 'Повноекранний режим', zh: '全屏' },
                head_action_broadcast: { ru: 'Трансляции', en: 'Broadcast', uk: 'Трансляції', zh: '直播' },
                no_name: { ru: 'Элемент без названия', en: 'Unnamed element', uk: 'Елемент без назви', zh: '未命名元素' }
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

                let titleText = $el.attr('title') || $el.find('title').text();
                if (titleText) return 'title--' + normText(titleText);

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
            // 4. ПРИМЕНЕНИЕ НАСТРОЕК (ПРИНУДИТЕЛЬНОЕ СКРЫТИЕ)
            // ==========================================
            function applyLeftMenu() {
                let sort = Lampa.Storage.get('menu_sort', []);
                let hide = Lampa.Storage.get('menu_hide', []);
                let menu = $('.menu');
                if (!menu.length) return;

                let items = menu.find('.menu__item');
                if (!items.length) return;

                // Сброс видимости перед проверкой
                items.each(function () {
                    let $this = $(this);
                    let txt = normText($this.find('.menu__text').text());
                    let shouldHide = hide.some(h => normText(h) === txt && txt !== '');

                    if (shouldHide) {
                        hideEl($this);
                    } else {
                        showEl($this);
                    }
                });

                // Сортировка главного списка
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

                // Создание кнопки "Очистить кеш"
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

                // Создание кнопки "Перезагрузка"
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
                    let shouldHide = hide.some(h => normText(h) === name && name !== '');

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
            // 5. ОКНА РЕДАКТИРОВАНИЯ И СОХРАНЕНИЕ
            // ==========================================
            function editLeftMenu() {
                let list = $('<div class="menu-edit-list"></div>');
                let menuItems = $('.menu').find('.menu__item');

                if (!menuItems.length) {
                    Lampa.Noty.show('Левое меню не найдено на экране');
                    return;
                }

                menuItems.each(function () {
                    let item_orig = $(this);
                    let item_clone = $(this).clone();
                    let rawText = item_clone.find('.menu__text').text().trim();
                    if (!rawText) return;

                    let isFirstSection = item_orig.closest('.menu__list').is('.menu__list:eq(0)');

                    let moveButtons = isFirstSection ? `
                        <div class="menu-edit-list__move move-up selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                        <div class="menu-edit-list__move move-down selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>` : '';

                    let item_sort = $(`<div class="menu-edit-list__item" data-name="${rawText}">
                            <div class="menu-edit-list__icon"></div>
                            <div class="menu-edit-list__title">${rawText}</div>
                            ${moveButtons}
                            <div class="menu-edit-list__toggle toggle selector"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1.89" y="1.78" width="21.79" height="21.79" rx="3.5" stroke="currentColor" stroke-width="3"/><path d="M7.44 12.96L10.81 16.33L18.12 9.02" stroke="currentColor" stroke-width="3" class="dot" opacity="0" stroke-linecap="round"/></svg></div>
                        </div>`);

                    item_sort.find('.menu-edit-list__icon').append(item_clone.find('.menu__ico').html());

                    if (isFirstSection) {
                        item_sort.find('.move-up').on('hover:enter', () => {
                            let prev = item_sort.prev();
                            while (prev.length && prev.data('isSecondSection')) prev = prev.prev();
                            if (prev.length) {
                                item_sort.insertBefore(prev);
                                item_orig.insertBefore(item_orig.prev());
                            }
                        });
                        item_sort.find('.move-down').on('hover:enter', () => {
                            let next = item_sort.next();
                            while (next.length && next.data('isSecondSection')) next = next.next();
                            if (next.length) {
                                item_sort.insertAfter(next);
                                item_orig.insertAfter(item_orig.next());
                            }
                        });
                    } else {
                        item_sort.data('isSecondSection', true);
                    }

                    let isHidden = item_orig.attr('data-me-hidden') === 'true' || item_orig.hasClass('me-hidden');
                    item_sort.find('.dot').attr('opacity', isHidden ? 0 : 1);

                    item_sort.find('.toggle').on('hover:enter', () => {
                        let curHidden = item_orig.attr('data-me-hidden') === 'true' || item_orig.hasClass('me-hidden');
                        if (curHidden) {
                            showEl(item_orig);
                            item_sort.find('.dot').attr('opacity', 1);
                        } else {
                            hideEl(item_orig);
                            item_sort.find('.dot').attr('opacity', 0);
                        }
                    });

                    list.append(item_sort);
                });

                Lampa.Modal.open({
                    title: Lampa.Lang.translate('menu_editor_left'),
                    html: list,
                    size: 'small',
                    scroll_to_center: true,
                    onBack: () => {
                        saveLeftMenu();
                        Lampa.Modal.close();
                        Lampa.Controller.toggle('settings_component');
                    }
                });
            }

            function editTopMenu() {
                let list = $('<div class="menu-edit-list"></div>');
                let topItems = $('.head').find('.head__action');

                if (!topItems.length) {
                    Lampa.Noty.show('Верхнее меню не найдено');
                    return;
                }

                topItems.each(function () {
                    let item_orig = $(this);
                    let item_clone = $(this).clone();
                    let key = getHeadActionKey(item_orig);
                    let displayName = getHeadActionName(key, item_orig);

                    let item_sort = $(`<div class="menu-edit-list__item" data-key="${key}">
                            <div class="menu-edit-list__icon"></div>
                            <div class="menu-edit-list__title">${displayName}</div>
                            <div class="menu-edit-list__move move-up selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                            <div class="menu-edit-list__move move-down selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                            <div class="menu-edit-list__toggle toggle selector"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1.89" y="1.78" width="21.79" height="21.79" rx="3.5" stroke="currentColor" stroke-width="3"/><path d="M7.44 12.96L10.81 16.33L18.12 9.02" stroke="currentColor" stroke-width="3" class="dot" opacity="0" stroke-linecap="round"/></svg></div>
                        </div>`);

                    let svg = item_clone.find('svg');
                    if (svg.length) item_sort.find('.menu-edit-list__icon').append(svg.clone());

                    item_sort.find('.move-up').on('hover:enter', () => {
                        let prev = item_sort.prev();
                        if (prev.length) { item_sort.insertBefore(prev); item_orig.insertBefore(item_orig.prev()); }
                    });
                    item_sort.find('.move-down').on('hover:enter', () => {
                        let next = item_sort.next();
                        if (next.length) { item_sort.insertAfter(next); item_orig.insertAfter(item_orig.next()); }
                    });

                    let isHidden = item_orig.attr('data-me-hidden') === 'true' || item_orig.hasClass('me-hidden');
                    item_sort.find('.dot').attr('opacity', isHidden ? 0 : 1);

                    item_sort.find('.toggle').on('hover:enter', () => {
                        let curHidden = item_orig.attr('data-me-hidden') === 'true' || item_orig.hasClass('me-hidden');
                        if (curHidden) {
                            showEl(item_orig);
                            item_sort.find('.dot').attr('opacity', 1);
                        } else {
                            hideEl(item_orig);
                            item_sort.find('.dot').attr('opacity', 0);
                        }
                    });

                    list.append(item_sort);
                });

                Lampa.Modal.open({
                    title: Lampa.Lang.translate('menu_editor_top'),
                    html: list,
                    size: 'small',
                    scroll_to_center: true,
                    onBack: () => {
                        saveTopMenu();
                        Lampa.Modal.close();
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
                        Lampa.Noty.show('Меню настроек еще не загружено');
                        return;
                    }

                    let list = $('<div class="menu-edit-list"></div>');
                    folders.each(function () {
                        let item_orig = $(this);
                        let item_clone = $(this).clone();
                        let name = item_clone.find('.settings-folder__name').text().trim();

                        let item_sort = $(`<div class="menu-edit-list__item" data-name="${name}">
                                <div class="menu-edit-list__icon"></div>
                                <div class="menu-edit-list__title">${name}</div>
                                <div class="menu-edit-list__move move-up selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                                <div class="menu-edit-list__move move-down selector"><svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></div>
                                <div class="menu-edit-list__toggle toggle selector"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="1.89" y="1.78" width="21.79" height="21.79" rx="3.5" stroke="currentColor" stroke-width="3"/><path d="M7.44 12.96L10.81 16.33L18.12 9.02" stroke="currentColor" stroke-width="3" class="dot" opacity="0" stroke-linecap="round"/></svg></div>
                            </div>`);

                        let icon = item_clone.find('.settings-folder__icon svg, .settings-folder__icon img');
                        if (icon.length) item_sort.find('.menu-edit-list__icon').append(icon.clone());

                        item_sort.find('.move-up').on('hover:enter', () => {
                            let prev = item_sort.prev();
                            if (prev.length) { item_sort.insertBefore(prev); item_orig.insertBefore(item_orig.prev()); }
                        });
                        item_sort.find('.move-down').on('hover:enter', () => {
                            let next = item_sort.next();
                            if (next.length) { item_sort.insertAfter(next); item_orig.insertAfter(item_orig.next()); }
                        });

                        let isHidden = item_orig.attr('data-me-hidden') === 'true' || item_orig.hasClass('me-hidden');
                        item_sort.find('.dot').attr('opacity', isHidden ? 0 : 1);

                        item_sort.find('.toggle').on('hover:enter', () => {
                            let curHidden = item_orig.attr('data-me-hidden') === 'true' || item_orig.hasClass('me-hidden');
                            if (curHidden) {
                                showEl(item_orig);
                                item_sort.find('.dot').attr('opacity', 1);
                            } else {
                                hideEl(item_orig);
                                item_sort.find('.dot').attr('opacity', 0);
                            }
                        });

                        list.append(item_sort);
                    });

                    Lampa.Modal.open({
                        title: Lampa.Lang.translate('menu_editor_settings'),
                        html: list,
                        size: 'small',
                        scroll_to_center: true,
                        onBack: () => {
                            saveSettingsMenu();
                            Lampa.Modal.close();
                            Lampa.Controller.toggle('settings_component');
                        }
                    });
                }, 300);
            }

            function saveLeftMenu() {
                let sort = [];
                let hide = [];

                $('.menu .menu__list:eq(0) .menu__item').each(function () {
                    let txt = $(this).find('.menu__text').text().trim();
                    if (txt) sort.push(txt);
                });

                $('.menu .menu__item').each(function () {
                    let txt = $(this).find('.menu__text').text().trim();
                    let isHidden = $(this).attr('data-me-hidden') === 'true' || $(this).hasClass('me-hidden');
                    if (txt && isHidden) hide.push(txt);
                });

                Lampa.Storage.set('menu_sort', sort);
                Lampa.Storage.set('menu_hide', hide);
                applyLeftMenu();
            }

            function saveTopMenu() {
                let sort = [];
                let hide = [];

                $('.head__action').each(function () {
                    let key = getHeadActionKey($(this));
                    if (key) {
                        sort.push(key);
                        let isHidden = $(this).attr('data-me-hidden') === 'true' || $(this).hasClass('me-hidden');
                        if (isHidden) hide.push(key);
                    }
                });

                Lampa.Storage.set('head_menu_sort', sort);
                Lampa.Storage.set('head_menu_hide', hide);
                applyTopMenu();
            }

            function saveSettingsMenu() {
                let sort = [];
                let hide = [];

                $('.settings-folder').each(function () {
                    let name = $(this).find('.settings-folder__name').text().trim();
                    if (name) {
                        sort.push(name);
                        let isHidden = $(this).attr('data-me-hidden') === 'true' || $(this).hasClass('me-hidden');
                        if (isHidden) hide.push(name);
                    }
                });

                Lampa.Storage.set('settings_menu_sort', sort);
                Lampa.Storage.set('settings_menu_hide', hide);
                applySettingsMenu();
            }

            // ==========================================
            // 6. ИНТЕГРАЦИЯ В НАСТРОЙКИ LAMPA
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

                    console.log('[Menu Editor] Раздел настроек успешно зарегестрирован');
                } catch (e) {
                    console.error('[Menu Editor] Ошибка регистрации настроек:', e);
                }
            }

            addSettings();

            // ==========================================
            // 7. НАБЛЮДАТЕЛИ СОБЫТИЙ И ТАЙМЕРЫ
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
                    }, 150);
                }
            });

            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true, attributes: false });
            }

            // Фоновый интервал проверки для гарантии
            setInterval(applyAll, 1200);

            // Подписка на системные события Lampa
            Lampa.Listener.follow('menu', (e) => {
                if (e.type === 'end' || e.type === 'open') setTimeout(applyLeftMenu, 50);
            });

            Lampa.Listener.follow('activity', (e) => {
                if (e.type === 'start') setTimeout(applyAll, 100);
            });

            if (Lampa.Settings && Lampa.Settings.listener) {
                Lampa.Settings.listener.follow('open', () => {
                    setTimeout(applySettingsMenu, 200);
                });
            }
        }

        // Запуск после готовности Lampa
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
