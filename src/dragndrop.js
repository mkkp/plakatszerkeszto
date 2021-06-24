const dnd = {};
let callback = function(){};

dnd.init = function(cb) {
    if(typeof cb === 'function')
        callback = cb;

    let dropZoneTimer, dropZoneVisible;

    $(document).on('dragstart dragenter dragover', function(e) {
        // Only file drag and drops allowed
        if($.inArray('Files', e.originalEvent.dataTransfer.types) > -1) {
            e.stopPropagation();
            e.preventDefault();

            $('.dropzone').show();
            dropZoneVisible = true;

            e.originalEvent.dataTransfer.effectAllowed = 'none';
            e.originalEvent.dataTransfer.dropEffect = 'none';

            if($(e.target).hasClass('dropzone')) {
                e.originalEvent.dataTransfer.effectAllowed = 'copyMove';
                e.originalEvent.dataTransfer.dropEffect = 'move';
            }
        }
    }).on('drop dragleave dragend', function(e) {
        e.stopPropagation();
        e.preventDefault();

        dropZoneVisible = false;

        clearTimeout(dropZoneTimer);
        dropZoneTimer = setTimeout(function() {
            if(!dropZoneVisible)
                $('.dropzone').hide();
        }, 70); // Drop zone hide delay 70 ms
    }).on('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();

        callback(e.originalEvent.dataTransfer.files[0]);
    });
}

export default dnd;
