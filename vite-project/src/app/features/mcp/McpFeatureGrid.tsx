import { Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { mcpFeatures } from '../../data/catalog';
import { mcpCopy } from './copy';

export function McpFeatureGrid() {
  const { language } = useLanguage();
  const text = mcpCopy[language].features;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{text.title}</h2>
        <p className="text-muted mt-1">{text.description}</p>
      </div>
      <div className="grid-auto">
        {mcpFeatures.map((feature) => {
          const Icon = feature.icon;
          const featureCopy = text.items[feature.title] ?? feature;

          return (
            <Card key={feature.title} className="h-full">
              <CardContent className="space-y-3">
                <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                <h3 className="card-title">{featureCopy.title}</h3>
                <p className="card-description">{featureCopy.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
