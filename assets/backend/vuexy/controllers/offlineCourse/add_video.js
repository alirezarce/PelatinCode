$(window).on('load', function() {


    $('#form-add').validate({
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
