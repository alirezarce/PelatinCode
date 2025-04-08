$(window).on('load', function() {
    initEditor('long_description') 

    $('#form-add').validate({
        rules:{
            name : "required",
            short_description : "required",
            long_description : "required",
            title_seo : "required",
            description_seo : "required",
            slug : {
                required : true,
                slug : true,
            },
        },
        messages:{
            title_seo : 'لطفا عنوان صفحه SEO را وارد نمایید.',
            description_seo : 'لطفا توضیحات SEO را وارد نمایید.',
            slug :{
                required :  'لطفا slug را وارد نمایید.',
                "slug" : 'slug باید a -> z,0 -> 9,- باشد',
            },
            name : "لطفا نام  را وارد نمایید.",
            short_description : "لطفا توضیحات کوتاه را وارد نمایید.",
            long_description : "لطفا توضیحات کامل را وارد نمایید.",
        }
    });


});
