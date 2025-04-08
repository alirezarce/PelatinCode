function redirect(url)
{
  location.href = url;
}


function delete_avatar()
{
    Swal.fire({
        title: 'حذف',
        text: 'آیا میخواهید تصویر پروفابل حذف شود ؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:  'بله',
        cancelButtonText: 'خیر',
      }).then((result) => {
        if (result.isConfirmed) 
        {
          redirect(FRONTEND_URL+'user/profile/?del=1');
        }
      })
}

 // Function to get URL parameters
 function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Check if the `msg` parameter is `ok`
const msgParam = getQueryParam('msg');
if (msgParam === 'ok') {
  // Show SweetAlert2 alert first
  Swal.fire({
      title: 'ویرایش موفق!',
      text: 'اطلاعات شما با موفقیت بروزرسانی شد',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000

  }).then(() => {
      // Show Bootstrap Modal after alert is confirmed
      const myModal = new bootstrap.Modal(document.getElementById('myModal'));
      myModal.show();
  });
}