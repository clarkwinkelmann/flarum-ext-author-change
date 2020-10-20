import app from 'flarum/app';
import {extend} from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('clarkwinkelmann/flarum-ext-author-change', () => {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('clarkwinkelmann-author-change', {
            icon: 'fas fa-user-edit',
            label: app.translator.trans('clarkwinkelmann-author-change.admin.permissions.edit-user'),
            permission: 'clarkwinkelmann-author-change.edit-user',
        });

        items.add('clarkwinkelmann-post-date', {
            icon: 'far fa-clock',
            label: app.translator.trans('clarkwinkelmann-author-change.admin.permissions.edit-date'),
            permission: 'clarkwinkelmann-author-change.edit-date',
        });
    });
});
