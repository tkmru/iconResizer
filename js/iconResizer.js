function preventOpenTab(event) {
    event.preventDefault(); //prevent default browser action
}


function insertImage(event) {
    event.preventDefault(); //prevent default browser action
    var file = event.dataTransfer.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var img_base64 = reader.result;
        //console.log(img_base64);
        $('#droppable').html('<img id="dropped" src="' + img_base64 + '" width="380" height="380">');
    }
}


// http://qiita.com/kbyay_/items/7a7ce9547f29b34a63b1
$('.chrome_extention_checkbox:eq(0)').click(function() {
    if ($('.chrome_extention_checkbox:eq(0)').prop('checked')) {
        $('.size_checkbox:eq(6)').prop("checked", true); 
    }
});

$('.chrome_extention_checkbox:eq(1)').click(function() {
    if ($('.chrome_extention_checkbox:eq(1)').prop('checked')) {
        $('.size_checkbox:eq(6)').prop("checked", true); 
    }
});


$(function() {
    $("#size_checkboxes > li > label").hover(function() {
        var expanded_checkbox = $("+ ul", this);
        expanded_checkbox.slideDown();
        $("#size_checkboxes > li > label + ul").not(expanded_checkbox).slideUp();
    });
  
    $('[data-toggle=tooltip]').tooltip({
        placement: "right"
    });
});


function resizeImg(size, size_name, counter) {
    var source = document.getElementById('dropped');
    //console.log(canvas_ID);

    $('#resize_temp').append('<canvas class="' + size_name + '" width="' + size + '" height="' + size + '"></canvas>');

    var canvas = document.getElementsByClassName(size_name)[counter];
    var ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0, size, size);

    return canvas.toDataURL().substr(canvas.toDataURL().indexOf(',') + 1); // base64
}


$('#start').click(function() {
    var size_dict = {
        0: ['for-Slack-Bot-Icon', [512]],
        1: ['for-Chrome-Extention', [32, 48, 128]],
    }

    var checked = $('.size_checkbox:checked').map(function() {
        return this.value;
    }).get();

    var chrome_extention_checked = $('.chrome_extention_checkbox:checked').map(function() {
        return this.value;
    }).get();

    if ($('#droppable img').length === 0 || $('.size_checkbox:checked').length === 0) {
        alert('Please check image & checkbox');
        return;
    }

    for (var i = 0; i < checked.length; i++) {
        var size_list = size_dict[checked[i]][1];
        var size_name = size_dict[checked[i]][0];
        var zip = new JSZip();

        if (checked[i] == 6) { // chrome extention
            for (var j = 0; j <= chrome_extention_checked.length; j++) {
                if (chrome_extention_checked[j] === 0) { // browzer Action
                    size_list.push(19);
                    size_list.push(38);

                } else if (chrome_extention_checked[j] === 1) { // context Menus
                    size_list.push(16);
                }
            }
        }

        var index_counter = 0;

        for (var k = 0; k < size_list.length; k++) {
            var canvas_base64 = resizeImg(size_list[k], size_name, index_counter);
            zip.file(size_list[k] + '.png', canvas_base64,  {base64: true});
            index_counter++;
        }

        saveAs(zip.generate({ type: 'blob' }), size_name + '.zip');
    }
    
    $('#resize_temp').html('');
});
