var category = {
    "delete_title" : "حذف",
    "delete_text" : "آیا میخواهید <b class=\"text-danger\">{{title}}</b> حذف شود ؟",
};

$(window).on('load', function() {
    i18next.addResourceBundle('lang', 'translation', {category});
});