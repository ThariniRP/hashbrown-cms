'use strict';

/**
 * A Template editor
 */
class TemplateEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'template-editor editor flex-vertical'});

        this.fetch();
    }


    /**
     * Event: Click save. Posts the model to the apiPath
     */
    onClickSave() {
        let view = this;

        this.$saveBtn.toggleClass('working', true);

        apiCall('post', 'templates/' + this.model.type + '/' + this.model.id, this.model)
        .then(() => {
            return reloadResource('templates');
        })
        .then(() => {
            NavbarMain.reload();

            this.$saveBtn.toggleClass('working', false);
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Change text. Make sure the value is up to date
     */
    onChangeText() {
        this.model.markup = this.editor.getDoc().getValue();

        this.trigger('change', this.model);
    }

    render() {
        _.append(this.$element.empty(),
            _.div({class: 'editor-header'},
                _.span({class: 'fa fa-code'}),
                _.h4(this.model.name)
            ),
            _.div({class: 'editor-body'},
                this.$textarea = _.textarea(),
                this.$error
            ),
            _.div({class: 'editor-footer'}, 
                _.div({class: 'btn-group'},
                    _.if(!this.model.locked,
                        // Save
                        this.$saveBtn = _.button({class: 'btn btn-raised btn-primary'},
                            _.span({class: 'text-default'}, 'Save'),
                            _.span({class: 'text-working'}, 'Saving')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );

        setTimeout(() => {
            this.editor = CodeMirror.fromTextArea(this.$textarea[0], {
                lineNumbers: true,
                mode: {
                    name: 'xml',
                },
                viewportMargin: this.embedded ? Infinity : 10,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true,
                theme: getCookie('cmtheme') || 'default',
                value: this.model.markup
            });

            this.editor.getDoc().setValue(this.model.markup);

            this.editor.on('change', () => { this.onChangeText(); });

            this.onChangeText();
        }, 1);
    }
}

module.exports = TemplateEditor;