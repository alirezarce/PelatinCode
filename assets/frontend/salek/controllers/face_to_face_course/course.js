 // Function to get URL parameters
 function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Check if the `msg` parameter is `ok`
const msgParam = getQueryParam('msg');
if (msgParam === 'pyment-success') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'خرید موفق!',
        text: 'شما میتوانید درقسمت داشبورد کاربری دوره را مشاهده کنید ',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}
// Check if the `msg` parameter is `ok`
const msgParam3 = getQueryParam('msg');
if (msgParam3 === 'pyment-isdup') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'خرید نا موفق!',
        text: 'شما میتوانید درقسمت داشبورد کاربری دوره را مشاهده کنید ',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}
// Check if the `msg` parameter is `ok`
const msgParam5 = getQueryParam('msg');
if (msgParam5 === 'pyment-not-success') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'خرید نا موفق!',
        text: 'عملیات خرید با خطا مواجح شد لطفا مجددا تلاش کنید',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}



// Check if the `msg` parameter is `ok`
const msgParam2 = getQueryParam('msg');
if (msgParam2 === 'success-add') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: '  ! شما در دوره رایگان ثبت شدین',
        text: 'شما میتوانید درقسمت داشبورد کاربری دوره را مشاهده کنید ',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}




const msgParam4 = getQueryParam('msg');
if (msgParam === 'course-not-found') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'خرید نا موفق!',
        text: 'دوره یافت نشد',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}

const msgParam7 = getQueryParam('msg');
if (msgParam7 === 'err-add') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'ثبت  نا موفق!',
        text: ' در این  دوره قبلا ثبت نام  شدین ! ',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}

// Check if the `msg` parameter is `ok`
const msgParam6 = getQueryParam('msg');
if (msgParam6 === 'pyment-error') {
    // Show SweetAlert2 alert first
    Swal.fire({
        title: 'خرید نا موفق!',
        text: ' شما از خرید انصراف دادین لطفا مجددا تلاش کنید',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000

    }).then(() => {
        // Show Bootstrap Modal after alert is confirmed
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    });
}