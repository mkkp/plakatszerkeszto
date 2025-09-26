import config from './config.json';
import fonts from '../../fonts.json';

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
        this.fonts = {};
        this.callback = {
            textChange: function(){},
            fontChange: function(){},
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
        this.input.font_name = $('#font_name');
        this.input.font_area = $('#font_area');
        this.input.font_promise = $('#font_promise');
        this.input.accordion_headers = $('.accordion-header');

        config.textDefaults.forEach(text => {
            this.texts[text.id] = text.defaultValue;
            this.fonts[text.id] = text.font;
            this.input[text.id].val(this.texts[text.id]);
            this.input[text.id].on('input', e => {
                this.texts[text.id] = e.target.value;
                this.callback.textChange(this.texts);
            });
            
            // Initialize font selectors
            this.initializeFontSelector(text.id, text.font);
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

        // Font selection change handlers
        Object.keys(this.input).filter(key => key.startsWith('font_')).forEach(fontKey => {
            const textId = fontKey.replace('font_', '');
            this.input[fontKey].change(e => {
                this.fonts[textId] = e.target.value;
                this.callback.fontChange(this.fonts);
            });
        });

        // Accordion functionality
        this.initializeAccordion();
    }

    setCallbacks(cb) {
        this.callback = cb;
    }

    initializeFontSelector(textId, defaultFont) {
        const fontSelect = this.input['font_' + textId];
        
        // Clear existing options
        fontSelect.empty();
        
        // Add font options
        fonts.forEach(font => {
            const option = $('<option>').val(font.id).text(font.name);
            if (font.id === defaultFont) {
                option.attr('selected', 'selected');
            }
            fontSelect.append(option);
        });
    }

    initializeAccordion() {
        this.input.accordion_headers.click(e => {
            const header = $(e.currentTarget);
            const item = header.closest('.accordion-item');
            const content = item.find('.accordion-content');
            
            // Close all other accordion items
            $('.accordion-item').not(item).removeClass('active');
            
            // Toggle current item
            item.toggleClass('active');
            
            // If opening, ensure the content is visible
            if (item.hasClass('active')) {
                content.css('max-height', content.prop('scrollHeight') + 'px');
            } else {
                content.css('max-height', '0');
            }
        });
        
        // Open first accordion by default
        $('.accordion-item').first().addClass('active');
    }
}

export default FormController;
