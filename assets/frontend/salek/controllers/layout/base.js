$(document).ready(function() {

});

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
      redirect(FRONTEND_URL+'user/logout');
    }
  })


function redirect(url)
{
  location.href = url;
}


}
