import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import UpdateAuthorModal from './components/UpdateAuthorModal';

app.initializers.add('clarkwinkelmann-author-change', () => {
    extend(DiscussionControls, 'moderationControls', (items, discussion) => {
        if (!app.forum.attribute('clarkwinkelmannAuthorChangeCanEditUser') && !app.forum.attribute('clarkwinkelmannAuthorChangeCanEditDate')) {
            return;
        }

        items.add('clarkwinkelmann-author-change', Button.component({
            icon: 'fas fa-user-edit',
            onclick() {
                app.modal.show(UpdateAuthorModal, {
                    related: discussion,
                });
            },
        }, app.translator.trans('clarkwinkelmann-author-change.forum.controls.edit')));
    });

    extend(PostControls, 'moderationControls', (items, post) => {
        if (!app.forum.attribute('clarkwinkelmannAuthorChangeCanEditUser') && !app.forum.attribute('clarkwinkelmannAuthorChangeCanEditDate')) {
            return;
        }

        items.add('clarkwinkelmann-author-change', Button.component({
            icon: 'fas fa-user-edit',
            onclick() {
                app.modal.show(UpdateAuthorModal, {
                    related: post,
                });
            },
        }, app.translator.trans('clarkwinkelmann-author-change.forum.controls.edit')));
    });
});
