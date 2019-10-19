import {extend} from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('clarkwinkelmann/flarum-ext-author-change', () => {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('clarkwinkelmann-author-change', {
            icon: 'fas fa-user-edit',
            label: app.translator.trans('clarkwinkelmann-author-change.admin.permissions.edit'),
            permission: 'clarkwinkelmann-author-change.edit',
        });
    });
});
