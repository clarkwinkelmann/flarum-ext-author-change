import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import {ComponentAttrs} from 'flarum/common/Component';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import SearchState from 'flarum/forum/states/SearchState';
import Switch from 'flarum/common/components/Switch';
import UserSearch from './UserSearch';

interface UpdateAuthorModalAttrs extends ComponentAttrs {
    related: Discussion | Post
}

// @ts-ignore TODO wrong Modal.view typings
export default class UpdateAuthorModal extends Modal {
    attrs!: UpdateAuthorModalAttrs
    user!: User | null | false
    createdAt!: string
    editedAt!: string
    syncFirstPost: boolean = false
    otherModelForFirstPostSync: Discussion | Post | false = false
    attributes: any = {}; // What we will send to the server. We only send what changed
    dirty: boolean = false
    loading: boolean = false
    userSearchState!: SearchState

    oninit(vnode: Mithril.Vnode<UpdateAuthorModalAttrs, this>) {
        super.oninit(vnode);

        const {related} = this.attrs;

        const editedAt = related instanceof Post && related.editedAt();

        this.user = related.user();
        this.createdAt = related.createdAt().toISOString().slice(0, 16);
        this.editedAt = editedAt ? editedAt.toISOString().slice(0, 16) : '';
        this.userSearchState = new SearchState();

        // Workaround for https://github.com/flarum/core/issues/2399
        this.userSearchState.getInitialSearch = () => '';

        if (this.showFirstPostSync()) {
            if (related instanceof Discussion) {
                this.otherModelForFirstPostSync = related.firstPost();

                // The firstPost relationship will not be loaded if the discussion is accessed directly
                // we will try to find the first post in the store
                if (this.otherModelForFirstPostSync === false) {
                    this.otherModelForFirstPostSync = app.store.all('posts').find(post => {
                        return post.number() === 1 && post.discussion() === related;
                    }) || false;
                }
            } else {
                this.otherModelForFirstPostSync = related.discussion();
            }

            if (
                this.otherModelForFirstPostSync &&
                this.otherModelForFirstPostSync.user() === this.user &&
                this.otherModelForFirstPostSync.createdAt().toISOString().slice(0, 16) === this.createdAt
            ) {
                this.syncFirstPost = true;
            }
        }
    }

    showFirstPostSync(): boolean {
        return (this.attrs.related instanceof Discussion) || this.attrs.related.number() === 1;
    }

    isPost(): boolean {
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
                                user: [], // https://github.com/flarum/core/issues/2876
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
                        disabled: this.loading,
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
                        disabled: this.loading,
                    }),
                ]) : null,
            ] : null,
            this.showFirstPostSync() ? m('.Form-group', [
                Switch.component({
                    state: this.syncFirstPost,
                    onchange: (value: boolean) => {
                        this.syncFirstPost = value;
                        this.dirty = true;

                        // We only put the values inside attributes when they change
                        // but when switching the sync checkbox to true we want to force a sync of both attributes that
                        // are on discussion+post
                        if (value) {
                            this.attributes.relationships = {
                                user: this.user || [],
                            };

                            this.attributes.createdAt = this.createdAt;
                        }
                    },
                    // Disable checkbox if other model isn't available since we won't have the ID to save it
                    disabled: this.loading || !this.otherModelForFirstPostSync,
                }, app.translator.trans('clarkwinkelmann-author-change.forum.modal.sync-with-' + (this.isPost() ? 'discussion' : 'post'))),
                this.otherModelForFirstPostSync ? null : m('.helpText', app.translator.trans('clarkwinkelmann-author-change.forum.modal.sync-impossible'))
            ]) : null,
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

    saveModel(model: Discussion | Post) {
        return model.save({
            // Clone this.attributes so Model.save doesn't delete the relationships key
            ...this.attributes,
        });
    }

    // @ts-ignore TODO wrong Modal.onsubmit typings
    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.saveModel(this.attrs.related).then(() => {
            if (this.syncFirstPost && this.otherModelForFirstPostSync) {
                return this.saveModel(this.otherModelForFirstPostSync);
            }

            return Promise.resolve();
        }).then(() => {
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
