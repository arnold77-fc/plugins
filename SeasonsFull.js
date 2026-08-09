(function () {
    'use strict';

    // --- Защита от повторного запуска плагина ---
    if (window.SeasonBadgePlugin && window.SeasonBadgePlugin.__initialized) return;
    
    window.SeasonBadgePlugin = window.SeasonBadgePlugin || {};
    window.SeasonBadgePlugin.__initialized = true;

    // === НАСТРОЙКИ ПЛАГИНА ===
    var CONFIG = {
        tmdbApiKey: '96b971de61c81e42187407e7da28d97f',
        cacheTime: 12 * 60 * 60 * 1000,
        enabled: true,
        language: 'uk',
        translateTV: true // Перевод TV
    };

    // === МУЛЬТИЯЗЫЧНЫЕ ТЕКСТЫ СТАТУСОВ ===
    var STATUS_TRANSLATIONS = {
        ru: {
            sequel: 'Онгоинг',
            series: 'Сериал',
            ended: 'Завершён',
            canceled: 'Отменён',
            tomorrow: 'Завтра',
            inWeek: 'Через неделю',
            inDays: 'Через %d дн.',
            movie: 'Фильм',
            tv: 'Сериал'
        },
        en: {
            sequel: 'Returning',
            series: 'Series',
            ended: 'Ended',
            canceled: 'Canceled',
            tomorrow: 'Tomorrow',
            inWeek: 'In a week',
            inDays: 'In %d days',
            movie: 'Movie',
            tv: 'Series'
        },
        uk: {
            sequel: 'Продовжується',
            series: 'Серіал',
            ended: 'Завершився',
            canceled: 'Скасовано',
            tomorrow: 'Завтра',
            inWeek: 'Через тиждень',
            inDays: 'Через %d дн.',
            movie: 'Фільм',
            tv: 'Серіал'
        },
        be: {
            sequel: 'Працягваецца',
            series: 'Серыял',
            ended: 'Скончыўся',
            canceled: 'Скасавана',
            tomorrow: 'Заўтра',
            inWeek: 'Праз тыдзень',
            inDays: 'Праз %d дн.',
            movie: 'Фільм',
            tv: 'Серыял'
        },
        zh: {
            sequel: '续集',
            series: '剧集',
            ended: '已完结',
            canceled: '已取消',
            tomorrow: '明天有新剧集',
            inWeek: '一周后',
            inDays: '%d天后',
            movie: '电影',
            tv: '剧集'
        },
        pt: {
            sequel: 'Sequência',
            series: 'Série',
            ended: 'Terminado',
            canceled: 'Cancelado',
            tomorrow: 'Amanhã',
            inWeek: 'Em uma semana',
            inDays: 'Em %d dias',
            movie: 'Filme',
            tv: 'Série'
        },
        bg: {
            sequel: 'Продължава',
            series: 'Сериал',
            ended: 'Приключил',
            canceled: 'Отменен',
            tomorrow: 'Утре',
            inWeek: 'След седмица',
            inDays: 'След %d дни',
            movie: 'Филм',
            tv: 'Сериал'
        },
        cs: {
            sequel: 'Pokračování',
            series: 'Seriál',
            ended: 'Ukončeno',
            canceled: 'Zrušeno',
            tomorrow: 'Zítra',
            inWeek: 'Za týden',
            inDays: 'Za %d dn.',
            movie: 'Film',
            tv: 'Seriál'
        },
        he: {
            sequel: 'סִקְוֶל',
            series: 'סִדְרָה',
            ended: 'הסתיים',
            canceled: 'בוטל',
            tomorrow: 'מחר',
            inWeek: 'בעוד שבוע',
            inDays: 'בעוד %d ימים',
            movie: 'סרט',
            tv: 'סִדְרָה'
        }
    };

    var currentLanguage = null;

    // === ФУНКЦИЯ ОПРЕДЕЛЕНИЯ ЯЗЫКА ===
    function initAppLanguage() {
        if (currentLanguage) return currentLanguage;
        
        var lang = 'ru';

        try {
            if (window.Lampa && Lampa.Manager) {
                if (Lampa.Settings && Lampa.Settings.get) {
                    var settingsLang = Lampa.Settings.get('language') || Lampa.Settings.get('lang');
                    if (settingsLang && STATUS_TRANSLATIONS[settingsLang]) {
                        lang = settingsLang;
                        currentLanguage = lang;
                        return lang;
                    }
                }
                
                if (Lampa.Storage && Lampa.Storage.get) {
                    var storageLang = Lampa.Storage.get('language') || Lampa.Storage.get('lang');
                    if (storageLang && STATUS_TRANSLATIONS[storageLang]) {
                        lang = storageLang;
                        currentLanguage = lang;
                        return lang;
                    }
                }
                
                if (Lampa.Manager.getter && typeof Lampa.Manager.getter === 'function') {
                    try {
                        var managerLang = Lampa.Manager.getter('language') || Lampa.Manager.getter('lang');
                        if (managerLang && STATUS_TRANSLATIONS[managerLang]) {
                            lang = managerLang;
                            currentLanguage = lang;
                            return lang;
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {}
        
        try {
            var lampaLangKeys = ['lampa_language', 'lampa_lang', 'lampa__language', 'lampa__lang'];
            for (var i = 0; i < lampaLangKeys.length; i++) {
                var key = lampaLangKeys[i];
                var value = localStorage.getItem(key);
                if (value && STATUS_TRANSLATIONS[value]) {
                    lang = value;
                    currentLanguage = lang;
                    return lang;
                }
            }
            
            var generalKeys = ['app_language', 'app_lang', 'language', 'lang', 'user_language'];
            for (var j = 0; j < generalKeys.length; j++) {
                var genKey = generalKeys[j];
                var genValue = localStorage.getItem(genKey);
                if (genValue && STATUS_TRANSLATIONS[genValue]) {
                    lang = genValue;
                    currentLanguage = lang;
                    return lang;
                }
            }
        } catch (e) {}
        
        try {
            var browserLang = (navigator.language || navigator.userLanguage || 'ru').substring(0, 2);
            if (STATUS_TRANSLATIONS[browserLang]) {
                lang = browserLang;
                currentLanguage = lang;
                return lang;
            }
        } catch (e) {}
        
        currentLanguage = lang;
        return lang;
    }

    // === ФУНКЦИЯ ПЕРЕВОДА СТАТУСОВ ===
    function translateStatus(key, params) {
        if (!currentLanguage) {
            initAppLanguage();
        }
        
        var translation = STATUS_TRANSLATIONS[currentLanguage] || STATUS_TRANSLATIONS.ru;
        var text = translation[key] || STATUS_TRANSLATIONS.ru[key] || key;
        
        if (params && params.length > 0) {
            for (var i = 0; i < params.length; i++) {
                text = text.replace('%d', params[i]);
            }
        }
        
        return text;
    }

    // === ФУНКЦИЯ ПЕРЕВОДА TV НА КАРТОЧКАХ ===
    function translateTVCaption() {
        if (!CONFIG.translateTV) return;
        
        var styleId = 'seasonbadge-translate-tv';
        var existingStyle = document.getElementById(styleId);
        if (existingStyle) existingStyle.remove();
        
        var translateTVStyle = `
        <style id="${styleId}">
            .card--tv .card__type,
            .card__type { display: none !important; }
            .card__type::after { display: none !important; }
        </style>`;
        
        document.head.insertAdjacentHTML('beforeend', translateTVStyle);
    }

    // === СТИЛИ ДЛЯ МЕТОК ===
    var style = document.createElement('style');
    style.textContent = `
    :root {
        --atv-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        --atv-radius: 4px;
    }

    /* КОНТЕЙНЕР ДЛЯ ПЛАШКИ СЕЗОНА (Вертикальный постер: вверху справа под рейтингом) */
    .season-badges-wrapper {
        position: absolute !important;
        top: 26px !important;
        right: 8px !important;
        bottom: auto !important;
        left: auto !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 4px !important;
        z-index: 12;
        pointer-events: none;
        width: auto !important;
    }
    
    /* КОНТЕЙНЕР ДЛЯ ПЛАШКИ СЕЗОНА (Горизонтальный постер: внизу справа) */
    .season-badges-wrapper.badge-horizontal {
        top: auto !important;
        bottom: 8px !important; 
        right: 8px !important;
        left: auto !important;
    }

    /* СТИЛИ ДЛЯ ИНФОРМАЦИИ О СЕЗОНЕ */
    .card--season-complete,
    .card--season-progress {
        position: relative !important;
        margin: 0 !important;
        border-radius: var(--atv-radius);
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        color: #ffffff;
        width: fit-content !important;
        max-width: max-content !important;
    }

    /* СТАТУС СЕРИАЛА (ВЕРХНИЙ ЛЕВЫЙ УГОЛ) */
    .card--series-status {
        position: absolute !important;
        top: 26px !important;
        left: 8px !important;
        right: auto !important;
        margin: 0 !important;
        border-radius: var(--atv-radius);
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        color: #ffffff;
        background-color: rgba(28, 28, 30, 0.9);
        border: 0.5px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        font-family: var(--atv-font);
        font-weight: 600;
        font-size: 0.7em !important;
        padding: 0.2em 0.4em !important;
        letter-spacing: 0.2px;
        white-space: nowrap;
        text-align: center;
        text-shadow: none;
        display: flex;
        align-items: center;
        z-index: 12;
        pointer-events: none;
        width: fit-content !important;
    }
    
    /* СТИЛИ APPLE TV С ТЕНЯМИ И РАМКАМИ (СЕЗОН) */
    .card--season-complete,
    .card--season-progress {
        background-color: rgba(28, 28, 30, 0.9);
        border: 0.5px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    
    /* ТЕКСТ ДЛЯ ИНФОРМАЦИИ О СЕЗОНЕ (КОМПАКТНЫЙ) */
    .card--season-complete div,
    .card--season-progress div {
        text-transform: uppercase;
        font-family: var(--atv-font);  
        font-weight: 600;
        font-size: 0.7em !important;
        padding: 0.2em 0.4em !important;
        letter-spacing: 0.2px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 2px;
        text-align: center;
        text-shadow: none;
        line-height: 1.1;
    }
    
    /* ЦВЕТА ТЕКСТА СЕЗОНОВ */
    .card--season-complete div,
    .card--season-progress div { color: #ffffff; }
    
    /* ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ */
    .card--season-complete.show,
    .card--season-progress.show,
    .card--series-status.show {
        opacity: 1;
    }
    
    /* АДАПТАЦИЯ ДЛЯ ПЛАНШЕТОВ */
    @media (max-width: 768px) {
        .season-badges-wrapper {
            top: 22px !important;
            right: 6px !important;
        }
        .season-badges-wrapper.badge-horizontal {
            top: auto !important;
            bottom: 6px !important;
            right: 6px !important;
        }
        .card--season-complete, .card--season-progress, .card--series-status {
            border-radius: 4px;
        }
        .card--season-complete div, .card--season-progress div {
            font-size: 0.65em !important;
            padding: 0.15em 0.35em !important;
        }
        .card--series-status {
            font-size: 0.65em !important;
            padding: 0.15em 0.35em !important;
            top: 22px !important;
            left: 6px !important;
        }
    }

    /* АДАПТАЦИЯ ДЛЯ ТЕЛЕФОНОВ */
    @media (max-width: 480px) {
        .season-badges-wrapper {
            top: 20px !important;
            right: 4px !important;
        }
        .season-badges-wrapper.badge-horizontal {
            top: auto !important;
            bottom: 4px !important;
            right: 4px !important;
        }
        .card--season-complete, .card--season-progress, .card--series-status {
            border-radius: 3px;
        }
        .card--season-complete div, .card--season-progress div {
            font-size: 0.6em !important;
            padding: 0.1em 0.3em !important;
        }
        .card--series-status {
            font-size: 0.6em !important;
            padding: 0.1em 0.3em !important;
            top: 20px !important;
            left: 4px !important;
        }
    }
    `;
    document.head.appendChild(style);

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

    function getMediaType(cardData) {
        if (!cardData) return 'unknown';
        if (cardData.name || cardData.first_air_date) return 'tv';
        if (cardData.title || cardData.release_date) return 'movie';
        return 'unknown';
    }

    var cache = JSON.parse(localStorage.getItem('seasonBadgeCache') || '{}');

    // [ОПТИМИЗАЦИЯ]: Функция очистки старого кэша
    function cleanupCache() {
        var now = Date.now();
        var cacheUpdated = false;
        for (var key in cache) {
            if (now - cache[key].timestamp > CONFIG.cacheTime) {
                delete cache[key];
                cacheUpdated = true;
            }
        }
        if (cacheUpdated) {
            try {
                localStorage.setItem('seasonBadgeCache', JSON.stringify(cache));
            } catch (e) {}
        }
    }
    cleanupCache();

    function fetchSeriesData(tmdbId) {
        return new Promise(function(resolve, reject) {
            if (cache[tmdbId] && (Date.now() - cache[tmdbId].timestamp < CONFIG.cacheTime)) {
                return resolve(cache[tmdbId].data);
            }

            if (!CONFIG.tmdbApiKey || CONFIG.tmdbApiKey === 'ваш_tmdb_api_key_тут') {
                return reject(new Error('Пожалуйста, вставьте корректный TMDB API ключ'));
            }

            var url = 'https://api.themoviedb.org/3/tv/' + tmdbId + '?api_key=' + CONFIG.tmdbApiKey + '&language=' + currentLanguage;
            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            var data = JSON.parse(xhr.responseText);
                            if (data.success === false) {
                                reject(new Error(data.status_message));
                                return;
                            }

                            cache[tmdbId] = { 
                                data: data, 
                                timestamp: Date.now() 
                            };
                            try {
                                localStorage.setItem('seasonBadgeCache', JSON.stringify(cache));
                            } catch (e) {}
                            
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error('HTTP error ' + xhr.status));
                    }
                }
            };
            xhr.onerror = function() {
                reject(new Error('Network error'));
            };
            xhr.send();
        });
    }

    function getSeasonProgress(tmdbData) {
        if (!tmdbData || !tmdbData.seasons || !tmdbData.last_episode_to_air) return false;
        
        var lastEpisode = tmdbData.last_episode_to_air;
        var currentSeason = null;
        
        for (var i = 0; i < tmdbData.seasons.length; i++) {
            var season = tmdbData.seasons[i];
            if (season.season_number === lastEpisode.season_number && season.season_number > 0) {
                currentSeason = season;
                break;
            }
        }
        
        if (!currentSeason) return false;
        
        var totalEpisodes = currentSeason.episode_count || 0;
        var airedEpisodes = lastEpisode.episode_number || 0;
        
        return {
            seasonNumber: lastEpisode.season_number,
            airedEpisodes: airedEpisodes,
            totalEpisodes: totalEpisodes,
            isComplete: airedEpisodes >= totalEpisodes
        };
    }

    function getSeriesStatus(tmdbData) {
        if (!tmdbData) return null;

        var status = tmdbData.status;
        var nextEpisode = tmdbData.next_episode_to_air;
        
        var statusType = 'blue';
        var statusText = translateStatus('series');
        
        if (status === 'Returning Series') {
            statusType = 'orange';
            statusText = translateStatus('sequel');
        } 
        else if (status === 'Ended') {
            statusType = 'green';
            statusText = translateStatus('ended');
        } 
        else if (status === 'Canceled' || status === 'Cancelled') {
            statusType = 'red';
            statusText = translateStatus('canceled');
        }
        
        if (nextEpisode && nextEpisode.air_date) {
            var nextAirDate = new Date(nextEpisode.air_date);
            var today = new Date();
            var diffTime = nextAirDate - today;
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0 && diffDays <= 30) {
                statusType = 'purple';
                if (diffDays === 1) {
                    statusText = translateStatus('tomorrow');
                } else if (diffDays === 7) {
                    statusText = translateStatus('inWeek');
                } else {
                    statusText = translateStatus('inDays', [diffDays]);
                }
            }
        }
        
        return {
            type: statusType, 
            text: statusText
        };
    }

    function createBadge(content, isComplete, loading) {
        var badge = document.createElement('div');
        var badgeClass = isComplete ? 'card--season-complete' : 'card--season-progress';
        badge.className = badgeClass + (loading ? ' loading' : '');
        
        var symbol = '';
        if (!loading) {
            symbol = isComplete ? ' ✓' : '';
        }
        
        var innerDiv = document.createElement('div');
        innerDiv.textContent = content + symbol;
        badge.appendChild(innerDiv);
        
        return badge;
    }

    function createStatusBadge(text, type) {
        var statusBadge = document.createElement('div');
        statusBadge.className = 'card--series-status ' + type;
        statusBadge.textContent = text;
        return statusBadge;
    }

    // [ОПТИМИЗАЦИЯ]: Уменьшено количество вызовов setTimeout для рендеринга
    function applyOrientationStyle(cardEl, wrapperEl) {
        setTimeout(function() {
            if (!cardEl || !wrapperEl) return;
            var w = cardEl.offsetWidth || 0;
            var h = cardEl.offsetHeight || 0;
            var isHor = cardEl.classList.contains('card--wide') || 
                        cardEl.classList.contains('card--category') || 
                        cardEl.classList.contains('card--landscape') ||
                        (w > h * 1.1 && h > 0);
                        
            if (isHor) {
                wrapperEl.classList.add('badge-horizontal');
            } else {
                wrapperEl.classList.remove('badge-horizontal');
            }
        }, 150);
    }

    // [ОПТИМИЗАЦИЯ]: Добавлена переменная retryCount, чтобы ограничить количество рекурсий
    function addSeasonBadge(cardEl, retryCount) {
        retryCount = retryCount || 0;
        if (!cardEl || cardEl.hasAttribute('data-season-processed')) return;

        if (!cardEl.card_data) {
            if (retryCount < 10) { // Не более 10 попыток
                setTimeout(function() { addSeasonBadge(cardEl, retryCount + 1); }, 100);
            }
            return;
        }

        var data = cardEl.card_data;
        var mediaType = getMediaType(data);
        var view = cardEl.querySelector('.card__view');
        if (!view) return;

        // Удаление предыдущих меток
        var oldBadges = view.querySelectorAll('.card--season-complete, .card--season-progress, .card--series-status, .season-badges-wrapper');
        for (var i = 0; i < oldBadges.length; i++) {
            if (oldBadges[i].parentNode) {
                oldBadges[i].parentNode.removeChild(oldBadges[i]);
            }
        }

        if (mediaType === 'tv') {
            // Создаем контейнер для плашек сезона
            var wrapper = document.createElement('div');
            wrapper.className = 'season-badges-wrapper';
            view.appendChild(wrapper);
            
            var badge = createBadge('...', false, true);
            wrapper.appendChild(badge);
            
            applyOrientationStyle(cardEl, wrapper);
            cardEl.setAttribute('data-season-processed', 'loading');

            fetchSeriesData(data.id)
                .then(function(tmdbData) {
                    var progressInfo = getSeasonProgress(tmdbData);
                    var statusInfo = getSeriesStatus(tmdbData);
                    
                    if (progressInfo) {
                        var content = '';
                        var isComplete = progressInfo.isComplete;
                        
                        if (isComplete) {
                            content = 'S' + progressInfo.seasonNumber;
                        } else {
                            content = 'S' + progressInfo.seasonNumber + ' ' + progressInfo.airedEpisodes + '/' + progressInfo.totalEpisodes;
                        }
                        
                        if (badge.parentNode) {
                            badge.parentNode.removeChild(badge);
                        }
                        
                        // Добавляем статус слева вверху
                        if (statusInfo) {
                            var statusBadge = createStatusBadge(statusInfo.text, statusInfo.type);
                            view.appendChild(statusBadge);
                            
                            setTimeout(function() {
                                statusBadge.classList.add('show');
                            }, 100);
                        }
                        
                        // Добавляем сезон
                        badge = createBadge(content, isComplete, false);
                        wrapper.appendChild(badge);
                        
                        applyOrientationStyle(cardEl, wrapper);

                        setTimeout(function() {
                            badge.classList.add('show');
                        }, 50);

                        cardEl.setAttribute('data-season-processed', isComplete ? 'complete' : 'in-progress');
                    } else {
                        if (badge.parentNode) {
                            badge.parentNode.removeChild(badge);
                        }
                        cardEl.setAttribute('data-season-processed', 'error');
                    }
                })
                .catch(function(error) {
                    console.log('SeasonBadgePlugin ошибка:', error.message);
                    if (badge.parentNode) {
                        badge.parentNode.removeChild(badge);
                    }
                    cardEl.setAttribute('data-season-processed', 'error');
                });
        } else {
            cardEl.setAttribute('data-season-processed', 'not-tv');
        }
    }

    // === СИСТЕМА НАБЛЮДЕНИЯ ЗА НОВЫМИ КАРТОЧКАМИ ===
    var observer = null;
    
    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                var addedNodes = mutation.addedNodes;
                if (addedNodes) {
                    for (var j = 0; j < addedNodes.length; j++) {
                        var node = addedNodes[j];
                        if (node.nodeType !== 1) continue;

                        if (node.classList && node.classList.contains('card')) {
                            addSeasonBadge(node);
                        }

                        if (node.querySelectorAll) {
                            var cards = node.querySelectorAll('.card');
                            for (var k = 0; k < cards.length; k++) {
                                addSeasonBadge(cards[k]);
                            }
                        }
                    }
                }
            }
        });
    }

    function initPlugin() {
        if (!CONFIG.enabled) return;

        initAppLanguage();
        translateTVCaption();

        if (!observer) {
            // [ОПТИМИЗАЦИЯ]: Интервал увеличен с 1000мс до 2000мс
            setInterval(function() {
                var newCards = document.querySelectorAll('.card:not([data-season-processed])');
                for (var i = 0; i < newCards.length; i++) {
                    addSeasonBadge(newCards[i]);
                }
            }, 2000); 
        } else {
            var containers = document.querySelectorAll('.cards, .card-list, .content, .main, .cards-list, .preview__list');

            if (containers.length > 0) {
                for (var i = 0; i < containers.length; i++) {
                    try {
                        observer.observe(containers[i], {
                            childList: true,
                            subtree: true
                        });
                    } catch (e) {
                        console.log('Ошибка наблюдения за контейнером:', e);
                    }
                }
            } else {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        var existingCards = document.querySelectorAll('.card:not([data-season-processed])');
        for (var j = 0; j < existingCards.length; j++) {
            (function(index) {
                setTimeout(function() { addSeasonBadge(existingCards[index]); }, index * 300);
            })(j);
        }
    }

    // === СИСТЕМА ЗАПУСКА ПЛАГИНА ===
    function startPlugin() {
        if (document.readyState === 'loading') {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', initPlugin);
            } else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', function() {
                    if (document.readyState === 'complete') {
                        initPlugin();
                    }
                });
            }
        } else {
            if (window.appready) {
                initPlugin();
            } 
            else if (window.Lampa && Lampa.Listener) {
                Lampa.Listener.follow('app', function(e) {
                    if (e.type === 'ready') initPlugin();
                });
            } 
            else {
                setTimeout(initPlugin, 2000);
            }
        }
    }

    startPlugin();

})();
