

 // Function to get URL parameters
 function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Check if the `msg` parameter is `ok`
const msgParam2 = getQueryParam('msg');
if (msgParam2 === 'expire') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: ' این دوره به پایان رسیده است. لطفا دوره جدیدی را خریداری کنید.',
        icon: 'error',
        confirmButtonText: 'Show Modal',
        showConfirmButton: false,
        timer: 2000
    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}