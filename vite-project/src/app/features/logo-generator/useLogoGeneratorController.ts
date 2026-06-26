import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { saveStoredJson } from '../../utils/storage';
import { createZipBlob } from '../../utils/zip';
import { logoGeneratorStorageKey, logoPalettes } from './constants';
import { logoGeneratorCopy } from './copy';
import { readStoredLogoDraft } from './draftStorage';
import {
  createLogoSvg,
  downloadBlobAsset,
  downloadPngAsset,
  getLocalizedOptionLabel,
  slugifyFileName,
} from './logoAsset';
import type { LogoOption, PaletteName, SavedLogo, LogoStyle } from './types';

export function useLogoGeneratorController() {
  const { language } = useLanguage();
  const copy = logoGeneratorCopy[language];
  const [storedDraft] = useState(() => readStoredLogoDraft());
  const [brandName, setBrandName] = useState(storedDraft.draft.brandName);
  const [style, setStyle] = useState<LogoStyle>(storedDraft.draft.style);
  const [palette, setPalette] = useState<PaletteName>(storedDraft.draft.palette);
  const [seed, setSeed] = useState(storedDraft.draft.seed);
  const [favorites, setFavorites] = useState<SavedLogo[]>(storedDraft.draft.favorites);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState(storedDraft.restored
    ? copy.status.restored
    : copy.status.ready);

  const options = useMemo<LogoOption[]>(() => {
    const colors = logoPalettes[palette];
    return [0, 1, 2].map((variant) => ({
      id: `${style}-${palette}-${variant}-${seed}`,
      label: variant === 0 ? 'Primary' : `Variation ${variant}`,
      svg: createLogoSvg(brandName, style, colors, variant + seed),
    }));
  }, [brandName, palette, seed, style]);

  const favoriteIds = useMemo(() => new Set(favorites.map((logo) => logo.id)), [favorites]);

  useEffect(() => {
    saveStoredJson(logoGeneratorStorageKey, {
      brandName,
      favorites,
      palette,
      seed,
      style,
    });
  }, [brandName, favorites, palette, seed, style]);

  useEffect(() => {
    setStatus(storedDraft.restored ? copy.status.restored : copy.status.ready);
  }, [copy.status.ready, copy.status.restored, storedDraft.restored]);

  const copyLogo = async (option: LogoOption) => {
    const wasCopied = await copyTextToClipboard(option.svg);

    if (!wasCopied) {
      setCopiedId(null);
      setStatus(copy.status.clipboardBlocked);
      return;
    }

    setCopiedId(option.id);
    setStatus(copy.status.copied(getLocalizedOptionLabel(copy, option.label)));
    window.setTimeout(() => setCopiedId(null), 1200);
  };

  const refreshVariations = () => {
    setSeed((currentSeed) => currentSeed + 1);
    setStatus(copy.status.refresh);
  };

  const downloadAllSvg = () => {
    const files = options.map((option) => ({
      content: option.svg,
      path: `${slugifyFileName(brandName)}/${slugifyFileName(option.label)}.svg`,
    }));

    downloadBlobAsset(createZipBlob(files), `${slugifyFileName(brandName)}-logo-svg-set.zip`);
    setStatus(copy.status.allSvgPacked);
  };

  const toggleFavorite = (option: LogoOption) => {
    const existing = favorites.find((logo) => logo.id === option.id);

    if (existing) {
      setFavorites((current) => current.filter((logo) => logo.id !== option.id));
      setStatus(copy.status.removed(getLocalizedOptionLabel(copy, option.label)));
      return;
    }

    const savedLogo: SavedLogo = {
      brandName,
      createdAt: new Date().toISOString(),
      id: option.id,
      label: option.label,
      palette,
      seed,
      style,
      svg: option.svg,
    };

    setFavorites((current) => [savedLogo, ...current].slice(0, 12));
    setStatus(copy.status.saved(getLocalizedOptionLabel(copy, option.label)));
  };

  const copySavedLogo = async (logo: SavedLogo) => {
    const wasCopied = await copyTextToClipboard(logo.svg);
    setStatus(wasCopied ? copy.status.copySaved(getLocalizedOptionLabel(copy, logo.label)) : copy.status.clipboardBlocked);
  };

  const loadSavedLogo = (logo: SavedLogo) => {
    setBrandName(logo.brandName);
    setPalette(logo.palette);
    setSeed(logo.seed);
    setStyle(logo.style);
    setStatus(copy.status.loadSaved(getLocalizedOptionLabel(copy, logo.label)));
  };

  const removeSavedLogo = (id: string) => {
    const removedLogo = favorites.find((logo) => logo.id === id);
    setFavorites((current) => current.filter((logo) => logo.id !== id));
    setStatus(removedLogo ? copy.status.removed(getLocalizedOptionLabel(copy, removedLogo.label)) : copy.status.savedRemoved);
  };

  const downloadFavorites = () => {
    if (favorites.length === 0) {
      setStatus(copy.status.favoriteDownloadEmpty);
      return;
    }

    const files = favorites.map((logo, index) => ({
      content: logo.svg,
      path: `saved/${String(index + 1).padStart(2, '0')}-${slugifyFileName(`${logo.brandName}-${logo.label}`)}.svg`,
    }));

    downloadBlobAsset(createZipBlob(files), 'saved-logo-favorites.zip');
    setStatus(copy.status.favoritePacked(favorites.length));
  };

  const downloadLogoPng = async (option: LogoOption) => {
    setIsExporting(true);
    try {
      await downloadPngAsset(option.svg, `${brandName}-${option.label}`);
      setStatus(copy.status.pngReady(getLocalizedOptionLabel(copy, option.label)));
    } catch {
      setStatus(copy.status.exportPngFailed);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAllPng = async () => {
    setIsExporting(true);
    try {
      for (const option of options) {
        await downloadPngAsset(option.svg, `${brandName}-${option.label}`);
      }
      setStatus(copy.status.allPngReady);
    } catch {
      setStatus(copy.status.exportPngBatchFailed);
    } finally {
      setIsExporting(false);
    }
  };

  return {
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
  };
}
