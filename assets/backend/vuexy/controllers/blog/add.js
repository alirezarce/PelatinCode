$(window).on('load', function() {
    $('#category_id').select2({"width":"100%"});
    initEditor('long_description');


   
    

    $('#form-add').validate({
        rules:{
            title : "required",
            category_id : "required",
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
            title : "لطفا عنوان بلاگ را وارد نمایید.",
            category_id : "لطفا دسته بندی چالش را انتخاب نمایید.",
            short_description : "لطفا توضیحات کوتاه را وارد نمایید.",
            long_description : "لطفا توضیحات کامل را وارد نمایید.",
        }
    });


});
