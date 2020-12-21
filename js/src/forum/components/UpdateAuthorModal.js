import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Post from 'flarum/models/Post';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import SearchState from 'flarum/states/SearchState';
import UserSearch from './UserSearch';

/* global m */

export default class UpdateAuthorModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.user = this.attrs.related.user();
        this.createdAt = this.attrs.related.createdAt().toISOString().slice(0, 16);
        this.editedAt = (this.isPost() && this.attrs.related.editedAt()) ? this.attrs.related.editedAt().toISOString().slice(0, 16) : '';
        this.attributes = {}; // What we will send to the server. We only send what changed
        this.dirty = false;
        this.loading = false;
        this.userSearchState = new SearchState();

        // Workaround for https://github.com/flarum/core/issues/2399
        this.userSearchState.getInitialSearch = () => '';
    }

    isPost() {
        return this.attrs.related instanceof Post;
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
                    state: this.userSearchState,
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
                        onchange: event => {
                            this.createdAt = event.target.value;
                            this.attributes.createdAt = event.target.value;
                            this.dirty = true;
                        },
                    }),
                ]),
                this.isPost() ? m('.Form-group', [
                    m('label', app.translator.trans('clarkwinkelmann-author-change.forum.modal.edited_at')),
                    m('input[type=datetime-local].FormControl', {
                        value: this.editedAt,
                        onchange: event => {
                            this.editedAt = event.target.value;
                            this.attributes.editedAt = event.target.value;
                            this.dirty = true;
                        },
                    }),
                ]) : null,
            ] : null,
            m('.Form-group', [
                Button.component({
                    disabled: !this.dirty,
                    loading: this.loading,
                    type: 'submit',
                    className: 'Button Button--primary',
                }, app.translator.trans('clarkwinkelmann-author-change.forum.modal.submit')),
                Button.component({
                    className: 'Button CancelButton',
                    onclick() {
                        app.modal.close();
                    },
                }, app.translator.trans('clarkwinkelmann-author-change.forum.modal.cancel')),
            ]),
        ]);
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.attrs.related.save(this.attributes).then(() => {
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
