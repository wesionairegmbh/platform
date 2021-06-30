<?php declare(strict_types=1);

namespace Shopware\Core\Content\Flow\Action;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\Event\CustomerAware;
use Shopware\Core\Framework\Event\FlowEvent;

/**
 * @internal (FEATURE_NEXT_8225)
 */
class RemoveCustomerTagAction extends FlowAction
{
    private EntityRepositoryInterface $customerTagRepository;

    public function __construct(EntityRepositoryInterface $customerTagRepository)
    {
        $this->customerTagRepository = $customerTagRepository;
    }

    public function getName(): string
    {
        return FlowAction::REMOVE_CUSTOMER_TAG;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            FlowAction::REMOVE_CUSTOMER_TAG => 'handle',
        ];
    }

    public function requirements(): array
    {
        return [CustomerAware::class];
    }

    public function handle(FlowEvent $event): void
    {
        $config = $event->getConfig();
        if (!\array_key_exists('tagIds', $config)) {
            return;
        }

        $tagIds = array_keys($config['tagIds']);
        $baseEvent = $event->getEvent();

        if (!$baseEvent instanceof CustomerAware || empty($tagIds)) {
            return;
        }

        $tags = array_map(static function ($tagId) use ($baseEvent) {
            return [
                'customerId' => $baseEvent->getCustomerId(),
                'tagId' => $tagId,
            ];
        }, $tagIds);

        $this->customerTagRepository->delete($tags, $baseEvent->getContext());
    }
}
