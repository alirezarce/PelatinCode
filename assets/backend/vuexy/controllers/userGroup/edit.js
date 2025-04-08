$(window).on('load', function() {

    $('#parent_id').select2({"width":"100%"});

    $('#form-edit').validate({
        rules:{
           
            title : "required",
            
        },
        messages:{
            title : 'لطفا نام گروه  را وارد نمایید.',
         
        }
    });


});


function delete_logo(url)
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
          redirect(url+'&del=1');
        }
      })
}