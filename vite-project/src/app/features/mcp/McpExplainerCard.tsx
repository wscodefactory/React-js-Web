import { Card, CardContent } from '../../components/common';

export function McpExplainerCard() {
  return (
    <Card>
      <CardContent className="space-y-3">
        <h2 className="card-title">What is MCP?</h2>
        <p className="card-description">
          MCP gives teams a single place to publish, discover, version, and reuse component knowledge. It works like a curated registry for app building blocks.
        </p>
      </CardContent>
    </Card>
  );
}
