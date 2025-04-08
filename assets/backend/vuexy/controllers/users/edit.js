$(window).on('load', function() {
    $('#group_id').select2({"width":"100%"});
    $('#country').select2({"width":"100%"});
   
    $('#form-edit').validate({
        rules:{
            fn : "required",
        
        },
        messages:{
            fn : 'لطفا نام کاربر  را وارد نمایید.',
            
        }
    });


});
