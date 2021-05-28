import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import UsersSearchSource from 'flarum/forum/components/UsersSearchSource';
import Button from 'flarum/common/components/Button';

export default class UsersSearchSourceWithoutInternalRouting extends UsersSearchSource {
    view(query: string): Array<Mithril.Vnode> {
        const view = super.view(query);

        // We want to keep only the result <li>s, and not any header or stuff injected by another extension
        // In core:
        // view[0] is the header
        // view[1+] are the results
        // When fof/user-directory is installed, view[1] is the link to the user directory page
        const resultItems = view.filter(entry => {
            return entry.attrs && entry.attrs.className && entry.attrs.className.indexOf('UserSearchResult') !== -1;
        });

        if (resultItems.length === 0) {
            if (query.length < 3) {
                return [
                    m('li', Button.component({
                        icon: 'fas fa-info-circle',
                    }, app.translator.trans('clarkwinkelmann-author-change.forum.search.type-more'))),
                ];
            }

            return [
                m('li', Button.component({
                    icon: 'fas fa-search-minus',
                }, app.translator.trans('clarkwinkelmann-author-change.forum.search.no-results'))),
            ];
        }

        resultItems.forEach((result: any) => {
            if (Array.isArray(result.children) && result.children.length > 0) {
                // We use a normal link instead of Mithril's Link so that we can cancel navigation
                // with preventDefault() in UserSearch component
                result.children[0].tag = 'a';
            }
        });

        if (query.length < 3) {
            resultItems.push(m('li', Button.component({
                icon: 'fas fa-info-circle',
            }, app.translator.trans('clarkwinkelmann-author-change.forum.search.type-more'))));
        }

        return resultItems;
    }
}
