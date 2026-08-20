import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { Button, IconButton, Input } from '../../components/common';
import {
  projectAccentColors,
  type PersonalProject,
  type ProjectAccentColor,
  type ProjectDraft,
} from '../../types/project';

type WorkspaceChoice = {
  key: string;
  label: string;
};

type ProjectDialogProps = {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (draft: ProjectDraft) => Promise<void>;
  project: PersonalProject | null;
  workspaceChoices: WorkspaceChoice[];
};

const accentColorOptions: Record<ProjectAccentColor, { className: string; label: string }> = {
  amber: { className: 'bg-amber-500', label: '노랑' },
  blue: { className: 'bg-blue-500', label: '파랑' },
  gray: { className: 'bg-gray-500', label: '회색' },
  green: { className: 'bg-green-600', label: '초록' },
  rose: { className: 'bg-rose-500', label: '분홍' },
};

function parseTags(value: string) {
  return [...new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))].slice(0, 5);
}

export function ProjectDialog({
  isOpen,
  isSaving,
  onClose,
  onSubmit,
  project,
  workspaceChoices,
}: ProjectDialogProps) {
  const [accentColor, setAccentColor] = useState<ProjectAccentColor>('green');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [linkedStorageKeys, setLinkedStorageKeys] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const isEditing = Boolean(project);

  useEffect(() => {
    if (!isOpen) return;

    setAccentColor(project?.accentColor ?? 'green');
    setDescription(project?.description ?? '');
    setErrorMessage('');
    setLinkedStorageKeys(project?.linkedStorageKeys ?? []);
    setName(project?.name ?? '');
    setTagInput(project?.tags.join(', ') ?? '');
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSaving, onClose]);

  const selectedKeySet = useMemo(() => new Set(linkedStorageKeys), [linkedStorageKeys]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSaving) onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('프로젝트 이름을 입력해주세요.');
      return;
    }

    await onSubmit({
      accentColor,
      description: description.trim(),
      linkedStorageKeys,
      name: trimmedName,
      tags: parseTags(tagInput),
    });
  };

  const toggleWorkspaceItem = (storageKey: string) => {
    setLinkedStorageKeys((current) => (
      current.includes(storageKey)
        ? current.filter((key) => key !== storageKey)
        : [...current, storageKey]
    ));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <section
        aria-labelledby="project-dialog-title"
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <FolderPlus className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <h2 id="project-dialog-title" className="text-lg font-bold text-gray-950 dark:text-white">
                {isEditing ? '프로젝트 수정' : '새 프로젝트'}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">작업 자료를 하나의 프로젝트로 묶어 관리합니다.</p>
            </div>
          </div>
          <IconButton icon={<X className="h-5 w-5" />} label="닫기" onClick={onClose} disabled={isSaving} />
        </header>

        <form className="space-y-5 px-5 py-5 sm:px-6" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label className="form-label" htmlFor="project-name">프로젝트 이름</label>
            <Input
              autoFocus
              id="project-name"
              maxLength={60}
              onChange={(event) => {
                setName(event.target.value);
                setErrorMessage('');
              }}
              placeholder="예: 고객 포털 개편"
              value={name}
            />
            {errorMessage ? <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{errorMessage}</p> : null}
          </div>

          <div>
            <label className="form-label" htmlFor="project-description">설명</label>
            <textarea
              className="form-input min-h-24 resize-y"
              id="project-description"
              maxLength={200}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="프로젝트의 목적이나 진행 내용을 적어주세요."
              value={description}
            />
            <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{description.length}/200</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <label className="form-label" htmlFor="project-tags">태그</label>
              <Input id="project-tags" onChange={(event) => setTagInput(event.target.value)} placeholder="디자인, API, 검토" value={tagInput} />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">쉼표로 구분해 최대 5개까지 저장됩니다.</p>
            </div>
            <fieldset>
              <legend className="form-label">구분 색상</legend>
              <div className="flex h-10 items-center gap-2">
                {projectAccentColors.map((color) => {
                  const option = accentColorOptions[color];
                  const isSelected = accentColor === color;

                  return (
                    <button
                      key={color}
                      aria-label={`${option.label} 색상`}
                      aria-pressed={isSelected}
                      className={`h-7 w-7 rounded-full ${option.className} outline-none ring-offset-2 ring-offset-white transition-shadow dark:ring-offset-gray-900 ${isSelected ? 'ring-2 ring-gray-900 dark:ring-white' : ''}`}
                      onClick={() => setAccentColor(color)}
                      title={option.label}
                      type="button"
                    />
                  );
                })}
              </div>
            </fieldset>
          </div>

          <fieldset>
            <legend className="form-label">연결할 작업 데이터</legend>
            {workspaceChoices.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 px-4 py-5 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                아직 연결할 저장 자료가 없습니다.
              </p>
            ) : (
              <div className="max-h-52 divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
                {workspaceChoices.map((choice) => (
                  <label key={choice.key} className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/70">
                    <input
                      checked={selectedKeySet.has(choice.key)}
                      className="h-4 w-4 shrink-0 accent-green-600"
                      onChange={() => toggleWorkspaceItem(choice.key)}
                      type="checkbox"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{choice.label}</span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{choice.key}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>취소</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? '저장 중...' : isEditing ? '변경 저장' : '프로젝트 만들기'}</Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
