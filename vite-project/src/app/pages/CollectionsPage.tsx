import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Clock3, ExternalLink, Folder, FolderHeart, FolderPlus, Star, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Input } from '../components/common';
import {
  createPreviewCollection,
  defaultPreviewCollection,
  deletePreviewCollection,
  moveSavedPreviewEntry,
  previewLibraryChangeEvent,
  readPreviewCollections,
  readRecentPreviews,
  readSavedPreviewEntries,
  removeSavedPreviewEntry,
  type PreviewCollection,
  type PreviewLibraryEntry,
  type RecentPreviewEntry,
} from '../components/showcase/savedPreviews';

const allCollectionsId = 'all';

function formatDate(timestamp: number) {
  if (!timestamp) return '기록 없음';

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function AccessBadge({ accessTier }: { accessTier: PreviewLibraryEntry['accessTier'] }) {
  return (
    <span className={`badge ${accessTier === 'pro'
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
      : 'badge-success'}`}
    >
      {accessTier === 'pro' ? '프로' : '일반'}
    </span>
  );
}

export function CollectionsPage() {
  const [collections, setCollections] = useState<PreviewCollection[]>([defaultPreviewCollection]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [recentEntries, setRecentEntries] = useState<RecentPreviewEntry[]>([]);
  const [savedEntries, setSavedEntries] = useState<PreviewLibraryEntry[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(allCollectionsId);

  useEffect(() => {
    const syncLibrary = () => {
      setCollections(readPreviewCollections());
      setRecentEntries(readRecentPreviews());
      setSavedEntries(readSavedPreviewEntries());
    };

    syncLibrary();
    window.addEventListener(previewLibraryChangeEvent, syncLibrary);
    window.addEventListener('storage', syncLibrary);

    return () => {
      window.removeEventListener(previewLibraryChangeEvent, syncLibrary);
      window.removeEventListener('storage', syncLibrary);
    };
  }, []);

  const visibleSavedEntries = useMemo(() => (
    selectedCollectionId === allCollectionsId
      ? savedEntries
      : savedEntries.filter((entry) => entry.collectionId === selectedCollectionId)
  ), [savedEntries, selectedCollectionId]);

  const collectionOptions = collections.map((collection) => ({
    label: collection.name,
    value: collection.id,
  }));

  const handleCreateCollection = (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const collection = createPreviewCollection(newCollectionName);
      setNewCollectionName('');
      setSelectedCollectionId(collection.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '컬렉션을 만들지 못했습니다.');
    }
  };

  const handleDeleteCollection = (collection: PreviewCollection) => {
    if (!window.confirm(`${collection.name} 컬렉션을 삭제할까요? 저장된 항목은 기본 컬렉션으로 이동합니다.`)) {
      return;
    }

    deletePreviewCollection(collection.id);
    if (selectedCollectionId === collection.id) setSelectedCollectionId(allCollectionsId);
  };

  return (
    <div className="container-page space-y-6">
      <section className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">Library</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">내 컬렉션</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              저장한 컴포넌트를 폴더별로 정리하고 최근 확인한 항목으로 빠르게 돌아갑니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="badge badge-success">저장 {savedEntries.length}개</span>
            <span className="badge">최근 본 항목 {recentEntries.length}개</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">최근 본 항목</h2>
        </div>
        {recentEntries.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recentEntries.slice(0, 8).map((entry) => (
              <Link
                key={entry.id}
                to={entry.path}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-green-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 font-semibold text-gray-950 dark:text-white">{entry.title}</p>
                  <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <AccessBadge accessTier={entry.accessTier} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.viewedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
            컴포넌트 미리보기를 열면 최근 본 항목이 여기에 표시됩니다.
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="self-start">
          <CardHeader
            title="컬렉션"
            description={`${collections.length}개 폴더`}
            icon={<FolderHeart className="h-5 w-5 text-green-600" />}
          />
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateCollection} className="space-y-2">
              <label className="form-group">
                <span className="form-label">새 컬렉션</span>
                <Input
                  maxLength={30}
                  value={newCollectionName}
                  onChange={(event) => setNewCollectionName(event.target.value)}
                  placeholder="예: 관리자 화면"
                />
              </label>
              <Button type="submit" className="w-full" disabled={!newCollectionName.trim()}>
                <FolderPlus className="mr-2 inline h-4 w-4" />
                컬렉션 만들기
              </Button>
            </form>

            {errorMessage ? <p className="text-sm text-red-600 dark:text-red-300">{errorMessage}</p> : null}

            <div className="space-y-1 border-t border-gray-200 pt-3 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setSelectedCollectionId(allCollectionsId)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selectedCollectionId === allCollectionsId
                  ? 'bg-green-50 font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              >
                <span className="inline-flex items-center gap-2"><Star className="h-4 w-4" />전체 저장</span>
                <span>{savedEntries.length}</span>
              </button>
              {collections.map((collection) => (
                <div key={collection.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCollectionId(collection.id)}
                    className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selectedCollectionId === collection.id
                      ? 'bg-green-50 font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
                  >
                    <span className="inline-flex min-w-0 items-center gap-2"><Folder className="h-4 w-4 shrink-0" /><span className="truncate">{collection.name}</span></span>
                    <span>{savedEntries.filter((entry) => entry.collectionId === collection.id).length}</span>
                  </button>
                  {collection.id !== defaultPreviewCollection.id ? (
                    <button
                      type="button"
                      title="컬렉션 삭제"
                      aria-label={`${collection.name} 컬렉션 삭제`}
                      onClick={() => handleDeleteCollection(collection)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              {selectedCollectionId === allCollectionsId
                ? '전체 저장'
                : collections.find((collection) => collection.id === selectedCollectionId)?.name ?? '컬렉션'}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{visibleSavedEntries.length}개</span>
          </div>

          {visibleSavedEntries.length > 0 ? (
            <div className="space-y-3">
              {visibleSavedEntries.map((entry) => (
                <article key={entry.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-950 dark:text-white">{entry.title}</h3>
                        <AccessBadge accessTier={entry.accessTier} />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{entry.description}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">저장일 {formatDate(entry.savedAt)}</p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <label className="sr-only" htmlFor={`collection-${entry.id}`}>컬렉션 이동</label>
                      <select
                        id={`collection-${entry.id}`}
                        value={entry.collectionId}
                        onChange={(event) => moveSavedPreviewEntry(entry.id, event.target.value)}
                        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                      >
                        {collectionOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <Link to={entry.path} className="btn btn-secondary">
                        <ExternalLink className="mr-2 inline h-4 w-4" />
                        열기
                      </Link>
                      <button
                        type="button"
                        title="저장 해제"
                        aria-label={`${entry.title} 저장 해제`}
                        onClick={() => removeSavedPreviewEntry(entry.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-12 text-center dark:border-gray-700">
              <FolderHeart className="mx-auto h-9 w-9 text-gray-400" />
              <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-100">저장된 컴포넌트가 없습니다</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">컴포넌트 카드의 더보기 메뉴에서 미리보기를 저장해주세요.</p>
              <Link to="/components" className="btn btn-secondary mt-4">컴포넌트 보기</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
