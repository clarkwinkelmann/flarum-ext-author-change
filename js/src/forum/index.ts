import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import UpdateAuthorModal from './components/UpdateAuthorModal';

app.initializers.add('clarkwinkelmann-author-change', () => {
    extend(DiscussionControls, 'moderationControls', function (items: ItemList, discussion: Discussion) {
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

    extend(PostControls, 'moderationControls', function (items: ItemList, post: Post) {
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
