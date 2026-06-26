import { Download, Search, SearchX, Trash2, Upload } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';
import { getLocalizedCategory } from '../../features/custom-svg-library/copy';
import { svgSizeOptions } from '../../features/custom-svg-library/data';
import { IconAssetCard } from '../../features/custom-svg-library/IconAssetCard';
import { useCustomSvgLibraryController } from '../../features/custom-svg-library/useCustomSvgLibraryController';

export function CustomSvgLibraryPage() {
  const {
    builtInIconCount,
    categories,
    clearImportedIcons,
    clearFilters,
    copiedIconId,
    copySvg,
    downloadVisibleIcons,
    filteredIcons,
    importedIconCount,
    iconColor,
    iconSize,
    importInputRef,
    language,
    libraryIcons,
    libraryText,
    searchQuery,
    removeImportedIcon,
    selectedCategory,
    setIconColor,
    setIconSize,
    setSearchQuery,
    setSelectedCategory,
    statusMessage,
    uploadSvgFiles,
  } = useCustomSvgLibraryController();

  return (
    <main className="p-4 md:p-8">
      <PageIntro
        highlight={libraryText.page.highlight}
        title={libraryText.page.title}
        description={libraryText.page.description}
      />

      <Card className="mb-8">
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_150px_120px_auto]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={libraryText.searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getLocalizedCategory(language, category)}
                </option>
              ))}
            </select>

            <input
              type="color"
              value={iconColor}
              onChange={(event) => setIconColor(event.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white dark:border-gray-700"
              aria-label={libraryText.aria.color}
            />

            <select
              value={iconSize}
              onChange={(event) => setIconSize(Number(event.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              aria-label={libraryText.aria.size}
            >
              {svgSizeOptions.map((value) => (
                <option key={value} value={value}>{value}px</option>
              ))}
            </select>

            <div>
              <input
                ref={importInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                multiple
                onChange={uploadSvgFiles}
                className="hidden"
              />
              <Button onClick={() => importInputRef.current?.click()} className="w-full justify-center">
                <Upload className="h-4 w-4" />
                {libraryText.importSvg}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">{libraryText.builtInCount(builtInIconCount)}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">{libraryText.importedCount(importedIconCount)}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">{libraryText.showingCount(filteredIcons.length)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={downloadVisibleIcons} className="gap-2">
                <Download className="h-4 w-4" />
                {libraryText.downloadZip}
              </Button>
              <Button variant="secondary" onClick={clearImportedIcons} className="gap-2 text-red-600 dark:text-red-300">
                <Trash2 className="h-4 w-4" />
                {libraryText.clearImported}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
          {copiedIconId ? libraryText.copiedBanner : statusMessage}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{libraryText.countSummary(filteredIcons.length, libraryIcons.length)}</p>
      </div>

      {filteredIcons.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredIcons.map((asset) => (
            <IconAssetCard
              key={asset.id}
              asset={asset}
              color={iconColor}
              language={language}
              size={iconSize}
              text={libraryText}
              onCopy={copySvg}
              onRemove={asset.category === 'Custom' ? removeImportedIcon : undefined}
            />
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <SearchX className="mb-4 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{libraryText.emptyTitle}</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">{libraryText.emptyDescription}</p>
            <Button variant="secondary" onClick={clearFilters} className="mt-5">{libraryText.clearFilters}</Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
