$(window).on('load', function() {


    $('#form-add').validate({
        rules:{
            user_name : "required",
        },
        messages:{
            user_name : 'لطفا نام کاربری را وارد نمایید.',
        }
    });


});
