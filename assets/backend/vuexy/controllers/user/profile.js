$(window).on('load', function() {


    $('#form-profile').validate({
        rules:{
            email : {
                required : true,
                email : true
            },
            first_name : "required",
            last_name : "required",
        },
        messages:{
            email : {
                required : 'لطفا ایمبل را وارد نمایید.',
                email : 'ایمیل باید معتبر باشد.',
            },
            first_name : 'لطفا نام را وارد نمایید.',
            last_name : 'لطفا نام خانوادگی را وارد نمایید.',
        }
    });


});


function delete_avatar()
{
    Swal.fire({
        title: 'حذف',
        text: 'آیا میخواهید تصویر پروفابل حذف شود ؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:  'بله',
        cancelButtonText: 'خیر',
      }).then((result) => {
        if (result.isConfirmed) 
        {
          redirect(BACKEND_URL+'user/profile/?del=1');
        }
      })
}