import config from './config.json';

class FormController {
    constructor() {
        this.texts = {
            title: null,
            subtitle: null,
            date: null,
            address: null,
        };
        this.options = {
            isCustomBg: false,
            textColor: 'black',
            overlayEnabled: true,
        };
        this.callback = {
            textChange: function(){},
            optionsChange: function(){},
            bgSelected: function(){},
            customBgSelected: function(){},
            saveClick: function(){},
        };
        this.input = {
            title: $('#form_title'),
            subtitle: $('#form_subtitle'),
            date: $('#form_date'),
            address: $('#form_address'),
            bg_type_switch: $('#bg_switch'),
            bg_type_default: $('#btn_bg_default'),
            bg_type_custom: $('#btn_bg_custom'),
            choose_bg: $('.bg_item'),
            bg_browse: $('#form_custom_bg'),
            text_color_radio: $('.text-color-radio'),
            text_color_black: $('#text-black-radio'),
            text_color_white: $('#text-white-radio'),
            text_white_bg_checkbox: $('#text-white-bg-checkbox'),
            save_event_cover: $('#btn_save_event_cover'),
        };
        this.sections = {
            bg_type_default: $('#background-defaults'),
            bg_type_custom: $('#background-custom'),
        };

        config.textDefaults.forEach(text => {
            this.texts[text.id] = text.defaultValue;
            this.input[text.id].val(this.texts[text.id]);
            this.input[text.id].on('input', e => {
                this.texts[text.id] = e.target.value;
                this.callback.textChange(this.texts);
            });
        });

        this.selectBg(0);

        this.input.choose_bg.click(e => {
            this.selectBg(e.currentTarget.dataset.index);
        });

        this.input.save_event_cover.click(e => {
            e.preventDefault();
            this.callback.saveClick('event_cover');
        });

        this.input.bg_type_default.click(() => this.setBgTypeDefault());

        this.input.bg_type_custom.click(() => this.setBgTypeCustom());

        this.input.bg_browse.on('change', e => {
            let file = e.target.files[0];
            if (!file) {
                return;
            }

            this.customBgSelected();
            this.callback.customBgSelected(file);
        });

        this.input.text_color_black.click(() => {
            this.options.textColor = 'black';
            this.input.text_color_radio.children('i').removeClass('fa-circle-o fa-dot-circle-o');
            this.input.text_color_black.children('i').addClass('fa-dot-circle-o');
            this.input.text_color_white.children('i').addClass('fa-circle-o');
            this.callback.optionsChange(this.options);
        });

        this.input.text_color_white.click(() => {
            this.options.textColor = 'white';
            this.input.text_color_radio.children('i').removeClass('fa-circle-o fa-dot-circle-o');
            this.input.text_color_black.children('i').addClass('fa-circle-o');
            this.input.text_color_white.children('i').addClass('fa-dot-circle-o');
            this.callback.optionsChange(this.options);
        });

        this.input.text_white_bg_checkbox.click(() => {
            this.options.overlayEnabled = !this.options.overlayEnabled;
            this.input.text_white_bg_checkbox.children('i').removeClass('fa-square-o fa-check-square');
            this.input.text_white_bg_checkbox.children('i').addClass(this.options.overlayEnabled ? 'fa-check-square' : 'fa-square-o');
            this.callback.optionsChange(this.options);
        });
    }

    setCallbacks(cb) {
        this.callback = cb;
    }

    selectBg(index) {
        $('.selected_bg_overlay').remove();

        if (index === undefined || index === null) return;

        $(`.bg_item[data-index=${index}]`).append('<div class="selected_bg_overlay"><i class="fa fa-check"></i></div>');

        this.options.isCustomBg = false;
        this.callback.optionsChange(this.options);
        this.callback.bgSelected(index);
    }

    setBgTypeDefault() {
        this.input.bg_type_switch.children('span').removeClass('checked');
        this.input.bg_type_default.addClass('checked');
        this.sections.bg_type_custom.hide();
        this.sections.bg_type_default.show();
    }

    setBgTypeCustom() {
        this.input.bg_type_switch.children('span').removeClass('checked');
        this.input.bg_type_custom.addClass('checked');
        this.sections.bg_type_default.hide();
        this.sections.bg_type_custom.show();
    }

    customBgSelected() {
        this.selectBg();
        this.setBgTypeCustom();
        this.options.isCustomBg = true;
        this.callback.optionsChange(this.options);
    }
}

export default FormController;
