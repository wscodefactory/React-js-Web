import { Archive, ArchiveRestore, Copy, Folder, Pencil, Star, Trash2 } from 'lucide-react';
import { Card, CardContent, IconButton } from '../../components/common';
import type { PersonalProject, ProjectAccentColor } from '../../types/project';
import { getWorkspaceItemLabel } from '../../utils/workspaceLabels';

type ProjectCardProps = {
  disabled: boolean;
  onArchiveToggle: (project: PersonalProject) => void;
  onDelete: (project: PersonalProject) => void;
  onDuplicate: (project: PersonalProject) => void;
  onEdit: (project: PersonalProject) => void;
  onFavoriteToggle: (project: PersonalProject) => void;
  project: PersonalProject;
};

const accentClasses: Record<ProjectAccentColor, { bar: string; icon: string }> = {
  amber: { bar: 'bg-amber-500', icon: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  blue: { bar: 'bg-blue-500', icon: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  gray: { bar: 'bg-gray-500', icon: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  green: { bar: 'bg-green-600', icon: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300' },
  rose: { bar: 'bg-rose-500', icon: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
};

function formatProjectDate(value: unknown) {
  if (!value || typeof value !== 'object' || !('toDate' in value)) return '방금 전';

  const toDate = (value as { toDate?: unknown }).toDate;
  if (typeof toDate !== 'function') return '방금 전';

  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(toDate.call(value) as Date);
}

export function ProjectCard({
  disabled,
  onArchiveToggle,
  onDelete,
  onDuplicate,
  onEdit,
  onFavoriteToggle,
  project,
}: ProjectCardProps) {
  const accent = accentClasses[project.accentColor];
  const linkedLabels = project.linkedStorageKeys.map(getWorkspaceItemLabel);

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`} />
      <CardContent className="flex h-full flex-col pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}>
              <Folder className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-bold text-gray-950 dark:text-white">{project.name}</h2>
                {project.status === 'archived' ? <span className="badge">보관됨</span> : null}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">최근 수정 {formatProjectDate(project.updatedAt)}</p>
            </div>
          </div>
          <IconButton
            className={project.isFavorite ? 'text-amber-500' : ''}
            disabled={disabled}
            icon={<Star className={`h-4 w-4 ${project.isFavorite ? 'fill-current' : ''}`} />}
            label={project.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            onClick={() => onFavoriteToggle(project)}
            title={project.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          />
        </div>

        <p className="mt-4 min-h-10 text-sm leading-5 text-gray-600 dark:text-gray-300">
          {project.description || '설명이 없습니다.'}
        </p>

        <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
          {project.tags.length > 0 ? project.tags.map((tag) => (
            <span key={tag} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">#{tag}</span>
          )) : <span className="text-xs text-gray-400">태그 없음</span>}
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">연결 자료 {linkedLabels.length}개</p>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {linkedLabels.length > 0 ? linkedLabels.slice(0, 3).join(' · ') : '연결된 작업 데이터가 없습니다.'}
            {linkedLabels.length > 3 ? ` 외 ${linkedLabels.length - 3}개` : ''}
          </p>
        </div>

        <footer className="mt-auto flex flex-wrap justify-end gap-1 border-t border-gray-100 pt-3 dark:border-gray-800">
          <IconButton disabled={disabled} icon={<Pencil className="h-4 w-4" />} label="수정" onClick={() => onEdit(project)} title="수정" />
          <IconButton disabled={disabled} icon={<Copy className="h-4 w-4" />} label="복제" onClick={() => onDuplicate(project)} title="복제" />
          <IconButton
            disabled={disabled}
            icon={project.status === 'archived' ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            label={project.status === 'archived' ? '보관 해제' : '보관'}
            onClick={() => onArchiveToggle(project)}
            title={project.status === 'archived' ? '보관 해제' : '보관'}
          />
          <IconButton disabled={disabled} icon={<Trash2 className="h-4 w-4" />} label="삭제" onClick={() => onDelete(project)} title="삭제" />
        </footer>
      </CardContent>
    </Card>
  );
}
