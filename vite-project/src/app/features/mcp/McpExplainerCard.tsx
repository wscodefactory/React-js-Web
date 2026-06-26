import { Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { mcpCopy } from './copy';

export function McpExplainerCard() {
  const { language } = useLanguage();
  const text = mcpCopy[language].explainer;

  return (
    <Card>
      <CardContent className="space-y-3">
        <h2 className="card-title">{text.title}</h2>
        <p className="card-description">
          {text.body}
        </p>
      </CardContent>
    </Card>
  );
}
