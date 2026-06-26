import { Download, ImageDown, RefreshCw, Sparkles, Star } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';
import { logoPaletteNames, logoPalettes, logoStyles } from '../../features/logo-generator/constants';
import { downloadSvgAsset } from '../../features/logo-generator/logoAsset';
import { LogoPreviewCard } from '../../features/logo-generator/LogoPreviewCard';
import { SavedLogoCard } from '../../features/logo-generator/SavedLogoCard';
import { useLogoGeneratorController } from '../../features/logo-generator/useLogoGeneratorController';

export function LogoGeneratorPage() {
  const {
    brandName,
    copiedId,
    copy,
    copyLogo,
    copySavedLogo,
    downloadAllPng,
    downloadAllSvg,
    downloadFavorites,
    downloadLogoPng,
    favoriteIds,
    favorites,
    isExporting,
    language,
    loadSavedLogo,
    options,
    palette,
    refreshVariations,
    removeSavedLogo,
    setBrandName,
    setPalette,
    setStyle,
    status,
    style,
    toggleFavorite,
  } = useLogoGeneratorController();

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight={copy.page.highlight} title={copy.page.title} description={copy.page.description} />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardContent className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{copy.brandName}</span>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{copy.style}</span>
              <div className="grid grid-cols-2 gap-2">
                {logoStyles.map((logoStyle) => (
                  <button
                    key={logoStyle}
                    type="button"
                    onClick={() => setStyle(logoStyle)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${style === logoStyle ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                  >
                    {copy.styleLabels[logoStyle]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{copy.palette}</span>
              <div className="space-y-2">
                {logoPaletteNames.map((paletteName) => (
                  <button
                    key={paletteName}
                    type="button"
                    onClick={() => setPalette(paletteName)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${palette === paletteName ? 'border-green-500' : 'border-gray-300 dark:border-gray-700'}`}
                  >
                    <span>{copy.paletteLabels[paletteName]}</span>
                    <span className="flex gap-1">
                      {logoPalettes[paletteName].map((color) => (
                        <span key={color} className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={refreshVariations} className="w-full justify-center">
              <RefreshCw className="h-4 w-4" /> {copy.refresh}
            </Button>
            <Button variant="secondary" onClick={downloadAllSvg} className="w-full justify-center">
              <Download className="h-4 w-4" /> {copy.downloadSvgZip}
            </Button>
            <Button variant="secondary" onClick={downloadAllPng} disabled={isExporting} className="w-full justify-center">
              <ImageDown className="h-4 w-4" /> {copy.downloadPngSet}
            </Button>
            <Button variant="secondary" onClick={downloadFavorites} disabled={favorites.length === 0} className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
              <Star className="h-4 w-4" /> {copy.downloadSaved}
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200">
            <Sparkles className="h-4 w-4" />
            {status}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {options.map((option) => (
              <LogoPreviewCard
                key={option.id}
                option={option}
                brandName={brandName}
                copied={copiedId === option.id}
                copy={copy}
                onCopy={copyLogo}
                onDownloadPng={downloadLogoPng}
                onToggleFavorite={toggleFavorite}
                saved={favoriteIds.has(option.id)}
              />
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{copy.savedTitle}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{copy.savedDescription}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                {copy.saved(favorites.length)}
              </span>
            </div>

            {favorites.length > 0 ? (
              <div className="space-y-3">
                {favorites.map((logo) => (
                  <SavedLogoCard
                    key={logo.id}
                    language={language}
                    logo={logo}
                    copy={copy}
                    onCopy={copySavedLogo}
                    onDownload={(savedLogo) => downloadSvgAsset(savedLogo.svg, `${savedLogo.brandName}-${savedLogo.label}`)}
                    onLoad={loadSavedLogo}
                    onRemove={removeSavedLogo}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {copy.emptySaved}
                </CardContent>
              </Card>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
