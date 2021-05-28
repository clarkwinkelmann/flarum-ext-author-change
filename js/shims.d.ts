import Mithril from 'mithril';

declare global {
    const m: Mithril.Static;
}

import User from 'flarum/common/models/User';

declare module 'flarum/common/models/Discussion' {
    export default interface Discussion {
        user(): User | false

        createdAt(): Date
    }
}

declare module 'flarum/common/models/Post' {
    export default interface Post {
        user(): User | false

        createdAt(): Date

        editedAt(): Date | null
    }
}
