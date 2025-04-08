$(document).ready(function() {
    let mobile;

    let timerInterval;
    let remainingTime;
     let resendEnabled = false;

    $('#recoveryForm').on('submit', function(e) {
        e.preventDefault();
        mobile = $('#mobile').val();
        password = $('#password').val();
        confirm_password = $('#confirm_password').val();
        $('#mobile').prop('disabled', true); // disable phone number field

        // Send phone number to server for OTP generation
        $.post('/user/recovery', { mobile: mobile}, function(data) {
            if (data.success) {
              showOtpModal();
            } else {
                 Swal.fire({
                      icon: 'error',
                      title: 'خطا',
                      text: 'خطا در ارسال کد تایید: ' + data.message,
                    });
                $('#mobile').prop('disabled', false); // enable phone number field
            }
        });
    });
    
    function showOtpModal() {
        Swal.fire({
             title: 'تایید شماره موبایل',
              html: `
                <div class="form-group">
                  <label for="swal-otp">کد تایید</label>
                  <input type="text" class="form-control" id="swal-otp" placeholder="کد تایید را وارد کنید" required>
                </div>
                 <div id="timerDisplay" class="text-center mb-3"></div>
                 <button type="button" class="btn btn-link btn-block text-danger" id="resendOtpBtn" style="display: none;">ارسال مجدد کد</button>
               `,
              confirmButtonText: 'تایید',
             showCancelButton: true,
              cancelButtonText: 'لغو',
            didOpen: () => {
                  startTimer();
                     $('#swal-otp').focus();
                },
            preConfirm: () => {
                const otp = $('#swal-otp').val();
                 return new Promise((resolve) => {
                       $.post('/user/verify-otp-recovery', { mobile: mobile, otp: otp }, function(data) {
                            if (data.success) {
                                 resolve(true);
                              } else {
                                    Swal.showValidationMessage(
                                        `کد تایید اشتباه است`
                                    );
                                     resolve(false);
                                }
                         });
                    });
                  },
                }).then((result) => {
                   if (result.isConfirmed) {
                         Swal.fire({
                                icon: 'success',
                                title: 'تبریک!',
                                text: 'احراز تلفن همراه با موفقیت انجام شد',
                                confirmButtonText: 'تایید',
                            }).then(() => {
                                window.location.href = `user/reset-password/${mobile}`; // یا هر مسیری که میخواهید کاربر وارد شود
                           });
                    } else {
                         $('#mobile').prop('disabled', false);
                    }
                 });
    }
    
      function startTimer() {
           resendEnabled = false;
            $('#timerDisplay').text('');
           $('.swal2-content #resendOtpBtn').hide();
            remainingTime = 90;
            updateTimerDisplay();
           $('.swal2-confirm').prop('disabled',true);
            timerInterval = setInterval(function () {
                remainingTime--;
                updateTimerDisplay();

                if (remainingTime <= 0) {
                     clearInterval(timerInterval);
                    $('.swal2-confirm').prop('disabled',true);
                   $('.swal2-content #resendOtpBtn').show();
                       resendEnabled = true;
                   Swal.showValidationMessage(
                        'زمان کد تایید به پایان رسید. لطفاً دوباره کد تایید را ارسال کنید.'
                    );
                } else {
                    $('.swal2-confirm').prop('disabled',false);
                }
            }, 1000);
    }

      function updateTimerDisplay() {
         $('.swal2-content #timerDisplay').html(`زمان باقیمانده: ${remainingTime} ثانیه`);
        }

    $(document).on('click', '.swal2-content #resendOtpBtn', function(e) {
            e.preventDefault();
            Swal.close();
          // Send phone number to server for OTP generation
          $.post('user/register', { mobile: mobile ,password:password,confirm_password:confirm_password }, function(data) {
            if (data.success) {
               showOtpModal();
            } else {
               Swal.fire({
                      icon: 'error',
                      title: 'خطا',
                      text: 'خطا در ارسال کد تایید: ' + data.message,
                });
            }
        });
     });
});