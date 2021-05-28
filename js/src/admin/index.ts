import app from 'flarum/admin/app';

app.initializers.add('clarkwinkelmann-author-change', () => {
    app.extensionData
        .for('clarkwinkelmann-author-change')
        .registerPermission({
            icon: 'fas fa-user-edit',
            label: app.translator.trans('clarkwinkelmann-author-change.admin.permissions.edit-user'),
            permission: 'clarkwinkelmann-author-change.edit-user',
        }, 'moderate')
        .registerPermission({
            icon: 'far fa-clock',
            label: app.translator.trans('clarkwinkelmann-author-change.admin.permissions.edit-date'),
            permission: 'clarkwinkelmann-author-change.edit-date',
        }, 'moderate');
});
