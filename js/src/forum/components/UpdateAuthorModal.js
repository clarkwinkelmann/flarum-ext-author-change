import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Post from 'flarum/models/Post';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import UserSearch from './UserSearch';

/* global m */

export default class UpdateAuthorModal extends Modal {
    constructor(related) {
        super();

        this.related = related;
        this.user = related.user();
        this.createdAt = related.createdAt().toISOString().slice(0, 16);
        this.editedAt = (this.isPost() && related.editedAt()) ? related.editedAt().toISOString().slice(0, 16) : '';
        this.attributes = {}; // What we will send to the server. We only send what changed
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
            app.forum.attribute('clarkwinkelmannAuthorChangeCanEditUser') ? m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-author-change.forum.modal.user')),
                m('.FormControl.SelectedUser', [
                    this.user ? Button.component({
                        icon: 'fas fa-times',
                        onclick: () => {
                            this.user = null;
                            this.attributes.relationships = {
                                user: [],
                            };
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
                        this.attributes.relationships = {
                            user,
                        };
                        this.dirty = true;

                        m.redraw();
                    },
                }),
            ]) : null,
            app.forum.attribute('clarkwinkelmannAuthorChangeCanEditDate') ? [
                m('.Form-group', [
                    m('label', app.translator.trans('clarkwinkelmann-author-change.forum.modal.created_at')),
                    m('input[type=datetime-local][required].FormControl', {
                        value: this.createdAt,
                        onchange: m.withAttr('value', value => {
                            this.createdAt = value;
                            this.attributes.createdAt = value;
                            this.dirty = true;
                        }),
                    }),
                ]),
                this.isPost() ? m('.Form-group', [
                    m('label', app.translator.trans('clarkwinkelmann-author-change.forum.modal.edited_at')),
                    m('input[type=datetime-local].FormControl', {
                        value: this.editedAt,
                        onchange: m.withAttr('value', value => {
                            this.editedAt = value;
                            this.attributes.editedAt = value;
                            this.dirty = true;
                        }),
                    }),
                ]) : null,
            ] : null,
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

        this.related.save(this.attributes).then(() => {
            this.loading = false;
            this.dirty = false;

            m.redraw();

            app.modal.close();
        }).catch(err => {
            this.loading = false;
            m.redraw();
            throw err;
        });
    }
}
