
$(document).ready(function(){

  if(jQuery.validator)
  {
      jQuery.validator.addMethod("slug", function(value, element) {
        return this.optional( element ) || /^[a-z0-9-]+$/.test( value );
      },'validation_slug_invalid');
    
  }


  if($('.pagination-input-page').length > 0)
  { 
      $('.pagination-input-page').keyup(function(e){
          if(e.keyCode == 13)
          {
            var page = parseInt($(this).val());
            if(isNaN(page) || page <= 0)
              page = 1;
            redirect($(this).attr('data-pagination-url')+'&page='+page);
          }
      });
  }

});



$(window).on('load', function() {
    if (feather) {
        feather.replace({
            width: 14,
            height: 14
        });
    }

 


})




function logout()
{
  Swal.fire({
    title: 'خروج',
    text: 'آیا میخواهید خارج شوید ؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText:  'بله',
    cancelButtonText: 'خیر',
  }).then((result) => {
    if (result.isConfirmed) 
    {
      redirect(BACKEND_URL+'user/logout');
    }
  })

}




function redirect(url)
{
  location.href = url;
}




function initEditor(obj)
{
    config = {};
    config.height = 700;
    config.removePlugins = 'exportpdf,image,flash,forms,save';
    config.extraPlugins = 'image2,media';
    config.contentsLangDirection = 'rtl';
    CKEDITOR.replace(obj,config);
}
