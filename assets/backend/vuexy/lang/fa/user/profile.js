var profile = {
    "validation_first_name_required" : "لطفا نام را وارد نمایید.",
    "validation_last_name_required" : "لطفا نام خانوادگی را وارد نمایید.",
    "validation_email_required" :  "لطفا ایمیل را وارد نمایید.",
    "validation_email_email" : "ایمیل باید معتبر باشد.",
    "delete_avatar" : "آیا میخواهید تصویر جاری حذف شود ؟",
    "delete" : "حذف",
};

$(window).on('load', function() {
    i18next.addResourceBundle('lang', 'translation', {profile});
});