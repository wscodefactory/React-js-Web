import { FileCode } from 'lucide-react';
import { Card, CardContent } from '../../components/common';
import { yamlFeatureCards } from './data';

export function YamlFeatureCards() {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-3">
      {yamlFeatureCards.map((item) => (
        <Card key={item}>
          <CardContent className="flex items-center gap-3">
            <FileCode className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900 dark:text-white">{item}</span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
