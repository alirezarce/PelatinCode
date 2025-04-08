$(document).ready(function() {
    let mobile;
    let password;
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        mobile = $('#mobile').val();
        password = $('#password').val();
        // Send phone number to server for OTP generation
        $.post('user/login', { mobile: mobile ,password:password}, function(data) {
            if (data.success) {
                window.location.href = "user/dashboard"; 
            } else {
                 Swal.fire({
                      icon: 'error',
                      title: 'خطا',
                      text: 'خطا در   ورود کاربر: ' + data.message,
                      confirmButtonText: 'تایید',
                });
                
            }
        });
    });


});

 // Function to get URL parameters
 function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


// Check if the `msg` parameter is `ok`
const msgParam = getQueryParam('msg');
if (msgParam === 'success-logout') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'با موفقیت خارج شدید.',
        icon: 'success',
        confirmButtonText: 'Show Modal',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}


// Check if the `msg` parameter is `ok`
const msgParam2 = getQueryParam('msg');
if (msgParam2 === 'no-access') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: '  برای دسترسی به این قسمت باید وارد حساب کاربری شوید.',
        icon: 'error',
        confirmButtonText: 'Show Modal',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}