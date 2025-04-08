var category = {
    "validation_parent_id_required" : "لطفا والد دسته را انتخاب نمایید.",
    "validation_title_required" : "لطفا عنوان دسته را وارد نمایید.",
    "validation_title_seo_required" :  "لطفا عنوان صفحه SEO را وارد نمایید.",
    "validation_description_seo_required" : "لطفا توضیحات SEO را وارد نمایید.",
};

$(window).on('load', function() {
    i18next.addResourceBundle('lang', 'translation', {category});
});