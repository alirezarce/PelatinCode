$(window).on('load', function() {
    $('#group_id').select2({"width":"100%"});
    $('#country').select2({"width":"100%"});

    $('#category_id').change(function(){
        var val = $(this).val();
        if(val != '' )
        {
            console.log(val);
            $.post(BACKEND_URL+'challenge/getSubCat',{"category_id":val},function(result){
                $('#result-subcat').html(result);
                $('#sub_category_id').select2({"width":"100%"});
            });
        }
    });

    $('#form-add').validate({
        rules:{
            fn:"required",
            mobile : "required",
        },
        messages:{
            mobile:'موبایل کاربر را وارد کنید',
            fn:'نام کاربر را وارد کنید'

        }
    });


});
