const form = {};
let input = {};
let texts = {
    name:null,
    area:null,
    promise:null,
    userImage:{
        circle: true,
        circleCut: true
    }
};
let callback = {
    textChange: function(){},
    saveClick: function(){},
    userImageType: function(){},
    userImageSelected: function(){},
    showCircle: function(){},
    circleHeight: function(){}
};

form.init = function(config) {
    input.name = $('#form_name');
    input.area = $('#form_area');
    input.promise = $('#form_promise');
    input.save_poster = $('#btn_save_poster');
    input.save_fb_profile = $('#btn_save_fb_profile');
    input.save_fb_cover = $('#btn_save_fb_cover');
    input.userimage_default = $('#btn_image_default');
    input.userimage_upload = $('#btn_image_upload');
    input.userimage_browse = $('#form_image');
    input.userimage_circle = $('#image-circle');
    input.userimage_circle_cut = $('#image-circle-cut');
    input.userimage_circle_height = $('#form_image_circle_height');

    texts.name = config.name.val;
    texts.area = config.area.val;
    texts.promise = config.promise.val;

    input.name.val(config.name.val);
    input.name.on('input', function() {
        texts.name = $(this).val();
        callback.textChange(texts);
    });

    input.area.val(config.area.val);
    input.area.on('input', function() {
        texts.area = $(this).val();
        callback.textChange(texts);
    });

    input.promise.val(config.promise.val);
    input.promise.on('input', function() {
        texts.promise = $(this).val();
        callback.textChange(texts);
    });

    input.save_poster.click(function(e) {
        e.preventDefault();
        callback.saveClick('poster');
    });

    input.save_fb_profile.click(function(e) {
        e.preventDefault();
        callback.saveClick('fb_profile');
    });

    input.save_fb_cover.click(function(e) {
        e.preventDefault();
        callback.saveClick('fb_cover');
    });

    input.userimage_default.click(function() {
        $('.image-radio').removeClass('checked');
        $(this).addClass('checked');
        $('#image-select-userimage').hide();
        callback.userImageType('default');
    });

    input.userimage_upload.click(function() {
        $('.image-radio').removeClass('checked');
        $(this).addClass('checked');
        $('#image-select-userimage').show();
        callback.userImageType('upload');
    });

    input.userimage_browse.on('change', function(e) {
        let file = e.target.files[0];
        if (!file) {
            return;
        }

        callback.userImageSelected(file);
    });

    input.userimage_circle.click(function() {
        texts.userImage.circle = !texts.userImage.circle;
        if(texts.userImage.circle)
            $('#image-circle-icon').show();
        else
            $('#image-circle-icon').hide();
        callback.showCircle(texts.userImage.circle);
    });

    input.userimage_circle_cut.click(function() {
        texts.userImage.circleCut = !$('#image-circle-cut-icon').is(":visible"); //!texts.userImage.circleCut;
        if(texts.userImage.circleCut)
            $('#image-circle-cut-icon').show();
        else
            $('#image-circle-cut-icon').hide();
        callback.cutCircle(texts.userImage.circleCut);
    });

    input.userimage_circle_height.on('input change', function() {
        callback.circleHeight($(this).val());
    });
}

form.setCallbacks = function(cb) {
    callback = cb;
}

form.getTexts = function() {
    return texts;
}

export default form;
