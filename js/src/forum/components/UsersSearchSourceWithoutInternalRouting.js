import UsersSearchSource from 'flarum/components/UsersSearchSource';

export default class UsersSearchSourceWithoutInternalRouting extends UsersSearchSource {
    view(query) {
        const view = super.view(query);

        if (!view) {
            return '';
        }

        // view[0] is the header, which we don't need as we know all results are users anyway
        const resultsWithoutHeader = view[1];

        resultsWithoutHeader.forEach(result => {
            delete result.children[0].attrs.config;
        });

        return resultsWithoutHeader;
    }
}
