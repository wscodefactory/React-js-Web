import { FileCode } from 'lucide-react';
import { Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { yamlLibraryText } from '../../i18n';

export function YamlFeatureCards() {
  const { language } = useLanguage();
  const text = yamlLibraryText[language];

  return (
    <section className="mb-8 grid gap-4 md:grid-cols-3">
      {text.featureCards.map((item) => (
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
