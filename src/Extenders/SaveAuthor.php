<?php

namespace ClarkWinkelmann\AuthorChange\Extenders;

use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving as DiscussionSaving;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Post\Event\Saving as PostSaving;
use Flarum\Post\Post;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\User;
use Illuminate\Contracts\Container\Container;

class SaveAuthor implements ExtenderInterface
{
    use AssertPermissionTrait;

    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(DiscussionSaving::class, [$this, 'saveDiscussion']);
        $container['events']->listen(PostSaving::class, [$this, 'savePost']);
    }

    public function saveDiscussion(DiscussionSaving $event)
    {
        $this->saveAuthor($event->discussion, $event->actor, $event->data);
    }

    public function savePost(PostSaving $event)
    {
        $this->saveAuthor($event->post, $event->actor, $event->data);
    }

    /**
     * @param AbstractModel|Discussion|Post $model
     * @param User $actor
     * @param array $data
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    protected function saveAuthor(AbstractModel $model, User $actor, array $data)
    {
        if (isset($data['relationships']['user']['data'])) {
            $this->assertCan($actor, 'clarkwinkelmann-author-change.edit');

            if (isset($data['relationships']['user']['data']['id'])) {
                $userId = $data['relationships']['user']['data']['id'];
                $user = User::findOrFail($userId);

                $model->user()->associate($user);
            } else if (empty($data['relationships']['user']['data'])) {
                $model->user()->dissociate();
            }
        }
    }
}
