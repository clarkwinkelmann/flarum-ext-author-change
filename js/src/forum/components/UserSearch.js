import app from 'flarum/app';
import Search from 'flarum/components/Search';
import ItemList from 'flarum/utils/ItemList';
import extractText from 'flarum/utils/extractText';
import UsersSearchSourceWithoutInternalRouting from './UsersSearchSourceWithoutInternalRouting';

/* global $ */

export default class UserSearch extends Search {
    selectUserIndex(index) {
        const userId = index.split('users')[1];

        const user = app.store.getById('users', userId);

        this.attrs.onsubmit(user);
    }

    oncreate(vnode) {
        super.oncreate(vnode);

        this.$('.Search-results').on('click', event => {
            const $userSearchResult = $(event.target).parents('.UserSearchResult');

            if ($userSearchResult.length) {
                event.preventDefault();

                this.selectUserIndex($userSearchResult.data('index'));
            }
        });
    }

    getCurrentSearch() {
        return '';
    }

    selectResult() {
        clearTimeout(this.searchTimeout);
        this.loadingSources = 0;

        if (this.state.getValue()) {
            this.selectUserIndex(this.index);
        } else {
            this.clear();
        }

        this.$('input').blur();
    }

    clear() {
        super.clear();

        m.redraw();
    }

    sourceItems() {
        const items = new ItemList();

        if (app.forum.attribute('canViewUserList')) items.add('users', new UsersSearchSourceWithoutInternalRouting());

        return items;
    }

    view(vnode) {
        const view = super.view(vnode);

        // view = .Search, [] = .Search-input, [][] = input.FormControl
        view.children[0].children[0].attrs.placeholder = extractText(app.translator.trans('clarkwinkelmann-author-change.forum.search.placeholder'));

        return view;
    }
}
