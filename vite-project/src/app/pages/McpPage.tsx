/**
 * Route page reserved for MCP-related content.
 * Structured sections and typed feature data make the page read like an app surface, not static HTML.
 */
import { Button, Card, CardContent, FormField, Input, SectionHeader } from '../components/common';
import { mcpFeatures } from '../data/catalog';

const supportedPlatforms = ['Canvas', 'UI Library', 'GitHub'];

export function McpPage() {
  return (
    <div className="container-page space-y-section">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <SectionHeader
          title="MCP"
          titleHighlight="PowerLibs"
          description="Build and share a component library platform for Power Apps style workflows, with a community-driven distribution model."
        />

        <div className="flex flex-col sm:flex-row items-end justify-center gap-3">
          <FormField label="Import URL" className="w-full sm:flex-1 text-left">
            <Input type="text" placeholder="Paste an import URL" />
          </FormField>
          <Button className="w-full sm:w-auto">Import</Button>
        </div>
      </section>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="card-title">What is MCP?</h2>
          <p className="card-description">
            MCP gives teams a single place to publish, discover, version, and reuse component knowledge. It works like a curated registry for app building blocks.
          </p>
        </CardContent>
      </Card>

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
                  <Icon className="w-8 h-8 text-primary" />
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-description">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="card-title">Works with</h2>
          <div className="flex flex-wrap gap-3">
            {supportedPlatforms.map((platform) => (
              <span key={platform} className="badge badge-success">
                {platform}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
