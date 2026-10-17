
(function () {
    'use strict';

    /**
     * STUDIOS MASTER (Full Horizontal Platforms Style)
     * Developed by: Syvyj
     * Version: 2.1.0
     */

    var LOCALIZATION = {
        'ru': {
            platforms: 'Платформы',
            new_movies: 'Новые фильмы',
            new_series: 'Новые сериалы',
            trending_netflix: 'В тренде на Netflix',
            action_blockbusters: 'Экшн и Блокбастеры',
            fantasy_worlds: 'Фантастические миры',
            reality_hits: 'Реалити-шоу: Хиты',
            crime_dramas: 'Криминальные драмы',
            kdramas: 'K-Dramas (Корейские сериалы)',
            anime_collection: 'Аниме коллекция',
            documentary_cinema: 'Документальное кино',
            critics_choice: 'Выбор критиков (Высокий рейтинг)',
            hits_apple_tv: 'Хиты Apple TV+',
            apple_original_films: 'Apple Original Films',
            apple_scifi: 'Фантастика Apple',
            comedies_feel_good: 'Комедии и Feel-good',
            thrillers_detectives: 'Триллеры и Детективы',
            new_movies_wb_hbo: 'Новые фильмы WB/HBO',
            new_series_hbo_max: 'Новые сериалы HBO/Max',
            hbo_main_hits: 'HBO: Главные хиты',
            max_originals: 'Max Originals',
            warner_bros_blockbusters: 'Блокбастеры Warner Bros.',
            golden_collection_hbo: 'Золотая коллекция HBO (Высший рейтинг)',
            epic_worlds_fantasy: 'Эпичные миры (Фэнтези)',
            premium_dramas: 'Премиальные драми',
            adult_animation: 'Взрослая анимация (Adult Swim)',
            dc_universe_movies: 'Вселенная DC (Фильмы)',
            trending_prime_video: 'В тренде на Prime Video',
            hard_action_antiheroes: 'Жесткий экшн и Антигерои',
            mgm_amazon_blockbusters: 'Блокбастеры MGM и Amazon',
            comedies: 'Комедии',
            highest_rating_imdb: 'Высший рейтинг IMDb',
            new_movies_disney: 'Новые фильмы на Disney+',
            new_series_disney: 'Новые сериалы на Disney+',
            marvel_cinematic_universe: 'Marvel: Киновселенная (MCU)',
            marvel_series: 'Marvel: Сериалы',
            star_wars_movies: 'Звездные Войны: Фильмы',
            star_wars_mandalorian: 'Звездные Войны: Мандалорец и другие',
            disney_classics: 'Классика Disney',
            pixar_infinity_beyond: 'Pixar: Бесконечность и далее',
            fx_adult_hits: 'FX: Взрослые хиты (The Bear, Shogun)',
            simpsons_fox_animation: 'Симпсоны и анимация FOX',
            hulu_originals_trending: 'Hulu Originals: В тренде',
            dramas_thrillers_hulu: 'Драмы и Триллеры Hulu',
            comedies_adult_animation: 'Комедии и Анимация для взрослых',
            miniseries: 'Мини-сериалы (Limited Series)',
            paramount_blockbusters: 'Блокбастеры Paramount Pictures',
            paramount_originals: 'Paramount+ Originals',
            yellowstone_universe: 'Вселенная Йеллоустоун',
            star_trek_final_frontier: 'Star Trek: Последняя граница',
            nickelodeon_kids: 'Nickelodeon: Для детей',
            syfy_hits: 'Хиты телеканала Syfy',
            space_journeys_scifi: 'Космические путешествия и Научная Фантастика',
            mysticism_horror_fantasy: 'Мистика, Ужасы и Фэнтези',
            peacock_originals: 'Peacock Originals',
            peacock_hits: 'Хиты и популярное на Peacock',
            peacock_comedies: 'Комедии и Ситкомы Peacock',
            peacock_dramas: 'Драмы Peacock',
            educational: 'Познавательное',
            new_releases_discovery: 'Новые выпуски: Discovery, NatGeo, BBC',
            discovery_channel_hits: 'Discovery Channel: Хиты',
            national_geographic_world: 'National Geographic: Мир вокруг',
            animal_planet_animals: 'Animal Planet: Животные',
            bbc_earth_nature: 'BBC Earth: Природа (Высокий рейтинг)',
            culinary_battles_chefs: 'Кулинарные битвы и Шеф-повара',
            voice_dance_talent_shows: 'Голос, Танцы и Шоу талантов',
            survival_shows: 'Шоу о выживании',
            science_technology_experiments: 'Наука, Техника и Эксперименты',
            travel_tourism: 'Путешествия и Туризм',
            true_crime_investigations: 'True Crime: Реальные расследования',
            plugin_loaded: 'Studios Master Horizontal загружено'
        },
        'en': {
            platforms: 'Platforms',
            new_movies: 'New Movies',
            new_series: 'New Series',
            trending_netflix: 'Trending on Netflix',
            action_blockbusters: 'Action & Blockbusters',
            fantasy_worlds: 'Fantasy Worlds',
            reality_hits: 'Reality Shows: Hits',
            crime_dramas: 'Crime Dramas',
            kdramas: 'K-Dramas',
            anime_collection: 'Anime Collection',
            documentary_cinema: 'Documentary Cinema',
            critics_choice: 'Critics\' Choice',
            hits_apple_tv: 'Apple TV+ Hits',
            apple_original_films: 'Apple Original Films',
            apple_scifi: 'Apple Sci-Fi',
            comedies_feel_good: 'Comedies & Feel-good',
            thrillers_detectives: 'Thrillers & Detectives',
            new_movies_wb_hbo: 'New Movies WB/HBO',
            new_series_hbo_max: 'New Series HBO/Max',
            hbo_main_hits: 'HBO: Main Hits',
            max_originals: 'Max Originals',
            warner_bros_blockbusters: 'Warner Bros. Blockbusters',
            golden_collection_hbo: 'HBO Golden Collection',
            epic_worlds_fantasy: 'Epic Worlds',
            premium_dramas: 'Premium Dramas',
            adult_animation: 'Adult Animation',
            dc_universe_movies: 'DC Universe',
            trending_prime_video: 'Trending on Prime Video',
            hard_action_antiheroes: 'Hard Action & Antiheroes',
            mgm_amazon_blockbusters: 'MGM & Amazon Blockbusters',
            comedies: 'Comedies',
            highest_rating_imdb: 'Highest IMDb Rating',
            new_movies_disney: 'New Movies on Disney+',
            new_series_disney: 'New Series on Disney+',
            marvel_cinematic_universe: 'Marvel: MCU',
            marvel_series: 'Marvel: Series',
            star_wars_movies: 'Star Wars: Movies',
            star_wars_mandalorian: 'Star Wars: The Mandalorian',
            disney_classics: 'Disney Classics',
            pixar_infinity_beyond: 'Pixar',
            fx_adult_hits: 'FX: Adult Hits',
            simpsons_fox_animation: 'The Simpsons & FOX',
            hulu_originals_trending: 'Hulu Originals',
            dramas_thrillers_hulu: 'Dramas & Thrillers',
            comedies_adult_animation: 'Comedies & Animation',
            miniseries: 'Miniseries',
            paramount_blockbusters: 'Paramount Blockbusters',
            paramount_originals: 'Paramount+ Originals',
            yellowstone_universe: 'Yellowstone Universe',
            star_trek_final_frontier: 'Star Trek',
            nickelodeon_kids: 'Nickelodeon',
            syfy_hits: 'Syfy Hits',
            space_journeys_scifi: 'Space & Sci-Fi',
            mysticism_horror_fantasy: 'Mysticism, Horror & Fantasy',
            peacock_originals: 'Peacock Originals',
            peacock_hits: 'Peacock Hits',
            peacock_comedies: 'Peacock Comedies',
            peacock_dramas: 'Peacock Dramas',
            educational: 'Educational',
            new_releases_discovery: 'Discovery, NatGeo, BBC',
            discovery_channel_hits: 'Discovery Channel',
            national_geographic_world: 'National Geographic',
            animal_planet_animals: 'Animal Planet',
            bbc_earth_nature: 'BBC Earth',
            culinary_battles_chefs: 'Culinary Battles & Chefs',
            voice_dance_talent_shows: 'Talent Shows',
            survival_shows: 'Survival Shows',
            science_technology_experiments: 'Science & Tech',
            travel_tourism: 'Travel & Tourism',
            true_crime_investigations: 'True Crime',
            plugin_loaded: 'Studios Master Horizontal loaded'
        }
    };

    function getLocalizedString(key) {
        var lang = Lampa.Storage.get('language', 'uk');
        var fallbackLang = 'en';
        if (lang === 'be' || lang === 'ru') lang = 'ru';
        else if (lang !== 'pl' && lang !== 'uk') lang = 'en';
        return LOCALIZATION[lang] && LOCALIZATION[lang][key] ? LOCALIZATION[lang][key] : (LOCALIZATION[fallbackLang][key] || key);
    }

    var SERVICE_CONFIGS = {
        'netflix': {
            title: 'Netflix',
            bg: '#141414',
            logo: '<svg viewBox="0 0 24 24" fill="none" width="70" height="30"><path d="M16.5 2L16.5 22" stroke="#E50914" stroke-width="4"/><path d="M7.5 2L7.5 22" stroke="#E50914" stroke-width="4"/><path d="M7.5 2L16.5 22" stroke="#E50914" stroke-width="4"/></svg>',
            categories: [
                { "title": getLocalizedString('new_movies'), "url": "discover/movie", "params": { "with_watch_providers": "8", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('new_series'), "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('trending_netflix'), "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('action_blockbusters'), "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "28,12", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('fantasy_worlds'), "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
                { "title": getLocalizedString('reality_hits'), "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10764", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('crime_dramas'), "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "80", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('kdramas'), "url": "discover/tv", "params": { "with_networks": "213", "with_original_language": "ko", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('anime_collection'), "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "16", "with_keywords": "210024", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('documentary_cinema'), "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "99", "sort_by": "release_date.desc" } },
                { "title": getLocalizedString('critics_choice'), "url": "discover/movie", "params": { "with_companies": "213", "vote_average.gte": "7.5", "vote_count.gte": "300", "sort_by": "vote_average.desc" } }
            ]
        },
        'apple': {
            title: 'Apple TV+',
            bg: '#1a1a1a',
            logo: '<svg viewBox="0 0 24 24" fill="currentColor" width="45" height="30"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
            categories: [
                { "title": getLocalizedString('new_movies'), "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('new_series'), "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('hits_apple_tv'), "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('apple_original_films'), "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "release_date.desc", "vote_count.gte": "10" } },
                { "title": getLocalizedString('apple_scifi'), "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
                { "title": getLocalizedString('comedies_feel_good'), "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "35", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('thrillers_detectives'), "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "9648,80", "sort_by": "popularity.desc" } }
            ]
        },
        'hbo': {
            title: 'HBO',
            bg: '#231245',
            logo: '<svg width="55" height="25" viewBox="0 0 24 24" fill="#fff"><path d="M7.042 16.896H4.414v-3.754H2.708v3.754H.01L0 7.22h2.708v3.6h1.706v-3.6h2.628zm12.043.046C21.795 16.94 24 14.689 24 11.978a4.89 4.89 0 0 0-4.915-4.92c-2.707-.002-4.09 1.991-4.432 2.795.003-1.207-1.187-2.632-2.58-2.634H7.59v9.674l4.181.001c1.686 0 2.886-1.46 2.888-2.713.385.788 1.72 2.762 4.427 2.76zm-7.665-3.936c.387 0 .692.382.692.817 0 .435-.305.817-.692.817h-1.33v-1.634zm.005-3.633c.387 0 .692.382.692.817 0 .436-.305.818-.692.818h-1.33V9.373zm1.77 2.607c.305-.039.813-.387.992-.61-.063.276-.068 1.074.006 1.35-.204-.314-.688-.701-.998-.74zm3.43 0a2.462 2.462 0 1 1 4.924 0 2.462 2.462 0 0 1-4.925 0zm2.462 1.936a1.936 1.936 0 1 0 0-3.872 1.936 1.936 0 0 0 0 3.872z"/></svg>',
            categories: [
                { "title": getLocalizedString('new_movies_wb_hbo'), "url": "discover/movie", "params": { "with_companies": "174|49", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "10" } },
                { "title": getLocalizedString('new_series_hbo_max'), "url": "discover/tv", "params": { "with_networks": "49|3186", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('hbo_main_hits'), "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('max_originals'), "url": "discover/tv", "params": { "with_networks": "3186", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('warner_bros_blockbusters'), "url": "discover/movie", "params": { "with_companies": "174", "sort_by": "revenue.desc", "vote_count.gte": "1000" } },
                { "title": getLocalizedString('golden_collection_hbo'), "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "vote_average.desc", "vote_count.gte": "500", "vote_average.gte": "8.0" } },
                { "title": getLocalizedString('epic_worlds_fantasy'), "url": "discover/tv", "params": { "with_networks": "49|3186", "with_genres": "10765", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('premium_dramas'), "url": "discover/tv", "params": { "with_networks": "49", "with_genres": "18", "without_genres": "10765", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('adult_animation'), "url": "discover/tv", "params": { "with_networks": "3186|80", "with_genres": "16", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('dc_universe_movies'), "url": "discover/movie", "params": { "with_companies": "174", "with_keywords": "9715", "sort_by": "release_date.desc" } }
            ]
        },
        'amazon': {
            title: 'Prime Video',
            bg: '#0a344a',
            logo: '<svg viewBox="0 0 24 24" fill="#fff" width="60" height="25"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
            categories: [
                { "title": getLocalizedString('trending_prime_video'), "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('new_movies'), "url": "discover/movie", "params": { "with_watch_providers": "119", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('new_series'), "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('hard_action_antiheroes'), "url": "discover/tv", "params": { "with_networks": "1024", "with_genres": "10765,10759", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('mgm_amazon_blockbusters'), "url": "discover/movie", "params": { "with_companies": "1024|21", "sort_by": "revenue.desc" } },
                { "title": getLocalizedString('comedies'), "url": "discover/tv", "params": { "with_networks": "1024", "with_genres": "35", "sort_by": "vote_average.desc" } },
                { "title": getLocalizedString('highest_rating_imdb'), "url": "discover/tv", "params": { "with_networks": "1024", "vote_average.gte": "8.0", "vote_count.gte": "500", "sort_by": "vote_average.desc" } }
            ]
        },
        'disney': {
            title: 'Disney+',
            bg: '#0c2240',
            logo: '<svg width="60" height="25" viewBox="0 0 24 24" fill="#29b6f6"><path d="M19,3V7m2-2H17m-10.31,4L8.69,21m-5.69-7c0-3,5.54-4.55,9-2m-9,2s12.29-2,13.91,6.77c1.09,5.93-6.58,6.7-9.48,5.89S3,16.06,3,14.06"/></svg>',
            categories: [
                { "title": getLocalizedString('new_movies_disney'), "url": "discover/movie", "params": { "with_watch_providers": "337", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('new_series_disney'), "url": "discover/tv", "params": { "with_watch_providers": "337", "watch_region": "UA", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('marvel_cinematic_universe'), "url": "discover/movie", "params": { "with_companies": "420", "sort_by": "release_date.desc", "vote_count.gte": "200" } },
                { "title": getLocalizedString('marvel_series'), "url": "discover/tv", "params": { "with_companies": "420", "with_networks": "2739", "sort_by": "first_air_date.desc" } },
                { "title": getLocalizedString('star_wars_movies'), "url": "discover/movie", "params": { "with_companies": "1", "sort_by": "release_date.asc" } },
                { "title": getLocalizedString('star_wars_mandalorian'), "url": "discover/tv", "params": { "with_companies": "1", "with_keywords": "1930", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('disney_classics'), "url": "discover/movie", "params": { "with_companies": "6125", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('pixar_infinity_beyond'), "url": "discover/movie", "params": { "with_companies": "3", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('fx_adult_hits'), "url": "discover/tv", "params": { "with_networks": "88", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('simpsons_fox_animation'), "url": "discover/tv", "params": { "with_networks": "19", "with_genres": "16", "sort_by": "popularity.desc" } }
            ]
        },
        'peacock': {
            title: 'Peacock',
            bg: '#0f2027',
            logo: '<span style="color:#00875a; font-weight:bold; font-size: 1.2em;">peacock</span>',
            categories: [
                { "title": getLocalizedString('new_series'), "url": "discover/tv", "params": { "with_networks": "3353", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": getLocalizedString('peacock_hits'), "url": "discover/tv", "params": { "with_networks": "3353", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('peacock_originals'), "url": "discover/tv", "params": { "with_networks": "3353", "with_keywords": "210024", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('peacock_comedies'), "url": "discover/tv", "params": { "with_networks": "3353", "with_genres": "35", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('peacock_dramas'), "url": "discover/tv", "params": { "with_networks": "3353", "with_genres": "18", "sort_by": "popularity.desc" } }
            ]
        },
        'hulu': {
            title: 'Hulu',
            bg: '#102810',
            logo: '<span style="color:#3DBB3D; font-weight:bold; font-size: 1.3em;">hulu</span>',
            categories: [
                { "title": getLocalizedString('hulu_originals_trending'), "url": "discover/tv", "params": { "with_networks": "453", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('dramas_thrillers_hulu'), "url": "discover/tv", "params": { "with_networks": "453", "with_genres": "18,9648", "sort_by": "vote_average.desc" } },
                { "title": getLocalizedString('comedies_adult_animation'), "url": "discover/tv", "params": { "with_networks": "453", "with_genres": "35,16", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('miniseries'), "url": "discover/tv", "params": { "with_networks": "453", "with_keywords": "158718", "sort_by": "first_air_date.desc" } }
            ]
        },
        'paramount': {
            title: 'Paramount+',
            bg: '#091c3d',
            logo: '<span style="color:#0064ff; font-weight:bold; font-size: 1.1em;">Paramount+</span>',
            categories: [
                { "title": getLocalizedString('paramount_blockbusters'), "url": "discover/movie", "params": { "with_companies": "4", "sort_by": "revenue.desc" } },
                { "title": getLocalizedString('paramount_originals'), "url": "discover/tv", "params": { "with_networks": "4330", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('yellowstone_universe'), "url": "discover/tv", "params": { "with_networks": "318|4330", "with_genres": "37,18", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('star_trek_final_frontier'), "url": "discover/tv", "params": { "with_networks": "4330", "with_keywords": "159223", "sort_by": "first_air_date.desc" } },
                { "title": getLocalizedString('nickelodeon_kids'), "url": "discover/tv", "params": { "with_networks": "13", "sort_by": "popularity.desc" } }
            ]
        },
        'syfy': {
            title: 'Syfy',
            bg: '#1a1030',
            logo: '<span style="color:#ff0055; font-weight:bold; font-size: 1.3em;">SYFY</span>',
            categories: [
                { "title": getLocalizedString('syfy_hits'), "url": "discover/tv", "params": { "with_networks": "77", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('space_journeys_scifi'), "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "10765", "with_keywords": "3801", "sort_by": "vote_average.desc" } },
                { "title": getLocalizedString('mysticism_horror_fantasy'), "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "9648,10765", "without_keywords": "3801", "sort_by": "popularity.desc" } }
            ]
        },
        'educational_and_reality': {
            title: getLocalizedString('educational'),
            bg: '#3d2508',
            logo: '<span style="color:#FF9800; font-weight:bold; font-size: 1.1em;">Discovery+</span>',
            categories: [
                { "title": getLocalizedString('new_releases_discovery'), "url": "discover/tv", "params": { "with_networks": "64|91|43|2696|4|65", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "0" } },
                { "title": getLocalizedString('discovery_channel_hits'), "url": "discover/tv", "params": { "with_networks": "64", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('national_geographic_world'), "url": "discover/tv", "params": { "with_networks": "43", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('animal_planet_animals'), "url": "discover/tv", "params": { "with_networks": "91", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('bbc_earth_nature'), "url": "discover/tv", "params": { "with_networks": "4", "with_genres": "99", "sort_by": "vote_average.desc", "vote_count.gte": "50" } },
                { "title": getLocalizedString('culinary_battles_chefs'), "url": "discover/tv", "params": { "with_genres": "10764", "with_keywords": "222083", "without_keywords": "10636,5481", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('voice_dance_talent_shows'), "url": "discover/tv", "params": { "with_genres": "10764", "with_keywords": "4542|4568|2643", "without_keywords": "5481,9714", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('survival_shows'), "url": "discover/tv", "params": { "with_genres": "10764", "with_keywords": "5481|10348", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('science_technology_experiments'), "url": "discover/tv", "params": { "with_genres": "99", "with_keywords": "12554|4924", "sort_by": "popularity.desc" } },
                { "title": getLocalizedString('travel_tourism'), "url": "discover/tv", "params": { "with_genres": "99,10764", "with_keywords": "9714", "sort_by": "vote_average.desc", "vote_count.gte": "20" } },
                { "title": getLocalizedString('true_crime_investigations'), "url": "discover/tv", "params": { "with_genres": "99", "with_keywords": "10714|9840", "sort_by": "popularity.desc" } }
            ]
        }
    };

    function StudiosMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var config = SERVICE_CONFIGS[object.service_id];

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = config.categories;
            var network = new Lampa.Reguest();
            var status = new Lampa.Status(categories.length);

            status.onComplite = function () {
                var fulldata = [];
                Object.keys(status.data).sort(function (a, b) { return a - b; }).forEach(function (key) {
                    var data = status.data[key];
                    if (data && data.results && data.results.length) {
                        var cat = categories[parseInt(key)];
                        Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        fulldata.push({
                            title: cat.title,
                            results: data.results,
                            url: cat.url,
                            params: cat.params,
                            service_id: object.service_id
                        });
                    }
                });

                if (fulldata.length) {
                    _this.build(fulldata);
                    _this.activity.loader(false);
                } else {
                    _this.empty();
                }
            };

            categories.forEach(function (cat, index) {
                var params = ['api_key=' + Lampa.TMDB.key(), 'language=' + Lampa.Storage.get('language', 'uk')];
                if (cat.params) {
                    for (var key in cat.params) {
                        var val = cat.params[key];
                        if (val === '{current_date}') {
                            var d = new Date();
                            val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                        }
                        params.push(key + '=' + val);
                    }
                }
                network.silent(Lampa.TMDB.api(cat.url + '?' + params.join('&')), function (json) {
                    status.append(index.toString(), json);
                }, function () {
                    status.error();
                });
            });

            return this.render();
        };

        comp.onMore = function (data) {
            Lampa.Activity.push({
                url: data.url,
                params: data.params,
                title: data.title,
                component: 'studios_view',
                page: 1
            });
        };

        return comp;
    }

    function StudiosView(object) {
        var comp = new Lampa.InteractionCategory(object);
        var network = new Lampa.Reguest();

        function buildUrl(page) {
            var params = ['api_key=' + Lampa.TMDB.key(), 'language=' + Lampa.Storage.get('language', 'uk'), 'page=' + page];
            if (object.params) {
                for (var key in object.params) {
                    var val = object.params[key];
                    if (val === '{current_date}') {
                        var d = new Date();
                        val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                    }
                    params.push(key + '=' + val);
                }
            }
            return Lampa.TMDB.api(object.url + '?' + params.join('&'));
        }

        comp.create = function () {
            var _this = this;
            network.silent(buildUrl(1), function (json) {
                _this.build(json);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            network.silent(buildUrl(object.page), resolve, reject);
        };

        return comp;
    }

    function injectPlatformsRow() {
        if ($('.platforms-horizontal-row').length) return;

        var targetContainer = $('.main__content').eq(0);
        if (!targetContainer.length) return;

        var html = $(`
            <div class="platforms-horizontal-row" style="padding: 1.5em 2.2em 0 2.2em;">
                <div class="head" style="margin-bottom: 1em; font-size: 1.3em; font-weight: bold; color: #fff;">${getLocalizedString('platforms')}</div>
                <div class="platforms-scroll" style="display: flex; gap: 1em; overflow-x: auto; padding-bottom: 0.5em;"></div>
            </div>
        `);

        var scrollContainer = html.find('.platforms-scroll');

        Object.keys(SERVICE_CONFIGS).forEach(function (sid) {
            var conf = SERVICE_CONFIGS[sid];
            var card = $(`
                <div class="platform-card selector" style="min-width: 13em; height: 5.5em; background: ${conf.bg}; border-radius: 0.8em; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid rgba(255,255,255,0.1); transition: transform 0.2s;">
                    ${conf.logo}
                </div>
            `);

            card.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: conf.title,
                    component: 'studios_main',
                    service_id: sid,
                    page: 1
                });
            });

            scrollContainer.append(card);
        });

        targetContainer.prepend(html);
    }

    function startPlugin() {
        if (window.plugin_studios_horizontal_ready) return;
        window.plugin_studios_horizontal_ready = true;

        Lampa.Component.add('studios_main', StudiosMain);
        Lampa.Component.add('studios_view', StudiosView);

        if (!$('#studios-horizontal-css').length) {
            $('body').append(`
                <style id="studios-horizontal-css">
                    .platform-card.focus {
                        border-color: #fff !important;
                        transform: scale(1.05);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    }
                    .platforms-scroll::-webkit-scrollbar { display: none; }
                </style>
            `);
        }

        Lampa.Listener.follow('activity', function (e) {
            if (e.type === 'start' && e.component === 'main') {
                setTimeout(injectPlatformsRow, 500);
            }
        });
    }

    if (!window.plugin_studios_horizontal_ready) startPlugin();
})();
