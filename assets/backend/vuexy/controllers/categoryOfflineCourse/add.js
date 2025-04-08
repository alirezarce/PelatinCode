$(window).on('load', function() {

    $('#parent_id').select2({"width":"100%"});

    $('#form-add').validate({
        rules:{
            parent_id : "required",
            title : "required",
            title_seo : "required",
            description_seo : "required",
            description : "required",
            logo : "required",
            slug : {
                required : true,
                slug : true,
            },
        },
        messages:{
            parent_id : 'لطفا والد دسته را انتخاب نمایید.',
            title : 'لطفا عنوان دسته را وارد نمایید.',
            title_seo : 'لطفا عنوان صفحه SEO را وارد نمایید.',
            description_seo : 'لطفا توضیحات SEO را وارد نمایید.',
            slug :{
                required :  'لطفا slug را وارد نمایید',
                "slug" : 'slug باید a -> z,0 -> 9,- باشد',
            },
            description : "لطفا توضیحات را وارد نمایید.",
            logo : "لطفا تصویر را انتخاب نمایید.",
        }
    });


});

function delete_logo()
{
    Swal.fire({
        title: 'حذف',
        text: 'آیا میخواهید تصویر حذف شود ؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:  'بله',
        cancelButtonText: 'خیر',
      }).then((result) => {
        if (result.isConfirmed) 
        {
          redirect(BACKEND_URL+'categoryChallenge/add/?del=1');
        }
      })
}