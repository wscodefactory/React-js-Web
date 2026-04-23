/**
 * Global command-palette style search modal.
 *
 * 역할:
 * - 전체 페이지/쇼케이스 항목을 검색한다.
 * - 최근 검색 기록을 localStorage에 저장하고 다시 불러온다.
 * - 클릭한 검색 결과로 즉시 라우팅한다.
 *
 * 탐색 UX 측면에서 중요한 파일이며,
 * 실제 검색 대상은 `config/navigation.tsx`의 `searchItems`를 재사용한다.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Clock } from 'lucide-react';
import { searchItems } from '../config/navigation';
import type { SearchItem } from '../types/navigation';
import type { StoredRecentSearch } from '../types/common';
import { loadStoredList, saveStoredList } from '../utils/storage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 최근 검색 레코드가 원하는 형태인지 검사하는 타입 가드.
 *
 * localStorage는 문자열 기반 저장소이므로, 다시 읽어왔을 때
 * 데이터 구조가 기대한 타입과 맞는지 런타임에서 검사해야 안전하다.
 */
function isStoredRecentSearch(value: unknown): value is StoredRecentSearch {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.name === 'string' &&
    typeof record.path === 'string' &&
    typeof record.timestamp === 'number'
  );
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<StoredRecentSearch[]>([]);
  const navigate = useNavigate();

  /**
   * 사용자가 입력한 검색어를 기준으로 전체 검색 대상 중 일치 항목만 추린다.
   *
   * `useMemo`를 사용하는 이유:
   * - 입력값이 바뀔 때만 결과를 다시 계산하고
   * - 불필요한 반복 필터링을 줄이기 위해서다.
   */
  const filteredResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchItems.filter((item) => {
      const haystacks = [item.name, item.description, item.category, ...item.keywords].map((value) => value.toLowerCase());
      return haystacks.some((value) => value.includes(normalizedQuery));
    });
  }, [searchQuery]);

  /**
   * 모달이 열릴 때마다 최근 검색 기록을 다시 불러온다.
   *
   * 사용자가 다른 화면에서 검색을 수행했더라도
   * 모달을 다시 열면 최신 상태를 반영하게 된다.
   */
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(loadStoredList('recentSearches', isStoredRecentSearch));
    }
  }, [isOpen]);

  /**
   * 검색 결과 클릭 시 최근 검색 목록을 갱신한다.
   *
   * 같은 path는 중복 저장하지 않고 최신 항목을 맨 앞으로 보낸다.
   * 최대 5개까지만 유지해 리스트가 과도하게 길어지지 않도록 한다.
   */
  const saveRecentSearch = (item: SearchItem) => {
    const newSearch: StoredRecentSearch = {
      name: item.name,
      path: item.path,
      timestamp: Date.now(),
    };

    const updated = [newSearch, ...recentSearches.filter((search) => search.path !== item.path)].slice(0, 5);

    setRecentSearches(updated);
    saveStoredList('recentSearches', updated);
  };

  /**
   * 최근 검색 1개를 삭제한다.
   *
   * 바깥 클릭 이벤트로 항목 이동이 발생하지 않도록
   * `preventDefault`, `stopPropagation`을 함께 사용한다.
   */
  const removeRecentSearch = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = recentSearches.filter((search) => search.path !== path);
    setRecentSearches(updated);
    saveStoredList('recentSearches', updated);
  };

  /**
   * 최근 검색 전체 삭제.
   */
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  /**
   * 검색 결과 또는 최근 검색 항목을 클릭했을 때의 공통 처리.
   *
   * - 필요하면 최근 검색으로 저장
   * - 라우팅 수행
   * - 모달 닫기
   * - 입력창 초기화
   */
  const handleItemClick = (path: string, item?: SearchItem) => {
    if (item) {
      saveRecentSearch(item);
    }
    navigate(path);
    onClose();
    setSearchQuery('');
  };

  /**
   * 모달이 열릴 때마다 검색 입력창을 초기화한다.
   */
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  /**
   * ESC 키로 모달을 닫을 수 있도록 전역 키 이벤트를 등록한다.
   *
   * 모달이 닫힐 때는 cleanup으로 리스너를 제거해 중복 등록을 방지한다.
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for components, pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() === '' ? (
            recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearAllRecentSearches}
                    className="text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((item) => (
                  <div
                    key={item.path}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-left"
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.path)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 text-gray-900 dark:text-white">{item.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(item.path, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Type to search for pages and components...</p>
                <p className="text-sm mt-2">Try "button", "modal", "svg", or "project"</p>
              </div>
            )
          ) : filteredResults.length > 0 ? (
            <div className="py-2">
              {filteredResults.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path, item)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
