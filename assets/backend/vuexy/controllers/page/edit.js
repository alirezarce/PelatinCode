$(window).on('load', function() {
    initEditor('content');

    $('#form-edit').validate({
        rules:{
            content : "required",
            title_seo : "required",
            description_seo : "required",
        },
        messages:{
            title_seo : 'لطفا عنوان صفحه SEO را وارد نمایید.',
            description_seo : 'لطفا توضیحات SEO را وارد نمایید.',
            content : "لطفا متن صفحه را وارد نمایید.",
        }
    });


});
