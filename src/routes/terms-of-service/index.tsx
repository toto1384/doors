import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/terms-of-service/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('translation', { keyPrefix: 'terms-of-service' });

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('lastUpdated', { date: new Date().toLocaleDateString() })}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            {t('introduction')}
          </p>
        </div>
      </div>
    </div>
  );
}
