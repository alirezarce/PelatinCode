$(window).on('load', function() {

    $('#parent_id').select2({"width":"100%"});

    $('#form-add').validate({
        rules:{
           
            title : "required",
            
        },
        messages:{
            title : 'لطفا نام گروه  را وارد نمایید.',
         
        }
    });


});
