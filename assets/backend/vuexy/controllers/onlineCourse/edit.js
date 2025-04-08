$(window).on('load', function() {

    initEditor('long_description');
    
    $('#form-edit').validate({
        rules:{
            title : "required",
            category_id : "required",
            sub_category_id : "required",
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
            sub_category_id : "لطفا زیر دسته چالش را انتخاب نمایید.",
            short_description : "لطفا توضیحات کوتاه را وارد نمایید.",
            long_description : "لطفا توضیحات کامل را وارد نمایید.",
        }
    });



});
function delete_img(id)
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
            redirect(BACKEND_URL+"onlineCourse/edit/"+id+"?del=1");
        }
      })
}
function delete_img1(id)
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
            redirect(BACKEND_URL+"onlineCourse/edit/"+id+"?del=2");
        }
      })
}
function delete_img2(id)
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
            redirect(BACKEND_URL+"onlineCourse/edit/"+id+"?del=3");
        }
      })
}
function delete_img3(id)
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
            redirect(BACKEND_URL+"onlineCourse/edit/"+id+"?del=4");
        }
      })
}


function delete_medium_img(id)
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
            redirect(BACKEND_URL+"onlineCourse/edit/"+id+"?del=5");
        }
      })
}