(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    function getTmdbKey() {
        var custom = Lampa.Storage.get('flixio_tmdb_apikey', '');
        if (custom && custom.length > 5) return custom;
        return Lampa.TMDB && Lampa.TMDB.key ? Lampa.TMDB.key() : '4ef358b6a7e6c029a27ef64805faab51';
    }

    var lang = Lampa.Storage.get('language', 'ru') === 'ua' ? 'uk' : Lampa.Storage.get('language', 'ru');
    var today = new Date().toISOString().split('T')[0];
    
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    var dateStart = d.toISOString().split('T')[0];

    var TITLES = {
        ru: { ru: '🇷🇺 Русские новинки', ua: '🇺🇦 Украинские новинки', world: '🌍 Мировые новинки' },
        uk: { ru: '🇷🇺 Російські новинки', ua: '🇺🇦 Українські новинки', world: '🌍 Світові новинки' }
    }[lang === 'uk' ? 'uk' : 'ru'];

    var FEEDS_CONFIG = [
        { id: 1, title: TITLES.ru, movie: '&with_origin_country=RU', tv: '&with_original_language=ru' }, 
        { id: 2, title: TITLES.ua, movie: '&with_origin_country=UA', tv: '&with_origin_country=UA' },
        { id: 3, title: TITLES.world, movie: '&vote_count.gte=10', tv: '&vote_count.gte=10' }
    ];

    function addCombinedRow(feed) {
        Lampa.ContentRows.add({
            index: 25 + feed.id,
            name: 'news_v3_row_' + feed.id,
            title: feed.title,
            screen: ['main'],
            call: function (params) {
                return function (callback) {
                    var network = new Lampa.Reguest();
                    var apiKey = getTmdbKey();
                    var apiBase = 'https://api.themoviedb.org/3/discover/';
                    
                    var results = [];
                    // Запрашиваем по 1 странице для максимальной производительности
                    var movieParams = 'api_key=' + apiKey + '&language=' + lang + '&sort_by=primary_release_date.desc&primary_release_date.gte=' + dateStart + '&primary_release_date.lte=' + today + feed.movie + '&page=1';
                    var tvParams = 'api_key=' + apiKey + '&language=' + lang + '&sort_by=first_air_date.desc&first_air_date.gte=' + dateStart + '&first_air_date.lte=' + today + feed.tv + '&page=1';

                    network.silent(apiBase + 'movie?' + movieParams, function (movies) {
                        if (movies && movies.results) results = results.concat(movies.results);
                        
                        network.silent(apiBase + 'tv?' + tvParams, function (tvs) {
                            if (tvs && tvs.results) {
                                tvs.results.forEach(function(i){ 
                                    i.first_air_date ? i.type = 'tv' : i.type = 'movie'; 
                                });
                                results = results.concat(tvs.results);
                            }

                            results.sort(function (a, b) {
                                var d1 = new Date(a.release_date || a.first_air_date || 0);
                                var d2 = new Date(b.release_date || b.first_air_date || 0);
                                return d2 - d1;
                            });

                            var unique = results.filter(function(v, i, a) {
                                return a.findIndex(function(t) { return t.id === v.id; }) === i;
                            }).filter(function(item) { 
                                return item.poster_path !== null; 
                            });

                            callback({
                                // Лимит 30: идеальный баланс между контентом и скоростью появления плашек сезонов
                                results: unique.slice(0, 30),
                                title: feed.title
                            });
                        }, function() { callback({results: results, title: feed.title}); });
                    }, function() { callback({results: [], title: feed.title}); });
                };
            }
        });
    }

    function init() {
        FEEDS_CONFIG.forEach(function(f) { addCombinedRow(f); });
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
