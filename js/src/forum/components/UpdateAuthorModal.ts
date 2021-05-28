import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import SearchState from 'flarum/forum/states/SearchState';
import UserSearch from './UserSearch';
import {ComponentAttrs} from "flarum/common/Component";
import User from "flarum/common/models/User";

/* global m */

interface UpdateAuthorModalAttrs extends ComponentAttrs {
    related: Discussion | Post
}

// @ts-ignore TODO wrong Modal.view typings
export default class UpdateAuthorModal extends Modal {
    attrs!: UpdateAuthorModalAttrs
    user!: User | null | false
    createdAt!: string
    editedAt!: string
    attributes: any = {}; // What we will send to the server. We only send what changed
    dirty: boolean = false
    loading: boolean = false
    userSearchState!: SearchState

    oninit(vnode: Mithril.Vnode<UpdateAuthorModalAttrs, this>) {
        super.oninit(vnode);

        const editedAt = this.attrs.related instanceof Post && this.attrs.related.editedAt();

        this.user = this.attrs.related.user();
        this.createdAt = this.attrs.related.createdAt().toISOString().slice(0, 16);
        this.editedAt = editedAt ? editedAt.toISOString().slice(0, 16) : '';
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
                    // @ts-ignore TODO wrong avatar typings
                    avatar(this.user),
                    // @ts-ignore TODO wrong username typings
                    username(this.user),
                ]),
                UserSearch.component({
                    state: this.userSearchState,
                    onsubmit: (user: User) => {
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
                        onchange: (event: Event) => {
                            // @ts-ignore we know target has a value
                            const {value} = event.target;

                            this.createdAt = value;
                            this.attributes.createdAt = value;
                            this.dirty = true;
                        },
                    }),
                ]),
                this.isPost() ? m('.Form-group', [
                    m('label', app.translator.trans('clarkwinkelmann-author-change.forum.modal.edited_at')),
                    m('input[type=datetime-local].FormControl', {
                        value: this.editedAt,
                        onchange: (event: Event) => {
                            // @ts-ignore we know target has a value
                            const {value} = event.target;

                            this.editedAt = value;
                            this.attributes.editedAt = value;
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

    // @ts-ignore TODO wrong Modal.onsubmit typings
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
