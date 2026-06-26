import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { saveStoredJson } from '../../utils/storage';
import { createZipBlob } from '../../utils/zip';
import { customSvgLibraryCopy, getLocalizedIconName } from './copy';
import { customSvgLibraryStorageKey, iconAssets } from './data';
import { readStoredSvgLibraryDraft } from './draftStorage';
import { downloadBlobAsset, getAssetSvg, sanitizeSvgMarkup, slugifyAssetName } from './svgAsset';
import type { IconAsset, StoredIconAsset, SvgLibraryDraft } from './types';

export function useCustomSvgLibraryController() {
  const { language } = useLanguage();
  const libraryText = customSvgLibraryCopy[language];
  const importInputRef = useRef<HTMLInputElement>(null);
  const [storedLibrary] = useState(() => readStoredSvgLibraryDraft());
  const [importedIcons, setImportedIcons] = useState<StoredIconAsset[]>(storedLibrary.draft.customIcons);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(storedLibrary.draft.selectedCategory);
  const [iconColor, setIconColor] = useState(storedLibrary.draft.color);
  const [iconSize, setIconSize] = useState(storedLibrary.draft.size);
  const [copiedIconId, setCopiedIconId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(storedLibrary.restored
    ? libraryText.status.restored
    : libraryText.status.ready);

  const libraryIcons = useMemo<IconAsset[]>(() => [...importedIcons, ...iconAssets], [importedIcons]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(libraryIcons.map((asset) => asset.category)))], [libraryIcons]);
  const importedIconCount = importedIcons.length;
  const builtInIconCount = iconAssets.length;

  const filteredIcons = useMemo(() => {
    return libraryIcons.filter((asset) => {
      const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
      const searchableName = `${asset.name} ${getLocalizedIconName(language, asset.name)}`.toLowerCase();
      const matchesQuery = searchableName.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [language, libraryIcons, searchQuery, selectedCategory]);

  useEffect(() => {
    const draft: SvgLibraryDraft = {
      color: iconColor,
      customIcons: importedIcons,
      selectedCategory,
      size: iconSize,
    };

    saveStoredJson(customSvgLibraryStorageKey, draft);
  }, [iconColor, iconSize, importedIcons, selectedCategory]);

  useEffect(() => {
    setStatusMessage(storedLibrary.restored ? libraryText.status.restored : libraryText.status.ready);
  }, [libraryText.status.ready, libraryText.status.restored, storedLibrary.restored]);

  const copySvg = async (asset: IconAsset) => {
    const wasCopied = await copyTextToClipboard(getAssetSvg(asset, iconColor, iconSize));

    if (!wasCopied) {
      setCopiedIconId(null);
      setStatusMessage(libraryText.status.clipboardBlocked);
      return;
    }

    setCopiedIconId(asset.id);
    setStatusMessage(libraryText.status.copied(getLocalizedIconName(language, asset.name)));
    window.setTimeout(() => setCopiedIconId(null), 1200);
  };

  const uploadSvgFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const svg = sanitizeSvgMarkup(String(reader.result ?? ''));
        if (!svg) {
          setStatusMessage(libraryText.status.invalid(file.name));
          return;
        }

        const id = `${file.name}-${file.lastModified}`;
        const name = file.name.replace(/\.svg$/i, '').replace(/[-_]+/g, ' ');
        setImportedIcons((current) => [{ id, name, category: 'Custom', svg }, ...current.filter((asset) => asset.id !== id)]);
        setSelectedCategory('Custom');
        setStatusMessage(libraryText.status.added(file.name));
      };

      reader.readAsText(file, 'UTF-8');
    });

    event.target.value = '';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const removeImportedIcon = (id: string) => {
    const removedIcon = importedIcons.find((asset) => asset.id === id);
    setImportedIcons((current) => current.filter((asset) => asset.id !== id));
    setStatusMessage(removedIcon ? libraryText.status.removed(removedIcon.name) : libraryText.status.customRemoved);
  };

  const clearImportedIcons = () => {
    if (importedIcons.length === 0) {
      setStatusMessage(libraryText.status.noImported);
      return;
    }

    setImportedIcons([]);
    setSelectedCategory('All');
    setStatusMessage(libraryText.status.cleared);
  };

  const downloadVisibleIcons = () => {
    if (filteredIcons.length === 0) {
      setStatusMessage(libraryText.status.noVisible);
      return;
    }

    const files = filteredIcons.map((asset, index) => {
      const categoryFolder = slugifyAssetName(asset.category) || 'icons';
      const fileName = slugifyAssetName(asset.name) || asset.id || `icon-${index + 1}`;

      return {
        content: getAssetSvg(asset, iconColor, iconSize),
        path: `${categoryFolder}/${String(index + 1).padStart(2, '0')}-${fileName}.svg`,
      };
    });

    downloadBlobAsset(createZipBlob(files), 'custom-svg-visible-icons.zip');
    setStatusMessage(libraryText.status.packed(filteredIcons.length));
  };

  return {
    libraryIcons,
    builtInIconCount,
    categories,
    clearImportedIcons,
    clearFilters,
    copiedIconId,
    copySvg,
    importedIconCount,
    downloadVisibleIcons,
    filteredIcons,
    iconColor,
    iconSize,
    importInputRef,
    language,
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
  };
}
