import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Post from 'flarum/models/Post';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import UserSearch from './UserSearch';

export default class UpdateAuthorModal extends Modal {
    constructor(related) {
        super();

        this.related = related;
        this.user = related.user();
        this.dirty = false;
        this.loading = false;
    }

    isPost() {
        return this.related instanceof Post;
    }

    className() {
        return 'Update-Author-Modal';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-author-change.forum.modal.title-' + (this.isPost() ? 'post' : 'discussion'));
    }

    content() {
        return m('.Modal-body', [
            m('.Form-group', [
                m('.FormControl.SelectedUser', [
                    this.user ? Button.component({
                        icon: 'fas fa-times',
                        onclick: () => {
                            this.user = null;
                            this.dirty = true;
                        },
                        className: 'Button Button--icon Button--link RemoveUserButton',
                    }) : null,
                    avatar(this.user),
                    username(this.user),
                ]),
                UserSearch.component({
                    onsubmit: user => {
                        this.user = user;
                        this.dirty = true;

                        m.redraw();
                    },
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    disabled: !this.dirty,
                    loading: this.loading,
                    type: 'submit',
                    className: 'Button Button--primary',
                    children: app.translator.trans('clarkwinkelmann-author-change.forum.modal.submit'),
                }),
                Button.component({
                    className: 'Button CancelButton',
                    children: app.translator.trans('clarkwinkelmann-author-change.forum.modal.cancel'),
                    onclick() {
                        app.modal.close();
                    },
                }),
            ]),
        ]);
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.related.save({
            relationships: {
                user: this.user !== null ? this.user : [],
            },
        }).then(() => {
            this.loading = false;
            this.dirty = false;
            m.redraw();
        }).catch(err => {
            this.loading = false;
            m.redraw();
            throw err;
        });
    }
}
