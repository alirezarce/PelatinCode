$(window).on('load', function() {

    
    $('#form-edit').validate({
        rules:{
            title : "required",
            link : "required",
           
        },
        messages:{
            
            title : "لطفا عنوان  را وارد نمایید.",
            link : "لطفا لینک ویدیو را وارد نمایید.",
        }
    });



});
function delete_img(video_id,course_id)
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
            redirect(BACKEND_URL+"offlineCourse/edit_video/"+video_id+"/"+course_id+"?del=1");
        }
      })
}
