$(window).on('load', function() {

   $('#mobile').select2();
   

    // $('#mobile').select2({
    //     tags: true,
    //     multiple: false,
    //     tokenSeparators: [',', ' '],
    //     minimumInputLength: 2,
    //     minimumResultsForSearch: 10,
    //     ajax: {
    //         url: "admin/sms/usersMobile",
    //         dataType: "json",
    //         type: "GET",
    //         data: function (params) {
    
    //             var queryParameters = {
    //                 term: params.term
    //             }
    //             return queryParameters;
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: $.map(data, function (item) {
    //                     return {
    //                         text: item.tag_value,
    //                         id: item.tag_id
    //                     }
    //                 })
    //             };
    //         },success: function (textStatus, status) {
    //             console.log(textStatus);
    //             console.log(status);
    //         },error: function(xhr, textStatus, error) {
    //             console.log(xhr.responseText);
    //             console.log(xhr.statusText);
    //             console.log(textStatus);
    //             console.log(error);
    //         }
    //     }
    // });


       


    $('#form-send').validate({
        rules:{
            mobile : "required"
            
        },
        messages:{
            
            mobile : "لطفا موبایل  را وارد نمایید.",
            
        }
    });
          

    


});