import { ActivityList } from '@/app/components/showcase/ActivityList';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { ResourceGrid } from '@/app/components/showcase/ResourceGrid';
import { QuickToolPanel, usePowerTsToolkitController } from '@/app/features/power-ts-toolkit';
import { powerToolkitMetrics, powerToolkitRecentActivity, powerToolkitResources } from '@/app/data/showcase';

export function PowerTsToolkitPage() {
  const toolkit = usePowerTsToolkitController();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="PowerT's"
        title="Toolkit"
        description="Essential tools for TypeScript developers and power users"
      />

      <MetricGrid items={powerToolkitMetrics} columnsClassName="grid-cols-1 sm:grid-cols-3" />

      <ActivityList title="Recently Used" items={powerToolkitRecentActivity} />

      <ResourceGrid
        title="All Tools"
        items={powerToolkitResources}
        selectedItemId={toolkit.selectedResourceId}
        onSelect={(item) => toolkit.handleResourceSelect(item.title)}
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
    </div>
  );
}
