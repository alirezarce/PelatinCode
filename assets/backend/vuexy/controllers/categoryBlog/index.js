$(window).on('load', function() {

    $('#parent_id').select2({"width":"100%"});


});



function deleteRow(title,id,url)
{
    Swal.fire({
        title: 'حذف',
        html: 'آیا میخواهید ' + '<b class="text-danger">' + title +  '</b>' + ' حذف شود ؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:  'بله',
        cancelButtonText: 'خیر',
      }).then((result) => {
        if (result.isConfirmed) 
        {
          url += '&del_id=' + id;
          redirect(url);
        }
    });
}