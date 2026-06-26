import { ActivityList } from '@/app/components/showcase/ActivityList';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { ResourceGrid } from '@/app/components/showcase/ResourceGrid';
import { useLanguage } from '@/app/context/LanguageContext';
import { HistoryPanel, QuickToolPanel, usePowerTsToolkitController } from '@/app/features/power-ts-toolkit';
import { powerToolkitCopy } from '@/app/features/power-ts-toolkit/copy';
import { powerToolkitMetrics, powerToolkitRecentActivity, powerToolkitResources } from '@/app/data/showcase';

export function PowerTsToolkitPage() {
  const { language } = useLanguage();
  const text = powerToolkitCopy[language];
  const toolkit = usePowerTsToolkitController();
  const metricLabels = [text.page.metrics.availableTools, text.page.metrics.categories, text.page.metrics.usesToday];
  const localizedMetrics = powerToolkitMetrics.map((item, index) => ({
    ...item,
    label: metricLabels[index] ?? item.label,
  }));
  const localizedResources = powerToolkitResources.map((item) => ({
    ...item,
    ...(text.page.resources[item.title] ?? {}),
  }));

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight={text.page.highlight}
        title={text.page.title}
        description={text.page.description}
      />

      <MetricGrid items={localizedMetrics} columnsClassName="grid-cols-1 sm:grid-cols-3" />

      <ActivityList title={text.page.activity.title} items={text.page.activity.items.length > 0 ? text.page.activity.items : powerToolkitRecentActivity} />

      <ResourceGrid
        title={text.page.resourcesTitle}
        items={localizedResources}
        selectedItemId={toolkit.selectedResourceId}
        onSelect={(item) => toolkit.handleResourceSelect(powerToolkitResources.find((resource) => resource.id === item.id)?.title ?? item.title)}
      />

      <QuickToolPanel
        conversionTarget={toolkit.conversionTarget}
        input={toolkit.input}
        onClear={toolkit.handleClear}
        onInputChange={toolkit.setInput}
        onLoadSample={toolkit.loadSample}
        onProcess={toolkit.handleProcess}
        onTargetChange={toolkit.handleTargetChange}
        onToolChange={toolkit.handleToolChange}
        result={toolkit.result}
        selectedHelp={toolkit.selectedHelp}
        selectedTool={toolkit.selectedTool}
      />

      <HistoryPanel
        history={toolkit.history}
        onClearHistory={toolkit.clearHistory}
        onDeleteHistoryItem={toolkit.deleteHistoryItem}
        onLoadHistoryItem={toolkit.loadHistoryItem}
      />
    </div>
  );
}
