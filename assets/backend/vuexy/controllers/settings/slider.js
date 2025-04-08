

$(window).on('load', function() {

    

    $('#form-edit').validate({
        rules:{
          
            title : "required",
            img : "required",
           
        },
        messages:{
            img : 'لطفا  تصویر را انتخاب نمایید.',
            title : 'لطفا عنوان دسته را وارد نمایید.',
         
          
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
            redirect(BACKEND_URL+"/settings/edit_slider/"+id+"?del=1");
        }
      })
}