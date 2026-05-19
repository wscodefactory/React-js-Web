import { Card, CardContent } from '../../components/common';
import { mcpFeatures } from '../../data/catalog';

export function McpFeatureGrid() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What MCP helps you do</h2>
        <p className="text-muted mt-1">Build, govern, and distribute reusable assets with a clearer delivery workflow.</p>
      </div>
      <div className="grid-auto">
        {mcpFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title} className="h-full">
              <CardContent className="space-y-3">
                <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
