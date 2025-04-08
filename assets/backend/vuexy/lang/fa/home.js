var home = {
    "login" : "login - login"
};

$(window).on('load', function() {
    i18next.addResourceBundle('lang', 'translation', {home});
});