(function() {
    'use strict';

    var LAMPAC_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.331 14.644l-13.794-13.831 17.55 10.075zM2.938 0c-0.813 0.425-1.356 1.2-1.356 2.206v27.581c0 1.006 0.544 1.781 1.356 2.206l16.038-16zM29.512 14.1l-3.681-2.131-4.106 4.031 4.106 4.031 3.756-2.131c1.125-0.893 1.125-2.906-0.075-3.8zM6.538 31.188l17.55-10.075-3.756-3.756z" fill="currentColor"></path></svg>';

    var EXCLUDED_CLASSES = ['button--play', 'button--edit-order'];

    function t(key) {
        var translated = Lampa.Lang.translate(key);
        return translated && translated !== key ? translated : key.replace('custom_interface_plugin_', '');
    }

    var DEFAULT_GROUPS = [
        { name: 'online', patterns: ['online', 'lampac', 'modss', 'showy'] },
        { name: 'torrent', patterns: ['torrent'] },
        { name: 'trailer', patterns: ['trailer', 'rutube'] },
        { name: 'favorite', patterns: ['favorite'] },
        { name: 'subscribe', patterns: ['subscribe'] },
        { name: 'book', patterns: ['book'] },
        { name: 'reaction', patterns: ['reaction'] }
    ];

    var currentButtons = [];
    var allButtonsCache = [];
    var allButtonsOriginal = [];
    var currentContainer = null;

    Lampa.Lang.add({
        custom_interface_plugin_button_order: {
            uk: 'Керування кнопками картки',
            ru: 'Управление кнопками карточки',
            en: 'Card button settings'
        },
        custom_interface_plugin_button_view: {
            uk: 'Підписи біля іконок',
            ru: 'Подписи рядом с иконками',
            en: 'Labels beside icons'
        },
        custom_interface_plugin_standard: {
            uk: 'Як у Lampa',
            ru: 'Как в Lampa',
            en: 'Lampa default'
        },
        custom_interface_plugin_icons_only: {
            uk: 'Тільки іконки',
            ru: 'Только иконки',
            en: 'Icons only'
        },
        custom_interface_plugin_with_text: {
            uk: 'Іконки та підписи',
            ru: 'Иконки и подписи',
            en: 'Icons and labels'
        },
        custom_interface_plugin_reset_default: {
            uk: 'Скинути налаштування кнопок',
            ru: 'Сбросить настройки кнопок',
            en: 'Reset button settings'
        },
        custom_interface_plugin_button_editor: {
            uk: 'Показувати кнопку налаштування на картці',
            ru: 'Показывать кнопку настройки на карточке',
            en: 'Show button settings on card'
        },
        custom_interface_plugin_options: {
            uk: 'Додатково',
            ru: 'Дополнительно',
            en: 'More actions'
        },
        custom_interface_plugin_online: {
            uk: 'Онлайн',
            ru: 'Онлайн',
            en: 'Online'
        },
        custom_interface_plugin_torrent: {
            uk: 'Торенти',
            ru: 'Торренты',
            en: 'Torrents'
        },
        custom_interface_plugin_trailer: {
            uk: 'Трейлери',
            ru: 'Трейлеры',
            en: 'Trailers'
        },
        custom_interface_plugin_favorite: {
            uk: 'Обране',
            ru: 'Избранное',
            en: 'Favorites'
        },
        custom_interface_plugin_subscribe: {
            uk: 'Підписка',
            ru: 'Подписка',
            en: 'Subscriptions'
        },
        custom_interface_plugin_book: {
            uk: 'Закладки',
            ru: 'Закладки',
            en: 'Bookmarks'
        },
        custom_interface_plugin_reaction: {
            uk: 'Реакції',
            ru: 'Реакции',
            en: 'Reactions'
        },
        custom_interface_plugin_button_unknown: {
            uk: 'Кнопка без назви',
            ru: 'Кнопка без названия',
            en: 'Unnamed button'
        },
        custom_interface_plugin_editor_help: {
            uk: 'Стрілки змінюють порядок. Позначка праворуч показує або приховує кнопку.',
            ru: 'Стрелки меняют порядок. Переключатель справа показывает или скрывает кнопку. Нажмите на настройку ниже, чтобы изменить её значение.',
            en: 'Arrows change the order. The switch on the right shows or hides a button. Select a setting below to change it.'
        },
        custom_interface_plugin_editor_enabled_description: {
            uk: 'Показувати кнопку з повзунками у картці фільму та серіалу.',
            ru: 'Показывать кнопку с ползунками на карточке фильма и сериала.',
            en: 'Show the settings button on movie and series cards.'
        },
        custom_interface_plugin_button_editor_action: {
            uk: 'Налаштувати кнопки',
            ru: 'Настроить кнопки',
            en: 'Arrange buttons'
        },
        custom_interface_plugin_button_view_description: {
            uk: 'Оберіть, чи показувати текст поруч з іконкою.',
            ru: 'Выберите, показывать ли подпись рядом с иконкой.',
            en: 'Choose whether labels appear beside button icons.'
        },
        custom_interface_plugin_appearance_settings: {
            uk: 'Вигляд кнопок',
            ru: 'Вид кнопок',
            en: 'Button appearance'
        },
        custom_interface_plugin_button_size: {
            uk: 'Розмір кнопок',
            ru: 'Размер кнопок',
            en: 'Button size'
        },
        custom_interface_plugin_button_size_description: {
            uk: 'Змініть розмір кнопок на картці фільму або серіалу.',
            ru: 'Измените размер кнопок на карточке фильма или сериала.',
            en: 'Change the button size on movie and series cards.'
        },
        custom_interface_plugin_size_compact: {
            uk: 'Компактний',
            ru: 'Компактный',
            en: 'Compact'
        },
        custom_interface_plugin_size_normal: {
            uk: 'Звичайний',
            ru: 'Обычный',
            en: 'Regular'
        },
        custom_interface_plugin_size_large: {
            uk: 'Великий',
            ru: 'Крупный',
            en: 'Large'
        },
        custom_interface_plugin_button_style: {
            uk: 'Стиль кнопок',
            ru: 'Стиль кнопок',
            en: 'Button style'
        },
        custom_interface_plugin_button_style_description: {
            uk: 'Оберіть оформлення всіх кнопок на картці.',
            ru: 'Выберите оформление всех кнопок на карточке.',
            en: 'Choose a look for all buttons on the card.'
        },
        custom_interface_plugin_style_classic: { uk: 'Класичний', ru: 'Классический', en: 'Classic' },
        custom_interface_plugin_style_glass: { uk: 'Скло', ru: 'Стекло', en: 'Glass' },
        custom_interface_plugin_style_pill: { uk: 'Пілюлі', ru: 'Пилюли', en: 'Pills' },
        custom_interface_plugin_style_outline: { uk: 'Контур', ru: 'Контур', en: 'Outline' },
        custom_interface_plugin_style_accent: { uk: 'Акцент', ru: 'Акцент', en: 'Accent' },
        custom_interface_plugin_style_midnight: { uk: 'Нічний', ru: 'Ночной', en: 'Midnight' },
        custom_interface_plugin_style_soft: { uk: 'М’який', ru: 'Мягкий', en: 'Soft' },
        custom_interface_plugin_style_neon: { uk: 'Неон', ru: 'Неон', en: 'Neon' },
        custom_interface_plugin_style_gradient: { uk: 'Градієнт', ru: 'Градиент', en: 'Gradient' },
        custom_interface_plugin_style_minimal: { uk: 'Мінімалістичний', ru: 'Минималистичный', en: 'Minimal' },
        custom_interface_plugin_button_layout: {
            uk: 'Розташування',
            ru: 'Расположение',
            en: 'Layout'
        },
        custom_interface_plugin_button_layout_description: {
            uk: 'Оберіть ряд, сітку або вертикальний список.',
            ru: 'Выберите ряд, сетку или вертикальный список.',
            en: 'Choose a row, grid, or vertical list.'
        },
        custom_interface_plugin_layout_row: { uk: 'Ряд', ru: 'Ряд', en: 'Row' },
        custom_interface_plugin_layout_grid: { uk: 'Сітка 2×', ru: 'Сетка 2×', en: '2-column grid' },
        custom_interface_plugin_layout_column: { uk: 'Стовпець', ru: 'Столбец', en: 'Column' },
        custom_interface_plugin_move_up: {
            uk: 'Перемістити вище',
            ru: 'Переместить выше',
            en: 'Move up'
        },
        custom_interface_plugin_move_down: {
            uk: 'Перемістити нижче',
            ru: 'Переместить ниже',
            en: 'Move down'
        },
        custom_interface_plugin_show_button: {
            uk: 'Показати кнопку',
            ru: 'Показать кнопку',
            en: 'Show button'
        },
        custom_interface_plugin_hide_button: {
            uk: 'Приховати кнопку',
            ru: 'Скрыть кнопку',
            en: 'Hide button'
        }
    });

    function findButton(btnId) {
        var btn = allButtonsOriginal.find(function(b) { return getButtonId(b) === btnId; });
        if (!btn) {
            btn = allButtonsCache.find(function(b) { return getButtonId(b) === btnId; });
        }
        return btn || null;
    }

    function getCustomOrder() {
        return Lampa.Storage.get('button_custom_order', []) || [];
    }

    function setCustomOrder(order) {
        Lampa.Storage.set('button_custom_order', order || []);
    }

    function getHiddenButtons() {
        return Lampa.Storage.get('button_hidden', []) || [];
    }

    function setHiddenButtons(hidden) {
        Lampa.Storage.set('button_hidden', hidden || []);
    }

    function getStableButtonKey(button) {
        var attrs = ['data-id', 'data-action', 'data-provider', 'data-source', 'data-name', 'aria-label', 'title'];
        var values = [];

        attrs.forEach(function(name) {
            var value = button.attr(name);
            if (value) {
                values.push(name.replace('data-', '') + '-' + String(value).trim().replace(/\s+/g, '_'));
            }
        });

        return values.join('_');
    }

    function getButtonId(button) {
        if (!button || !button.attr) return 'unknown';
        var classes = button.attr('class') || '';
        var text = button.find('span').text().trim().replace(/\s+/g, '_');
        var subtitle = button.attr('data-subtitle') || '';
        var stableKey = getStableButtonKey(button);
        var id;

        if (classes.indexOf('modss') !== -1 || /\bmods?\b/i.test(text.replace(/_/g, ' '))) {
            id = 'modss_online_button';
            return stableKey ? id + '_' + stableKey : id;
        }
        if (classes.indexOf('showy') !== -1 || /\bshowy\b/i.test(text.replace(/_/g, ' '))) {
            id = 'showy_online_button';
            return stableKey ? id + '_' + stableKey : id;
        }
        if (classes.indexOf('button--options') !== -1) {
            id = 'button--options';
            return stableKey ? id + '_' + stableKey : id;
        }

        var viewClasses = classes.split(' ').filter(function(c) { return c.indexOf('view--') === 0 || c.indexOf('button--') === 0; }).join('_');
        if (!viewClasses && !text) {
            id = 'button_unknown';
        } else {
            id = viewClasses + '_' + text;
        }

        if (subtitle) {
            id = id + '_' + subtitle.replace(/\s+/g, '_').substring(0, 30);
        }

        return stableKey ? id + '_' + stableKey : id;
    }

    function getButtonType(button) {
        if (!button) return 'other';
        var classes = button.attr('class') || '';
        for (var i = 0; i < DEFAULT_GROUPS.length; i++) {
            var group = DEFAULT_GROUPS[i];
            for (var j = 0; j < group.patterns.length; j++) {
                if (classes.indexOf(group.patterns[j]) !== -1) {
                    return group.name;
                }
            }
        }
        return 'other';
    }

    function isExcluded(button) {
        if (!button) return true;
        var classes = button.attr('class') || '';
        for (var i = 0; i < EXCLUDED_CLASSES.length; i++) {
            if (classes.indexOf(EXCLUDED_CLASSES[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function categorizeButtons(container) {
        if (!container || !container.find) return { online: [], torrent: [], trailer: [], favorite: [], subscribe: [], book: [], reaction: [], other: [] };
        var allButtons = container.find('.full-start__button').not('.button--edit-order, .button--play');
        var categories = { online: [], torrent: [], trailer: [], favorite: [], subscribe: [], book: [], reaction: [], other: [] };
        allButtons.each(function() {
            var $btn = $(this);
            if (isExcluded($btn)) return;
            var type = getButtonType($btn);
            if (type === 'online' && $btn.hasClass('lampac--button') && !$btn.hasClass('modss--button') && !$btn.hasClass('showy--button')) {
                var svgElement = $btn.find('svg').first();
                if (!svgElement.length) $btn.prepend(LAMPAC_ICON);
            }
            // Додаємо текст "Опції" до кнопки з трьома крапками
            if ($btn.hasClass('button--options') && $btn.find('span').length === 0) {
                $btn.append('<span>' + t('custom_interface_plugin_options') + '</span>');
            }
            if (categories[type]) {
                categories[type].push($btn);
            } else {
                categories.other.push($btn);
            }
        });
        return categories;
    }

    function collectButtons(container) {
        var categories = categorizeButtons(container);
        var grouped = []
            .concat(categories.online || [])
            .concat(categories.torrent || [])
            .concat(categories.trailer || [])
            .concat(categories.favorite || [])
            .concat(categories.subscribe || [])
            .concat(categories.book || [])
            .concat(categories.reaction || [])
            .concat(categories.other || []);
        var seen = Object.create(null);

        return grouped.filter(function(button) {
            if (!button) return false;

            var id = getButtonId(button);
            if (seen[id]) return false;

            seen[id] = true;
            return true;
        });
    }

    function sortByCustomOrder(buttons) {
        if (!buttons || !Array.isArray(buttons)) return [];
        var customOrder = getCustomOrder();
        var priority = [];
        var regular = [];
        buttons.forEach(function(btn) {
            var id = getButtonId(btn);
            if (id === 'modss_online_button' || id === 'showy_online_button') {
                priority.push(btn);
            } else {
                regular.push(btn);
            }
        });
        priority.sort(function(a, b) {
            var idA = getButtonId(a);
            var idB = getButtonId(b);
            if (idA === 'modss_online_button') return -1;
            if (idB === 'modss_online_button') return 1;
            if (idA === 'showy_online_button') return -1;
            if (idB === 'showy_online_button') return 1;
            return 0;
        });
        if (!customOrder.length) {
            regular.sort(function(a, b) {
                var typeOrder = ['online', 'torrent', 'trailer', 'favorite', 'subscribe', 'book', 'reaction', 'other'];
                var typeA = getButtonType(a);
                var typeB = getButtonType(b);
                var indexA = typeOrder.indexOf(typeA);
                var indexB = typeOrder.indexOf(typeB);
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                return indexA - indexB;
            });
            return priority.concat(regular);
        }
        var sorted = [];
        var remaining = regular.slice();
        customOrder.forEach(function(id) {
            for (var i = 0; i < remaining.length; i++) {
                if (getButtonId(remaining[i]) === id) {
                    sorted.push(remaining[i]);
                    remaining.splice(i, 1);
                    break;
                }
            }
        });
        return priority.concat(sorted, remaining);
    }

    function applyHiddenButtons(buttons) {
        if (!buttons) return;
        var hidden = getHiddenButtons();
        buttons.forEach(function(btn) {
            if (btn) {
                var id = getButtonId(btn);
                btn.toggleClass('hidden', hidden.indexOf(id) !== -1);
            }
        });
    }

    function applyButtonAnimation(buttons) {
        if (!buttons) return;
        buttons.forEach(function(btn, index) {
            if (btn) {
                btn.css({
                    'opacity': '0',
                    'animation': 'button-fade-in 0.4s ease forwards',
                    'animation-delay': (index * 0.08) + 's'
                });
            }
        });
    }

    function createEditButton() {
        var btn = $('<div class="full-start__button selector button--edit-order" style="order: 9999;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 29" fill="none"><use xlink:href="#sprite-edit"></use></svg>' +
            '<span>' + t('custom_interface_plugin_button_editor_action') + '</span>' +
            '</div>');
        btn.attr('title', t('custom_interface_plugin_button_editor_action'));
        btn.on('hover:enter', function() {
            openEditDialog();
        });
        return btn;
    }

    function saveOrder() {
        var order = [];
        var seen = Object.create(null);
        if (currentButtons) {
            currentButtons.forEach(function(btn) {
                if (!btn) return;

                var id = getButtonId(btn);
                if (seen[id]) return;

                seen[id] = true;
                order.push(id);
            });
        }
        setCustomOrder(order);
    }

    function applyChanges() {
        if (!currentContainer) return;
        var allButtons = sortByCustomOrder(collectButtons(currentContainer));
        allButtonsCache = allButtons;
        currentButtons = allButtons;
        var targetContainer = currentContainer.find('.full-start-new__buttons');
        if (!targetContainer || !targetContainer.length) return;
        targetContainer.find('.full-start__button').not('.button--edit-order').detach();
        var visibleButtons = [];
        currentButtons.forEach(function(btn) {
            if (btn) {
                targetContainer.append(btn);
                if (!btn.hasClass('hidden')) visibleButtons.push(btn);
            }
        });
        applyButtonAnimation(visibleButtons);
        var editBtn = targetContainer.find('.button--edit-order');
        if (editBtn.length) {
            editBtn.detach();
            targetContainer.append(editBtn);
        }
        applyHiddenButtons(currentButtons);
        applyButtonViewMode(Lampa.Storage.get('buttons_viewmode', 'default'));
        applyButtonAppearance();
        saveOrder();
        setTimeout(function() {
            if (currentContainer) {
                setupButtonNavigation(currentContainer);
            }
        }, 100);
    }

    function capitalize(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getButtonDisplayName(btn, allButtons) {
        if (!btn) return '';
        var text = btn.find('span').text().trim();
        var classes = btn.attr('class') || '';
        var subtitle = btn.attr('data-subtitle') || '';
        // Якщо це кнопка Options — повертаємо перекладений текст
        if (classes.indexOf('button--options') !== -1) {
            return t('custom_interface_plugin_options');
        }
        if (!text) {
            var viewClass = classes.split(' ').find(function(c) { return c.indexOf('view--') === 0 || c.indexOf('button--') === 0; });
            if (viewClass) {
                text = viewClass.replace('view--', '').replace('button--', '').replace(/_/g, ' ');
                text = capitalize(text);
            } else {
                text = t('custom_interface_plugin_button_unknown');
            }
            return text;
        }
        var sameTextCount = 0;
        if (allButtons) {
            allButtons.forEach(function(otherBtn) {
                if (otherBtn && otherBtn.find('span').text().trim() === text) {
                    sameTextCount++;
                }
            });
        }
        if (sameTextCount > 1) {
            if (subtitle) {
                return text + ' — ' + subtitle.substring(0, 30);
            }
            var viewClass = classes.split(' ').find(function(c) { return c.indexOf('view--') === 0 || c.indexOf('button--') === 0; });
            if (viewClass) {
                var identifier = viewClass.replace('view--', '').replace(/_/g, ' ');
                identifier = identifier.replace('button--', '');
                identifier = capitalize(identifier);
                return text + ' — ' + identifier;
            }
        }
        return text;
    }

    function openEditDialog() {
        if (currentContainer) {
            var allButtons = sortByCustomOrder(collectButtons(currentContainer));
            allButtonsCache = allButtons;
            currentButtons = allButtons;
        }
        var list = $('<div class="menu-edit-list"></div>');
        var hidden = getHiddenButtons();
        list.append($('<div class="menu-edit-list__help"></div>').text(t('custom_interface_plugin_editor_help')));

        function createSettingItem(label, description, storageName, defaultValue, values, onChange) {
            var item = $('<div class="menu-edit-list__setting selector">' +
                '<div class="menu-edit-list__setting-info">' +
                '<div class="menu-edit-list__setting-title"></div>' +
                '<div class="menu-edit-list__setting-description"></div>' +
                '</div>' +
                '<div class="menu-edit-list__setting-value"></div>' +
                '<div class="menu-edit-list__setting-arrow">›</div>' +
                '</div>');

            item.find('.menu-edit-list__setting-title').text(label);
            item.find('.menu-edit-list__setting-description').text(description);
            item.attr('title', description);

            function updateValue() {
                var currentValue = Lampa.Storage.get(storageName, defaultValue);
                var selected = values.find(function(option) {
                    return option.value === currentValue;
                }) || values[0];
                item.find('.menu-edit-list__setting-value').text(selected.label);
            }

            item.on('hover:enter', function() {
                var currentValue = Lampa.Storage.get(storageName, defaultValue);
                var index = values.findIndex(function(option) {
                    return option.value === currentValue;
                });
                var next = values[(index + 1 + values.length) % values.length];
                Lampa.Storage.set(storageName, next.value);
                updateValue();
                if (onChange) onChange(next.value);
            });

            updateValue();
            return item;
        }

        function createButtonItem(btn) {
            if (!btn) return $();
            var displayName = getButtonDisplayName(btn, currentButtons);
            var icon = btn.find('svg').first().clone();
            var btnId = getButtonId(btn);
            var isHidden = hidden.indexOf(btnId) !== -1;
            var item = $('<div class="menu-edit-list__item">' +
                '<div class="menu-edit-list__icon"></div>' +
                '<div class="menu-edit-list__text">' +
                '<div class="menu-edit-list__title"></div>' +
                '</div>' +
                '<div class="menu-edit-list__move move-up selector">' +
                '<svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M2 12L11 3L20 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>' +
                '</svg>' +
                '</div>' +
                '<div class="menu-edit-list__move move-down selector">' +
                '<svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M2 2L11 11L20 2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>' +
                '</svg>' +
                '</div>' +
                '<div class="menu-edit-list__toggle toggle selector">' +
                '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<rect x="1.89111" y="1.78369" width="21.793" height="21.793" rx="3.5" stroke="currentColor" stroke-width="3"/>' +
                '<path d="M7.44873 12.9658L10.8179 16.3349L18.1269 9.02588" stroke="currentColor" stroke-width="3" class="dot" opacity="' + (isHidden ? '0' : '1') + '" stroke-linecap="round"/>' +
                '</svg>' +
                '</div>' +
                '</div>');
            item.toggleClass('menu-edit-list__item-hidden', isHidden);
            item.find('.menu-edit-list__title').text(displayName);
            item.find('.menu-edit-list__icon').append(icon);
            item.data('button', btn);
            item.data('buttonId', btnId);
            item.find('.move-up').attr('title', t('custom_interface_plugin_move_up'));
            item.find('.move-down').attr('title', t('custom_interface_plugin_move_down'));
            item.find('.toggle').attr('title', t(isHidden ? 'custom_interface_plugin_show_button' : 'custom_interface_plugin_hide_button'));
            item.find('.move-up').on('hover:enter', function() {
                var prev = item.prev();
                if (prev.length && !prev.hasClass('menu-edit-list__help') && !prev.hasClass('folder-reset-button')) {
                    item.insertBefore(prev);
                    var btnIndex = currentButtons.indexOf(btn);
                    if (btnIndex > 0) {
                        currentButtons.splice(btnIndex, 1);
                        currentButtons.splice(btnIndex - 1, 0, btn);
                    }
                    saveOrder();
                }
            });
            item.find('.move-down').on('hover:enter', function() {
                var next = item.next();
                if (next.length && !next.hasClass('folder-reset-button')) {
                    item.insertAfter(next);
                    var btnIndex = currentButtons.indexOf(btn);
                    if (btnIndex < currentButtons.length - 1) {
                        currentButtons.splice(btnIndex, 1);
                        currentButtons.splice(btnIndex + 1, 0, btn);
                    }
                    saveOrder();
                }
            });
            item.find('.toggle').on('hover:enter', function() {
                var isNowHidden = !item.hasClass('menu-edit-list__item-hidden');
                item.toggleClass('menu-edit-list__item-hidden', isNowHidden);
                btn.toggleClass('hidden', isNowHidden);
                item.find('.dot').attr('opacity', isNowHidden ? '0' : '1');
                item.find('.toggle').attr('title', t(isNowHidden ? 'custom_interface_plugin_show_button' : 'custom_interface_plugin_hide_button'));
                var hiddenList = getHiddenButtons();
                var index = hiddenList.indexOf(btnId);
                if (isNowHidden && index === -1) {
                    hiddenList.push(btnId);
                } else if (!isNowHidden && index !== -1) {
                    hiddenList.splice(index, 1);
                }
                setHiddenButtons(hiddenList);
            });
            return item;
        }

        if (currentButtons) {
            currentButtons.forEach(function(btn) {
                list.append(createButtonItem(btn));
            });
        }

        list.append($('<div class="menu-edit-list__section"></div>').text(t('custom_interface_plugin_appearance_settings')));
        list.append(createSettingItem(
            t('custom_interface_plugin_button_view'),
            t('custom_interface_plugin_button_view_description'),
            'buttons_viewmode',
            'default',
            [
                { value: 'default', label: t('custom_interface_plugin_standard') },
                { value: 'icons', label: t('custom_interface_plugin_icons_only') },
                { value: 'always', label: t('custom_interface_plugin_with_text') }
            ],
            applyButtonViewMode
        ));
        list.append(createSettingItem(
            t('custom_interface_plugin_button_size'),
            t('custom_interface_plugin_button_size_description'),
            'buttons_size',
            'normal',
            [
                { value: 'compact', label: t('custom_interface_plugin_size_compact') },
                { value: 'normal', label: t('custom_interface_plugin_size_normal') },
                { value: 'large', label: t('custom_interface_plugin_size_large') }
            ],
            applyButtonAppearance
        ));
        list.append(createSettingItem(
            t('custom_interface_plugin_button_style'),
            t('custom_interface_plugin_button_style_description'),
            'buttons_style',
            'classic',
            [
                { value: 'classic', label: t('custom_interface_plugin_style_classic') },
                { value: 'glass', label: t('custom_interface_plugin_style_glass') },
                { value: 'pill', label: t('custom_interface_plugin_style_pill') },
                { value: 'outline', label: t('custom_interface_plugin_style_outline') },
                { value: 'accent', label: t('custom_interface_plugin_style_accent') },
                { value: 'midnight', label: t('custom_interface_plugin_style_midnight') },
                { value: 'soft', label: t('custom_interface_plugin_style_soft') },
                { value: 'neon', label: t('custom_interface_plugin_style_neon') },
                { value: 'gradient', label: t('custom_interface_plugin_style_gradient') },
                { value: 'minimal', label: t('custom_interface_plugin_style_minimal') }
            ],
            applyButtonAppearance
        ));
        list.append(createSettingItem(
            t('custom_interface_plugin_button_layout'),
            t('custom_interface_plugin_button_layout_description'),
            'buttons_layout',
            'row',
            [
                { value: 'row', label: t('custom_interface_plugin_layout_row') },
                { value: 'grid', label: t('custom_interface_plugin_layout_grid') },
                { value: 'column', label: t('custom_interface_plugin_layout_column') }
            ],
            applyButtonAppearance
        ));

        var resetBtn = $('<div class="selector folder-reset-button">' +
            '<div style="text-align: center; padding: 1em;">' + t('custom_interface_plugin_reset_default') + '</div>' +
            '</div>');
        resetBtn.on('hover:enter', function() {
            Lampa.Storage.set('button_custom_order', []);
            Lampa.Storage.set('button_hidden', []);
            Lampa.Storage.set('buttons_viewmode', 'default');
            Lampa.Storage.set('buttons_size', 'normal');
            Lampa.Storage.set('buttons_style', 'classic');
            Lampa.Storage.set('buttons_layout', 'row');
            Lampa.Modal.close();
            setTimeout(function() {
                if (currentContainer) {
                    reorderButtons(currentContainer);
                    refreshController();
                }
            }, 100);
        });
        list.append(resetBtn);

        Lampa.Modal.open({
            title: t('custom_interface_plugin_button_order'),
            html: list,
            size: 'small',
            scroll_to_center: true,
            onBack: function() {
                Lampa.Modal.close();
                applyChanges();
                if (Lampa.Controller) Lampa.Controller.toggle('full_start');
            }
        });
    }

    function reorderButtons(container) {
        if (!container) return false;
        var targetContainer = container.find('.full-start-new__buttons');
        if (!targetContainer.length) return false;
        currentContainer = container;
        container.find('.button--play, .button--edit-order').remove();
        var allButtons = sortByCustomOrder(collectButtons(container));
        allButtonsCache = allButtons;
        if (allButtonsOriginal.length === 0) {
            allButtons.forEach(function(btn) {
                if (btn) allButtonsOriginal.push(btn.clone(true, true));
            });
        }
        currentButtons = allButtons;
        targetContainer.children().detach();
        var visibleButtons = [];
        currentButtons.forEach(function(btn) {
            if (btn) {
                targetContainer.append(btn);
                if (!btn.hasClass('hidden')) visibleButtons.push(btn);
            }
        });
        var editButton = createEditButton();
        targetContainer.append(editButton);
        visibleButtons.push(editButton);
        applyHiddenButtons(currentButtons);
        applyButtonViewMode(Lampa.Storage.get('buttons_viewmode', 'default'));
        applyButtonAppearance();
        applyButtonAnimation(visibleButtons);
        setTimeout(function() {
            setupButtonNavigation(container);
        }, 100);
        return true;
    }

    function setupButtonNavigation(container) {
        if (Lampa.Controller && typeof Lampa.Controller.toggle === 'function') {
            try {
                Lampa.Controller.toggle('full_start');
            } catch (e) {}
        }
    }

    function refreshController() {
        if (Lampa.Controller && typeof Lampa.Controller.toggle === 'function') {
            setTimeout(function() {
                try {
                    Lampa.Controller.toggle('full_start');
                    if (currentContainer) {
                        setTimeout(function() {
                            setupButtonNavigation(currentContainer);
                        }, 100);
                    }
                } catch (e) {}
            }, 50);
        }
    }

    function applyButtonViewMode(mode) {
        if (mode !== 'icons' && mode !== 'always') mode = 'default';

        Lampa.Storage.set('buttons_viewmode', mode);

        if (currentContainer) {
            var target = currentContainer.find('.full-start-new__buttons');
            if (target.length) {
                target.removeClass('icons-only always-text');
                if (mode === 'icons') target.addClass('icons-only');
                if (mode === 'always') target.addClass('always-text');
            }
        }

        return mode;
    }

    function applyButtonAppearance() {
        if (!currentContainer) return;

        var target = currentContainer.find('.full-start-new__buttons');
        if (!target.length) return;

        var size = Lampa.Storage.get('buttons_size', 'normal');
        var style = Lampa.Storage.get('buttons_style', 'classic');
        var layout = Lampa.Storage.get('buttons_layout', 'row');
        var styleClasses = {
            glass: 'buttons-style-glass',
            pill: 'buttons-style-pill',
            outline: 'buttons-style-outline',
            accent: 'buttons-style-accent',
            midnight: 'buttons-style-midnight',
            soft: 'buttons-style-soft',
            neon: 'buttons-style-neon',
            gradient: 'buttons-style-gradient',
            minimal: 'buttons-style-minimal'
        };

        target.removeClass('buttons-size-compact buttons-size-large buttons-layout-grid buttons-layout-column buttons-style-glass buttons-style-pill buttons-style-outline buttons-style-accent buttons-style-midnight buttons-style-soft buttons-style-neon buttons-style-gradient buttons-style-minimal');
        if (size === 'compact') target.addClass('buttons-size-compact');
        if (size === 'large') target.addClass('buttons-size-large');
        if (styleClasses[style]) target.addClass(styleClasses[style]);
        if (layout === 'grid') target.addClass('buttons-layout-grid');
        if (layout === 'column') target.addClass('buttons-layout-column');
    }

    function init() {
        var style = $('<style>' +
            '@keyframes button-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }' +
            '.full-start-new__buttons .full-start__button { opacity: 0; }' +
            '.full-start__button.hidden { display: none !important; }' +
            '.full-start-new__buttons { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 0.5em !important; }' +
            '.full-start-new__buttons.buttons-size-compact .full-start__button { font-size: 0.88em !important; }' +
            '.full-start-new__buttons.buttons-size-large .full-start__button { font-size: 1.12em !important; }' +
            '.full-start-new__buttons.buttons-layout-grid { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; align-items: stretch; }' +
            '.full-start-new__buttons.buttons-layout-grid .full-start__button { width: 100% !important; min-width: 0; box-sizing: border-box; justify-content: center; }' +
            '.full-start-new__buttons.buttons-layout-column { flex-direction: column !important; align-items: stretch !important; }' +
            '.full-start-new__buttons.buttons-layout-column .full-start__button { width: 100% !important; box-sizing: border-box; justify-content: flex-start; }' +
            '.full-start-new__buttons[class*="buttons-style-"] .full-start__button { box-sizing: border-box; transition: background 0.18s ease, border-radius 0.18s ease, box-shadow 0.18s ease; }' +
            '.full-start-new__buttons.buttons-style-glass .full-start__button { background: rgba(255,255,255,0.10) !important; border: 1px solid rgba(255,255,255,0.22) !important; border-radius: 1em !important; backdrop-filter: blur(8px); }' +
            '.full-start-new__buttons.buttons-style-pill .full-start__button { background: rgba(255,255,255,0.13) !important; border: 1px solid rgba(255,255,255,0.12) !important; border-radius: 999px !important; padding-left: 1.1em !important; padding-right: 1.1em !important; }' +
            '.full-start-new__buttons.buttons-style-outline .full-start__button { background: transparent !important; border: 1px solid rgba(255,255,255,0.48) !important; border-radius: 0.55em !important; }' +
            '.full-start-new__buttons.buttons-style-accent .full-start__button { color: #fff !important; background: linear-gradient(135deg,#ff7448,#df3e67) !important; border: 0 !important; border-radius: 0.65em !important; box-shadow: 0 0.25em 0.8em rgba(223,62,103,0.28) !important; }' +
            '.full-start-new__buttons.buttons-style-midnight .full-start__button { background: rgba(9,13,20,0.94) !important; border: 1px solid rgba(255,255,255,0.12) !important; border-radius: 0.35em !important; box-shadow: 0 0.25em 0.6em rgba(0,0,0,0.28) !important; }' +
            '.full-start-new__buttons.buttons-style-soft .full-start__button { background: rgba(255,255,255,0.16) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 0.8em !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.12) !important; }' +
            '.full-start-new__buttons.buttons-style-neon .full-start__button { color: #baf5ff !important; background: rgba(0,15,24,0.72) !important; border: 1px solid rgba(73,218,255,0.82) !important; border-radius: 0.55em !important; box-shadow: 0 0 0.65em rgba(73,218,255,0.3) !important; }' +
            '.full-start-new__buttons.buttons-style-gradient .full-start__button { color: #fff !important; background: linear-gradient(120deg,rgba(95,82,220,0.95),rgba(28,165,179,0.95)) !important; border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 0.7em !important; }' +
            '.full-start-new__buttons.buttons-style-minimal .full-start__button { background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }' +
            '.full-start-new__buttons .full-start__button.button--edit-order { opacity: 0.48 !important; font-size: 0.82em !important; color: rgba(255,255,255,0.68) !important; background: rgba(255,255,255,0.035) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 0.45em !important; box-shadow: none !important; }' +
            '.full-start-new__buttons .full-start__button.button--edit-order.focus { opacity: 0.92 !important; color: rgba(255,255,255,0.92) !important; background: rgba(255,255,255,0.13) !important; border-color: rgba(255,255,255,0.24) !important; }' +
            '.full-start-new__buttons.buttons-loading .full-start__button { visibility: hidden !important; }' +
            '.menu-edit-list__help { opacity: 0.72; padding: 0.8em 0.5em 1em; line-height: 1.4; }' +
            '.menu-edit-list__item { display: flex; align-items: center; gap: 0.65em; padding: 0.65em 0.4em; border-bottom: 1px solid rgba(255,255,255,0.12); }' +
            '.menu-edit-list__icon { display: flex; align-items: center; justify-content: center; flex: 0 0 2.4em; }' +
            '.menu-edit-list__icon svg { width: 1.8em; height: 1.8em; max-width: 100%; max-height: 2em; }' +
            '.menu-edit-list__text { flex: 1 1 auto; min-width: 0; }' +
            '.menu-edit-list__title { font-weight: 600; line-height: 1.25; }' +
            '.menu-edit-list__move, .menu-edit-list__toggle { display: flex; align-items: center; justify-content: center; flex: 0 0 2.5em; min-height: 2.5em; border-radius: 0.4em; }' +
            '.menu-edit-list__move.focus, .menu-edit-list__toggle.focus { background: rgba(255,255,255,0.16); outline: 2px solid rgba(255,255,255,0.8); }' +
            '.menu-edit-list__section { font-size: 1.05em; font-weight: 600; padding: 1.1em 0.35em 0.45em; }' +
            '.menu-edit-list__setting { display: flex; align-items: center; gap: 0.7em; min-height: 3.4em; padding: 0.65em 0.6em; margin: 0.35em 0; border-radius: 0.4em; background: rgba(255,255,255,0.07); }' +
            '.menu-edit-list__setting.focus { background: rgba(255,255,255,0.16); outline: 2px solid rgba(255,255,255,0.8); }' +
            '.menu-edit-list__setting-info { flex: 1 1 auto; min-width: 0; }' +
            '.menu-edit-list__setting-title { font-weight: 600; line-height: 1.25; }' +
            '.menu-edit-list__setting-description { opacity: 0.62; font-size: 0.76em; line-height: 1.25; margin-top: 0.2em; }' +
            '.menu-edit-list__setting-value { text-align: right; opacity: 0.85; max-width: 38%; }' +
            '.menu-edit-list__setting-arrow { font-size: 1.8em; line-height: 1; opacity: 0.65; }' +
            '.folder-reset-button { background: rgba(255, 255, 255, 0.14); margin-top: 1em; border-radius: 0.4em; }' +
            '.folder-reset-button.focus { outline: 2px solid rgba(255,255,255,0.8); }' +
            '.full-start-new__buttons.icons-only .full-start__button span { display: none; }' +
            '.full-start-new__buttons.always-text .full-start__button span { display: block !important; }' +
            '.menu-edit-list__item-hidden { opacity: 0.5; }' +
            '</style>');
        $('body').append(style);

        Lampa.Listener.follow('full', function(e) {
            if (e.type !== 'complite') return;
            var container = e.object && e.object.activity ? e.object.activity.render() : null;
            if (!container) return;
            var targetContainer = container.find('.full-start-new__buttons');
            if (targetContainer.length) {
                targetContainer.addClass('buttons-loading');
            }
            setTimeout(function() {
                try {
                    if (!container.data('buttons-processed')) {
                        container.data('buttons-processed', true);
                        if (reorderButtons(container)) {
                            if (targetContainer.length) {
                                targetContainer.removeClass('buttons-loading');
                            }
                            refreshController();
                        }
                    }
                } catch (err) {
                    console.error('Buttons editor plugin error:', err);
                    if (targetContainer.length) {
                        targetContainer.removeClass('buttons-loading');
                    }
                }
            }, 400);
        });
    }

    try {
        init();
    } catch (e) {
        console.error('Plugin init error:', e);
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {};
    }
})();
