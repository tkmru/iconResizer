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
/*
        $('#droppable').html('<canvas id="dropped" width="380" height="380"></canvas>');

        var canvas = document.getElementById("dropped");
        var ctx = canvas.getContext("2d");

        var image = new Image();
        image.src = img_base64;
        image.onload = function() {
            ctx.drawImage(image, 0, 0, 380, 380);
        }
        //console.log(canvas.toDataURL().indexOf(','));
*/
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
    var canvas_ID = size_name + counter;
    console.log(canvas_ID);

    $('#resize_temp').append('<canvas id="' + canvas_ID + '" width="' + size + '" height="' + size + '"></canvas>');

    var canvas = document.getElementById(canvas_ID);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0, size, size);

    return canvas.toDataURL().substr(canvas.toDataURL().indexOf(',') + 1); // base64
}


$('#start').click(function() {
    var size_dict = {
        0: ['iPhone', [57, 114, 120, 29, 58, 80, 512, 1024]],
        1: ['iPad', [72, 144, 76, 152, 40, 80, 50, 100, 512, 1024]],
        2: ['Android', [36, 48, 72, 96, 512]],
        3: ['Windows Phone', [62, 173, 99, 200]],
        4: ['Firefox Phone', [60, 128, 32, 90, 120, 256]],
        5: ['Firefox Extention', [16, 24, 32]],
        6: ['Chrome Extention', [32, 48, 128]],
        7: ['Chrome Application', [96, 128]]
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

        var ID_counter = 0;

        for (var k = 0; k < size_list.length; k++) {
            var canvas_base64 = resizeImg(size_list[k], size_name, ID_counter);
            zip.file(size_list[k] + '.png', canvas_base64,  {base64: true});
            ID_counter++;
        }

        saveAs(zip.generate({ type: 'blob' }), size_name + '.zip');
    }
    
    $('#resize_temp').html('');
});
