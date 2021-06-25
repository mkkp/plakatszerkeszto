import config from './config.json';

class FormController {
    constructor() {
        this.input = {};
        this.texts = {
            title: null,
            subtitle: null,
            date: null,
            address: null
        };
        this.callback = {
            textChange: function(){},
            saveClick: function(){},
            userImageType: function(){},
            userImageSelected: function(){},
        };

        this.input.title = $('#form_title');
        this.input.subtitle = $('#form_subtitle');
        this.input.date = $('#form_date');
        this.input.address = $('#form_address');
        this.input.save_event_cover = $('#btn_save_event_cover');
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

        this.input.save_event_cover.click(e => {
            e.preventDefault();
            this.callback.saveClick('event_cover');
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
    }

    setCallbacks(cb) {
        this.callback = cb;
    }
}

export default FormController;
