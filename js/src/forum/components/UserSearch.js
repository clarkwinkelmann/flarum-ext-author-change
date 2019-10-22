import Search from 'flarum/components/Search';
import ItemList from 'flarum/utils/ItemList';
import extractText from 'flarum/utils/extractText';
import UsersSearchSourceWithoutInternalRouting from './UsersSearchSourceWithoutInternalRouting';

export default class UserSearch extends Search {
    selectUserIndex(index) {
        const userId = index.split('users')[1];

        const user = app.store.getById('users', userId);

        this.props.onsubmit(user);
    }

    config(isInitialized) {
        super.config(isInitialized);

        if (isInitialized) return;

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

        if (this.value()) {
            this.selectUserIndex(this.index);
        } else {
            this.clear();
        }

        this.$('input').blur();
    }

    clear() {
        this.value('');

        m.redraw();
    }

    sourceItems() {
        const items = new ItemList();

        if (app.forum.attribute('canViewUserList')) items.add('users', new UsersSearchSourceWithoutInternalRouting());

        return items;
    }

    view() {
        const view = super.view();

        // view = .Search, [] = .Search-input, [][] = input.FormControl
        view.children[0].children[0].attrs.placeholder = extractText(app.translator.trans('clarkwinkelmann-author-change.forum.search.placeholder'));

        return view;
    }
}
