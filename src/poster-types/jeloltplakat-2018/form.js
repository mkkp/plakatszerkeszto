import config from './config.json';

class FormController {
    constructor() {
        this.input = {};
        this.texts = {
            name:null,
            area:null,
            promise:null,
            userImage:{
                circle: true,
                circleCut: true
            }
        };
        this.callback = {
            textChange: function(){},
            saveClick: function(){},
            userImageType: function(){},
            userImageSelected: function(){},
            showCircle: function(){},
            circleHeight: function(){}
        };

        this.input.name = $('#form_name');
        this.input.area = $('#form_area');
        this.input.promise = $('#form_promise');
        this.input.save_poster = $('#btn_save_poster');
        this.input.save_fb_profile = $('#btn_save_fb_profile');
        this.input.save_fb_cover = $('#btn_save_fb_cover');
        this.input.userimage_default = $('#btn_image_default');
        this.input.userimage_upload = $('#btn_image_upload');
        this.input.userimage_browse = $('#form_image');
        this.input.userimage_circle = $('#image-circle');
        this.input.userimage_circle_cut = $('#image-circle-cut');
        this.input.userimage_circle_height = $('#form_image_circle_height');

        config.textDefaults.forEach(text => {
            this.texts[text.id] = text.defaultValue;
            this.input[text.id].val(this.texts[text.id]);
            this.input[text.id].on('input', e => {
                this.texts[text.id] = e.target.value;
                this.callback.textChange(this.texts);
            });
        });

        this.input.save_poster.click(e => {
            e.preventDefault();
            this.callback.saveClick('poster');
        });

        this.input.save_fb_profile.click(e => {
            e.preventDefault();
            this.callback.saveClick('fb_profile');
        });

        this.input.save_fb_cover.click(e => {
            e.preventDefault();
            this.callback.saveClick('fb_cover');
        });

        this.input.userimage_default.click(() => {
            $('.image-radio').removeClass('checked');
            this.input.userimage_default.addClass('checked');
            $('#image-select-userimage').hide();
            this.callback.userImageType('default');
        });

        this.input.userimage_upload.click(() => {
            $('.image-radio').removeClass('checked');
            this.input.userimage_upload.addClass('checked');
            $('#image-select-userimage').show();
            this.callback.userImageType('upload');
        });

        this.input.userimage_browse.on('change', e => {
            let file = e.target.files[0];
            if (!file) {
                return;
            }

            this.callback.userImageSelected(file);
        });

        this.input.userimage_circle.click(() => {
            this.texts.userImage.circle = !this.texts.userImage.circle;
            if(this.texts.userImage.circle)
                $('#image-circle-icon').show();
            else
                $('#image-circle-icon').hide();
            this.callback.showCircle(this.texts.userImage.circle);
        });

        this.input.userimage_circle_cut.click(() => {
            this.texts.userImage.circleCut = !$('#image-circle-cut-icon').is(":visible"); //!texts.userImage.circleCut;
            if(this.texts.userImage.circleCut)
                $('#image-circle-cut-icon').show();
            else
                $('#image-circle-cut-icon').hide();
            this.callback.cutCircle(this.texts.userImage.circleCut);
        });

        this.input.userimage_circle_height.on('input change', () => {
            this.callback.circleHeight(this.input.userimage_circle_height.val());
        });
    }

    setCallbacks(cb) {
        this.callback = cb;
    }
}

export default FormController;
