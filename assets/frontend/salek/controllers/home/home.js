 // Function to get URL parameters
 function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


const msgParam5 = getQueryParam('msg');
if (msgParam === 'typ-course-invalid') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'خرید نا موفق!',
        text: 'نوع دوره  نامعتبر است!',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}