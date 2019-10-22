import UsersSearchSource from 'flarum/components/UsersSearchSource';
import Button from 'flarum/components/Button';

export default class UsersSearchSourceWithoutInternalRouting extends UsersSearchSource {
    view(query) {
        const view = super.view(query);

        if (!view) {
            if (query.length < 3) {
                return m('li', Button.component({
                    icon: 'fas fa-info-circle',
                    children: app.translator.trans('clarkwinkelmann-author-change.forum.search.type-more'),
                }));
            }

            return m('li', Button.component({
                icon: 'fas fa-search-minus',
                children: app.translator.trans('clarkwinkelmann-author-change.forum.search.no-results'),
            }));
        }

        let resultItems = null;

        // We want to keep only the result <li>s, and not any header or stuff injected by another extension
        // In core:
        // view[0] is the header
        // view[1] are the results
        // When fof/user-directory is installed, view[1] is the link to the user directory page
        view.some(entry => {
            if (Array.isArray(entry) && entry.length > 0 && entry[0].attrs && entry[0].attrs.className.indexOf('UserSearchResult') !== -1) {
                resultItems = entry;

                return true;
            }

            return false;
        });

        if (resultItems === null) {
            // Not translating this as it shouldn't be visible
            return m('li', '[extension conflict]');
        }

        resultItems.forEach(result => {
            if (Array.isArray(result.children) && result.children.length > 0) {
                delete result.children[0].attrs.config;
            }
        });

        if (query.length < 3) {
            resultItems.push(m('li', Button.component({
                icon: 'fas fa-info-circle',
                children: app.translator.trans('clarkwinkelmann-author-change.forum.search.type-more'),
            })));
        }

        return resultItems;
    }
}
