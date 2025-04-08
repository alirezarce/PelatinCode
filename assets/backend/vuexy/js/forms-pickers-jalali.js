/**
 * Form Picker
 */

'use strict';

/* important for jalali bootstrap date */
window.Date = window.JDate;

// Flat Picker
(function () {

    //flatpickr.l10ns.default.firstDayOfWeek = 6;

    // Flat Picker
    // --------------------------------------------------------------------
    const flatpickrDate = document.querySelector('#flatpickr-date'),
        flatpickrTime = document.querySelector('#flatpickr-time'),
        flatpickrDateTime = document.querySelector('#flatpickr-datetime'),
        flatpickrMulti = document.querySelector('#flatpickr-multi'),
        flatpickrRange = document.querySelector('#flatpickr-range'),
        flatpickrInline = document.querySelector('#flatpickr-inline'),
        flatpickrFriendly = document.querySelector('#flatpickr-human-friendly'),
        flatpickrDisabledRange = document.querySelector('#flatpickr-disabled-range');

    // Date
    if (flatpickrDate) {
        flatpickrDate.flatpickr({
            disableMobile: "true",
            monthSelectorType: 'static',
            locale: 'fa',
            altFormat: 'Y/m/d',
        });
    }

    // Time
    if (flatpickrTime) {
        flatpickrTime.flatpickr({
            disableMobile: "true",
            enableTime: true,
            noCalendar: true,
            locale: 'fa',
            altInput: true,
            altFormat: 'H:i',
        });
    }

    // Datetime
    if (flatpickrDateTime) {
        flatpickrDateTime.flatpickr({
            disableMobile: "true",
            enableTime: true,
            dateFormat: 'Y/m/d H:i',
            locale: 'fa',
        });
    }

    // Multi Date Select
    if (flatpickrMulti) {
        flatpickrMulti.flatpickr({
            disableMobile: "true",
            weekNumbers: true,
            enableTime: true,
            locale: 'fa',
            mode: 'multiple',
            dateFormat: 'Y/m/d H:i',
            minDate: 'today'
        });
    }

    // Range
    if (typeof flatpickrRange != undefined) {
        flatpickrRange.flatpickr({
            disableMobile: "true",
            mode: 'range',
            locale: 'fa',
            dateFormat: 'Y/m/d',
        });
    }

    // Inline
    if (flatpickrInline) {
        flatpickrInline.flatpickr({
            disableMobile: "true",
            inline: true,
            allowInput: false,
            dateFormat: 'Y/m/d',
            monthSelectorType: 'static',
            locale: 'fa',
        });
    }

    // Human Friendly
    if (flatpickrFriendly) {
        flatpickrFriendly.flatpickr({
            disableMobile: "true",
            altInput: true,
            altFormat: 'j F Y',
            dateFormat: 'Y/m/d',
            locale: 'fa',
        });
    }

    // Disabled Date Range
    if (flatpickrDisabledRange) {
        const fromDate = new JDate(JDate.now() - 3600 * 1000 * 48);
        const toDate = new JDate(JDate.now() + 3600 * 1000 * 48);

        flatpickrDisabledRange.flatpickr({
            disableMobile: "true",
            dateFormat: 'Y/m/d',
            locale: 'fa',
            disable: [
                {
                    from: fromDate.toISOString().split('T')[0],
                    to: toDate.toISOString().split('T')[0]
                }
            ]
        });
    }
})();

$.fn.datepicker.dates['fa'] = {
    days: ["ŪŚ©Ų´Ł†ŲØŁ‡", "ŲÆŁŲ´Ł†ŲØŁ‡", "Ų³Ł‡ā€Ų´Ł†ŲØŁ‡", "Ś†Ł‡Ų§Ų±Ų´Ł†ŲØŁ‡", "Ł¾Ł†Ų¬Ų´Ł†ŲØŁ‡", "Ų¬Ł…Ų¹Ł‡", "Ų´Ł†ŲØŁ‡"],
    daysShort: ["ŪŚ©", "ŲÆŁ", "Ų³Ł‡", "Ś†Ł‡Ų§Ų±", "Ł¾Ł†Ų¬", "Ų¬Ł…Ų¹Ł‡", "Ų´Ł†ŲØŁ‡"],
    daysMin: ["Ū", "ŲÆ", "Ų³", "Ś†", "Ł¾", "Ų¬", "Ų´"],
    months: ["ŁŲ±ŁŲ±ŲÆŪŁ†", "Ų§Ų±ŲÆŪŲØŁ‡Ų´ŲŖ", "Ų®Ų±ŲÆŲ§ŲÆ", "ŲŖŪŲ±", "Ł…Ų±ŲÆŲ§ŲÆ", "Ų´Ł‡Ų±ŪŁŲ±", "Ł…Ł‡Ų±", "Ų¢ŲØŲ§Ł†", "Ų¢Ų°Ų±", "ŲÆŪ", "ŲØŁ‡Ł…Ł†", "Ų§Ų³ŁŁ†ŲÆ"],
    monthsShort: ["ŁŲ±ŁŲ±ŲÆŪŁ†", "Ų§Ų±ŲÆŪŲØŁ‡Ų´ŲŖ", "Ų®Ų±ŲÆŲ§ŲÆ", "ŲŖŪŲ±", "Ł…Ų±ŲÆŲ§ŲÆ", "Ų´Ł‡Ų±ŪŁŲ±", "Ł…Ł‡Ų±", "Ų¢ŲØŲ§Ł†", "Ų¢Ų°Ų±", "ŲÆŪ", "ŲØŁ‡Ł…Ł†", "Ų§Ų³ŁŁ†ŲÆ"],
    today: "Ų§Ł…Ų±ŁŲ²",
    clear: "Ł¾Ų§Ś© Ś©Ų±ŲÆŁ†",
    titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
    weekStart: 6
};

// * Pickers with jQuery dependency (jquery)
$(function () {
    // Bootstrap Datepicker
    // --------------------------------------------------------------------

    var bsDatepickerBasic = $('#bs-datepicker-basic'),
        bsDatepickerFormat = $('#bs-datepicker-format'),
        bsDatepickerRange = $('#bs-datepicker-daterange'),
        bsDatepickerDisabledDays = $('#bs-datepicker-disabled-days'),
        bsDatepickerMultidate = $('#bs-datepicker-multidate'),
        bsDatepickerOptions = $('#bs-datepicker-options'),
        bsDatepickerAutoclose = $('#bs-datepicker-autoclose'),
        bsDatepickerInlinedate = $('#bs-datepicker-inline');

    // Basic
    if (bsDatepickerBasic.length) {
        bsDatepickerBasic.datepicker({
            language: 'fa',
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            orientation: isRtl ? 'auto right' : 'auto left'
        });
    }

    // Format
    if (bsDatepickerFormat.length) {
        bsDatepickerFormat.datepicker({
            language: 'fa',
            todayHighlight: true,
            format: 'yyyy/mm/dd',
            orientation: isRtl ? 'auto right' : 'auto left'
        });
    }

    // Range
    if (bsDatepickerRange.length) {
        bsDatepickerRange.datepicker({
            language: 'fa',
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            orientation: isRtl ? 'auto right' : 'auto left'
        });
    }

    // Disabled Days
    if (bsDatepickerDisabledDays.length) {
        bsDatepickerDisabledDays.datepicker({
            language: 'fa',
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            daysOfWeekDisabled: [0, 6],
            orientation: isRtl ? 'auto right' : 'auto left'
        });
    }

    // Multiple
    if (bsDatepickerMultidate.length) {
        bsDatepickerMultidate.datepicker({
            language: 'fa',
            format: 'yyyy/mm/dd',
            multidate: true,
            todayHighlight: true,
            orientation: isRtl ? 'auto right' : 'auto left'
        });
    }

    // Options
    if (bsDatepickerOptions.length) {
        bsDatepickerOptions.datepicker({
            language: 'fa',
            format: 'yyyy/mm/dd',
            calendarWeeks: true,
            clearBtn: true,
            todayHighlight: true,
            orientation: isRtl ? 'auto left' : 'auto right'
        });
    }

    // Auto close
    if (bsDatepickerAutoclose.length) {
        bsDatepickerAutoclose.datepicker({
            format: 'yyyy/mm/dd',
            language: 'fa',
            todayHighlight: true,
            autoclose: true,
            orientation: isRtl ? 'auto right' : 'auto left'
        });
    }

    // Inline picker
    if (bsDatepickerInlinedate.length) {
        bsDatepickerInlinedate.datepicker({
            format: 'yyyy/mm/dd',
            language: 'fa',
            todayHighlight: true
        });
    }

    // Bootstrap Daterange Picker
    // --------------------------------------------------------------------


    var dateRangePickerFa = {
        "format": "YYYY/MM/DD",
        "separator": " - ",
        "applyLabel": "Ų§Ų¹Ł…Ų§Ł„",
        "cancelLabel": "Ų§Ł†ŲµŲ±Ų§Ł",
        "startLabel": 'ŲŖŲ§Ų±ŪŲ® Ų´Ų±ŁŲ¹',
        "endLabel": 'ŲŖŲ§Ų±ŪŲ® Ł¾Ų§ŪŲ§Ł†',
        "fromLabel": "Ų§Ų²",
        "toLabel": "ŲŖŲ§",
        "weekLabel": "Ł‡ŁŲŖŁ‡",
        "customRangeLabel": "Ų§Ł†ŲŖŲ®Ų§ŲØ ŲØŲ§Ų²Ł‡",
        "daysOfWeek": ["Ū", "ŲÆ", "Ų³", "Ś†", "Ł¾", "Ų¬", "Ų´"],
        "monthNames": ["ŁŲ±ŁŲ±ŲÆŪŁ†", "Ų§Ų±ŲÆŪŲØŁ‡Ų´ŲŖ", "Ų®Ų±ŲÆŲ§ŲÆ", "ŲŖŪŲ±", "Ł…Ų±ŲÆŲ§ŲÆ", "Ų´Ł‡Ų±ŪŁŲ±", "Ł…Ł‡Ų±", "Ų¢ŲØŲ§Ł†", "Ų¢Ų°Ų±", "ŲÆŪ", "ŲØŁ‡Ł…Ł†", "Ų§Ų³ŁŁ†ŲÆ"],
        "firstDay": 6
    };

    var dateRangePickerTimeFa = {
        "format": "YYYY/MM/DD h:mm A",
        "separator": " - ",
        "applyLabel": "Ų§Ų¹Ł…Ų§Ł„",
        "cancelLabel": "Ų§Ł†ŲµŲ±Ų§Ł",
        "startLabel": 'ŲŖŲ§Ų±ŪŲ® Ų´Ų±ŁŲ¹',
        "endLabel": 'ŲŖŲ§Ų±ŪŲ® Ł¾Ų§ŪŲ§Ł†',
        "fromLabel": "Ų§Ų²",
        "toLabel": "ŲŖŲ§",
        "weekLabel": "Ł‡ŁŲŖŁ‡",
        "customRangeLabel": "Ų§Ł†ŲŖŲ®Ų§ŲØ ŲØŲ§Ų²Ł‡",
        "daysOfWeek": ["Ū", "ŲÆ", "Ų³", "Ś†", "Ł¾", "Ų¬", "Ų´"],
        "monthNames": ["ŁŲ±ŁŲ±ŲÆŪŁ†", "Ų§Ų±ŲÆŪŲØŁ‡Ų´ŲŖ", "Ų®Ų±ŲÆŲ§ŲÆ", "ŲŖŪŲ±", "Ł…Ų±ŲÆŲ§ŲÆ", "Ų´Ł‡Ų±ŪŁŲ±", "Ł…Ł‡Ų±", "Ų¢ŲØŲ§Ł†", "Ų¢Ų°Ų±", "ŲÆŪ", "ŲØŁ‡Ł…Ł†", "Ų§Ų³ŁŁ†ŲÆ"],
        "firstDay": 6
    };

    var bsRangePickerBasic = $('#bs-rangepicker-basic'),
        bsRangePickerSingle = $('#bs-rangepicker-single'),
        bsRangePickerTime = $('#bs-rangepicker-time'),
        bsRangePickerRange = $('#bs-rangepicker-range'),
        bsRangePickerWeekNum = $('#bs-rangepicker-week-num'),
        bsRangePickerDropdown = $('#bs-rangepicker-dropdown'),
        bsRangePickerCancelBtn = document.getElementsByClassName('cancelBtn');

    // Basic
    if (bsRangePickerBasic.length) {
        bsRangePickerBasic.daterangepicker({
            locale: dateRangePickerFa,
            opens: isRtl ? 'left' : 'right'
        });
    }

    // Single
    if (bsRangePickerSingle.length) {
        bsRangePickerSingle.daterangepicker({
            locale: dateRangePickerFa,
            singleDatePicker: true,
            opens: isRtl ? 'left' : 'right'
        });
    }

    // Time & Date
    if (bsRangePickerTime.length) {
        bsRangePickerTime.daterangepicker({
            timePicker: true,
            timePickerIncrement: 30,
            locale: dateRangePickerTimeFa,
            opens: isRtl ? 'left' : 'right'
        });
    }

    if (bsRangePickerRange.length) {
        bsRangePickerRange.daterangepicker({
            locale: dateRangePickerFa,
            ranges: {
                'Ų§Ł…Ų±ŁŲ²': [moment(), moment()],
                'ŲÆŪŲ±ŁŲ²': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '7 Ų±ŁŲ² Ł‚ŲØŁ„': [moment().subtract(6, 'days'), moment()],
                'Ū³Ū° Ų±ŁŲ² Ł‚ŲØŁ„': [moment().subtract(29, 'days'), moment()],
                'Ų§ŪŁ† Ł…Ų§Ł‡': [moment().startOf('month'), moment().endOf('month')],
                'Ł…Ų§Ł‡ Ł‚ŲØŁ„Ū': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: isRtl ? 'left' : 'right'
        });
    }

    // Week Numbers
    if (bsRangePickerWeekNum.length) {
        bsRangePickerWeekNum.daterangepicker({
            locale: dateRangePickerFa,
            showWeekNumbers: true,
            opens: isRtl ? 'left' : 'right'
        });
    }
    // Dropdown
    if (bsRangePickerDropdown.length) {
        bsRangePickerDropdown.daterangepicker({
            locale: dateRangePickerFa,
            showDropdowns: true,
            opens: isRtl ? 'left' : 'right'
        });
    }

    // Adding btn-label-secondary class in cancel btn
    for (var i = 0; i < bsRangePickerCancelBtn.length; i++) {
        bsRangePickerCancelBtn[i].classList.remove('btn-default');
        bsRangePickerCancelBtn[i].classList.add('btn-label-primary');
    }

    // jQuery Timepicker
    // --------------------------------------------------------------------

    var timePickerLocaleFa = {
        am: ' Ł‚.Ųø',
        pm: ' ŲØ.Ųø',
        AM: ' Ł‚.Ųø',
        PM: ' ŲØ.Ųø',
        decimal: '.',
        mins: 'ŲÆŁ‚ŪŁ‚Ł‡',
        hr: 'Ų³Ų§Ų¹ŲŖ',
        hrs: 'Ų³Ų§Ų¹ŲŖ'
    };

    var basicTimepicker = $('#timepicker-basic'),
      minMaxTimepicker = $('#timepicker-min-max'),
      disabledTimepicker = $('#timepicker-disabled-times'),
      formatTimepicker = $('#timepicker-format'),
      stepTimepicker = $('#timepicker-step'),
      altHourTimepicker = $('#timepicker-24hours');

    // Basic
    if (basicTimepicker.length) {
        basicTimepicker.timepicker({
            lang: timePickerLocaleFa,
            orientation: isRtl ? 'r' : 'l'
        });
    }

    // Min & Max
    if (minMaxTimepicker.length) {
        minMaxTimepicker.timepicker({
            lang: timePickerLocaleFa,
            minTime: '2:00pm',
            maxTime: '7:00pm',
            showDuration: true,
            orientation: isRtl ? 'r' : 'l'
        });
    }

    // Disabled Picker
    if (disabledTimepicker.length) {
        disabledTimepicker.timepicker({
            lang: timePickerLocaleFa,
            disableTimeRanges: [
                ['12am', '3am'],
                ['4am', '4:30am']
            ],
            orientation: isRtl ? 'r' : 'l'
        });
    }

    // Format Picker
    if (formatTimepicker.length) {
        formatTimepicker.timepicker({
            lang: timePickerLocaleFa,
            timeFormat: 'H:i:s',
            orientation: isRtl ? 'r' : 'l'
        });
    }

    // Steps Picker
    if (stepTimepicker.length) {
        stepTimepicker.timepicker({
            lang: timePickerLocaleFa,
            step: 15,
            orientation: isRtl ? 'r' : 'l'
        });
    }

    // 24 Hours Format
    if (altHourTimepicker.length) {
        altHourTimepicker.timepicker({
            lang: timePickerLocaleFa,
            show: '24:00',
            timeFormat: 'H:i:s',
            orientation: isRtl ? 'r' : 'l'
        });
    }
});