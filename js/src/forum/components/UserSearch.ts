import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import Search, {SearchAttrs} from 'flarum/forum/components/Search';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import UsersSearchSourceWithoutInternalRouting from './UsersSearchSourceWithoutInternalRouting';
import User from "flarum/common/models/User";

interface UserSearchAttrs extends SearchAttrs {
    onsubmit: (user: User) => void
}

export default class UserSearch extends Search<UserSearchAttrs> {
    selectUserElement(searchResultElement: HTMLElement) {
        const index = searchResultElement.dataset.index;

        if (!index) {
            return;
        }

        // The "index" data attribute is the string "user" concatenated with the user ID
        const userId = index.split('users')[1];

        const user = app.store.getById('users', userId);

        this.attrs.onsubmit(user);
    }

    oncreate(vnode: Mithril.Vnode<UserSearchAttrs, this>) {
        super.oncreate(vnode);

        this.$('.Search-results').on('click', event => {
            const $userSearchResult = $(event.target).parents('.UserSearchResult');

            if ($userSearchResult.length) {
                event.preventDefault();

                this.selectUserElement($userSearchResult.get(0));
            }
        });
    }

    selectResult() {
        clearTimeout(this.searchTimeout);
        this.loadingSources = 0;

        if (this.state.getValue()) {
            this.selectUserElement(this.getItem(this.index).get(0));
        } else {
            this.clear();
        }

        this.$('input').trigger('blur');
    }

    clear() {
        super.clear();

        m.redraw();
    }

    sourceItems(): ItemList {
        const items = new ItemList();

        if (app.forum.attribute('canSearchUsers')) items.add('users', new UsersSearchSourceWithoutInternalRouting());

        return items;
    }

    view() {
        const view = super.view() as any;

        // view = .Search, [] = .Search-input, [][] = input.FormControl
        view.children[0].children[0].attrs.placeholder = extractText(app.translator.trans('clarkwinkelmann-author-change.forum.search.placeholder'));

        return view;
    }
}
