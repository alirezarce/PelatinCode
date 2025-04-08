$(window).on('load', function() {

    $('#group').select2()

    $('#form-send').validate({
        rules:{
            group : "required"
            
        },
        messages:{
            
            group : "لطفا گروه کاربران   را انتخاب نمایید.",
            
        }
    });
});