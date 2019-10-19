import {extend} from 'flarum/extend';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import UpdateAuthorModal from './components/UpdateAuthorModal';

app.initializers.add('clarkwinkelmann/flarum-ext-author-change', () => {
    extend(DiscussionControls, 'moderationControls', (items, discussion) => {
        if (!app.forum.attribute('clarkwinkelmannAuthorChangeCanEdit')) {
            return;
        }

        items.add('clarkwinkelmann-author-change', Button.component({
            icon: 'fas fa-user-edit',
            children: app.translator.trans('clarkwinkelmann-author-change.forum.controls.edit'),
            onclick() {
                app.modal.show(new UpdateAuthorModal(discussion));
            },
        }));
    });

    extend(PostControls, 'moderationControls', (items, post) => {
        if (!app.forum.attribute('clarkwinkelmannAuthorChangeCanEdit')) {
            return;
        }

        items.add('clarkwinkelmann-author-change', Button.component({
            icon: 'fas fa-user-edit',
            children: app.translator.trans('clarkwinkelmann-author-change.forum.controls.edit'),
            onclick() {
                app.modal.show(new UpdateAuthorModal(post));
            },
        }));
    });
});
