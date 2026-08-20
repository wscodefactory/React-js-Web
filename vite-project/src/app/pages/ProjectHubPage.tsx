import { useEffect, useMemo, useState } from 'react';
import { Archive, FolderKanban, FolderOpen, Plus, Search, Star } from 'lucide-react';
import { Button, Input } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceSync } from '../context/WorkspaceSyncContext';
import { ProjectCard } from '../features/project-hub/ProjectCard';
import { ProjectDialog } from '../features/project-hub/ProjectDialog';
import { recordActivity } from '../services/activityService';
import {
  createUserProject,
  deleteUserProject,
  duplicateUserProject,
  setUserProjectFavorite,
  setUserProjectStatus,
  subscribeUserProjects,
  updateUserProject,
} from '../services/projectService';
import type { ActivityAction } from '../types/activity';
import type { PersonalProject, ProjectDraft } from '../types/project';
import { getWorkspaceItemLabel, isProjectWorkspaceItem } from '../utils/workspaceLabels';

type ProjectFilter = 'active' | 'favorites' | 'archived' | 'all';

const filterOptions: Array<{ label: string; value: ProjectFilter }> = [
  { label: '진행 중', value: 'active' },
  { label: '즐겨찾기', value: 'favorites' },
  { label: '보관됨', value: 'archived' },
  { label: '전체', value: 'all' },
];

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
    return '프로젝트 저장 권한을 확인하지 못했습니다. Firestore 보안 규칙을 최신 상태로 적용해주세요.';
  }

  return error instanceof Error ? error.message : '프로젝트 작업을 완료하지 못했습니다.';
}

export function ProjectHubPage() {
  const auth = useAuth();
  const workspace = useWorkspaceSync();
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<PersonalProject | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<ProjectFilter>('active');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [projects, setProjects] = useState<PersonalProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userId = auth.user?.uid ?? null;

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    return subscribeUserProjects(
      userId,
      (nextProjects) => {
        setProjects(nextProjects);
        setErrorMessage('');
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(getErrorMessage(error));
        setIsLoading(false);
      },
    );
  }, [userId]);

  const workspaceChoices = useMemo(() => Object.keys(workspace.items)
    .filter(isProjectWorkspaceItem)
    .sort((firstKey, secondKey) => getWorkspaceItemLabel(firstKey).localeCompare(getWorkspaceItemLabel(secondKey), 'ko'))
    .map((key) => ({ key, label: getWorkspaceItemLabel(key) })), [workspace.items]);

  const projectStats = useMemo(() => ({
    active: projects.filter((project) => project.status === 'active').length,
    archived: projects.filter((project) => project.status === 'archived').length,
    favorites: projects.filter((project) => project.isFavorite && project.status === 'active').length,
  }), [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko');

    return projects.filter((project) => {
      const matchesFilter = filter === 'all'
        || (filter === 'favorites' ? project.status === 'active' && project.isFavorite : project.status === filter);

      if (!matchesFilter) return false;
      if (!normalizedQuery) return true;

      const linkedLabels = project.linkedStorageKeys.map(getWorkspaceItemLabel);
      return [project.name, project.description, ...project.tags, ...linkedLabels]
        .some((value) => value.toLocaleLowerCase('ko').includes(normalizedQuery));
    });
  }, [filter, projects, searchQuery]);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const logProjectActivity = (action: ActivityAction, summary: string, targetId: string) => {
    if (!auth.user) return;

    void recordActivity({
      displayName: auth.user.displayName,
      email: auth.user.email,
      role: auth.role,
      uid: auth.user.uid,
    }, {
      action,
      summary,
      targetId,
    }).catch((error) => console.warn('Failed to record project activity.', error));
  };

  const openCreateDialog = () => {
    clearMessages();
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: PersonalProject) => {
    clearMessages();
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (draft: ProjectDraft) => {
    if (!userId) return;

    setIsSaving(true);
    clearMessages();

    try {
      if (editingProject) {
        await updateUserProject(userId, editingProject.id, draft);
        logProjectActivity('project.updated', `'${draft.name}' 프로젝트를 수정했습니다.`, editingProject.id);
        setSuccessMessage('프로젝트 변경 내용을 저장했습니다.');
      } else {
        const projectId = await createUserProject(userId, draft);
        logProjectActivity('project.created', `'${draft.name}' 프로젝트를 만들었습니다.`, projectId);
        setSuccessMessage('새 프로젝트를 만들었습니다.');
      }

      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFavoriteToggle = async (project: PersonalProject) => {
    if (!userId) return;
    clearMessages();
    setBusyProjectId(project.id);

    try {
      await setUserProjectFavorite(userId, project.id, !project.isFavorite);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBusyProjectId(null);
    }
  };

  const handleDuplicate = async (project: PersonalProject) => {
    if (!userId) return;
    clearMessages();
    setBusyProjectId(project.id);

    try {
      const duplicateId = await duplicateUserProject(userId, project);
      logProjectActivity('project.duplicated', `'${project.name}' 프로젝트를 복제했습니다.`, duplicateId);
      setSuccessMessage('프로젝트 복사본을 만들었습니다.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBusyProjectId(null);
    }
  };

  const handleArchiveToggle = async (project: PersonalProject) => {
    if (!userId) return;
    const nextStatus = project.status === 'archived' ? 'active' : 'archived';
    clearMessages();
    setBusyProjectId(project.id);

    try {
      await setUserProjectStatus(userId, project.id, nextStatus);
      logProjectActivity(
        nextStatus === 'archived' ? 'project.archived' : 'project.restored',
        `'${project.name}' 프로젝트를 ${nextStatus === 'archived' ? '보관했습니다.' : '보관함에서 꺼냈습니다.'}`,
        project.id,
      );
      setSuccessMessage(nextStatus === 'archived' ? '프로젝트를 보관했습니다.' : '프로젝트를 다시 진행 중으로 옮겼습니다.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBusyProjectId(null);
    }
  };

  const handleDelete = async (project: PersonalProject) => {
    if (!userId || !window.confirm(`'${project.name}' 프로젝트를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;

    clearMessages();
    setBusyProjectId(project.id);

    try {
      await deleteUserProject(userId, project.id);
      logProjectActivity('project.deleted', `'${project.name}' 프로젝트를 삭제했습니다.`, project.id);
      setSuccessMessage('프로젝트를 삭제했습니다. 연결된 원본 작업 데이터는 유지됩니다.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBusyProjectId(null);
    }
  };

  return (
    <div className="container-page space-y-6">
      <section className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">Projects</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">프로젝트 허브</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              도구에서 저장한 작업을 프로젝트별로 묶고, 필요한 자료를 빠르게 찾아 이어서 관리합니다.
            </p>
          </div>
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="mr-2 inline h-4 w-4" />
            새 프로젝트
          </Button>
        </div>
      </section>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{errorMessage}</p>
      ) : null}
      {successMessage ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100">{successMessage}</p>
      ) : null}

      <section aria-label="프로젝트 현황" className="grid overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:grid-cols-3">
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:border-b-0 sm:border-r">
          <FolderKanban className="h-5 w-5 text-green-600" />
          <div><p className="text-xs text-gray-500 dark:text-gray-400">진행 중</p><p className="text-xl font-bold text-gray-950 dark:text-white">{projectStats.active}</p></div>
        </div>
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:border-b-0 sm:border-r">
          <Star className="h-5 w-5 text-amber-500" />
          <div><p className="text-xs text-gray-500 dark:text-gray-400">즐겨찾기</p><p className="text-xl font-bold text-gray-950 dark:text-white">{projectStats.favorites}</p></div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Archive className="h-5 w-5 text-gray-500" />
          <div><p className="text-xs text-gray-500 dark:text-gray-400">보관됨</p><p className="text-xl font-bold text-gray-950 dark:text-white">{projectStats.archived}</p></div>
        </div>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input aria-label="프로젝트 검색" className="pl-9" onChange={(event) => setSearchQuery(event.target.value)} placeholder="이름, 태그, 연결 자료 검색" value={searchQuery} />
        </div>
        <div aria-label="프로젝트 필터" className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800 sm:flex" role="group">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              aria-pressed={filter === option.value}
              className={`min-h-9 rounded-md px-3 text-sm font-semibold transition-colors ${filter === option.value ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white'}`}
              onClick={() => setFilter(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-gray-600 dark:text-gray-300">프로젝트를 불러오고 있습니다.</p>
      ) : filteredProjects.length === 0 ? (
        <section className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
          <FolderOpen className="h-10 w-10 text-gray-400" />
          <h2 className="mt-4 text-base font-bold text-gray-950 dark:text-white">
            {projects.length === 0 ? '첫 프로젝트를 만들어보세요' : '조건에 맞는 프로젝트가 없습니다'}
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-300">
            {projects.length === 0 ? '저장된 작업 자료를 프로젝트로 묶으면 원하는 작업을 더 빠르게 찾을 수 있습니다.' : '검색어를 바꾸거나 다른 필터를 선택해보세요.'}
          </p>
          {projects.length === 0 ? <Button type="button" className="mt-5" onClick={openCreateDialog}><Plus className="mr-2 inline h-4 w-4" />프로젝트 만들기</Button> : null}
        </section>
      ) : (
        <section aria-label="프로젝트 목록" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              disabled={busyProjectId === project.id}
              onArchiveToggle={(selectedProject) => void handleArchiveToggle(selectedProject)}
              onDelete={(selectedProject) => void handleDelete(selectedProject)}
              onDuplicate={(selectedProject) => void handleDuplicate(selectedProject)}
              onEdit={openEditDialog}
              onFavoriteToggle={(selectedProject) => void handleFavoriteToggle(selectedProject)}
              project={project}
            />
          ))}
        </section>
      )}

      <ProjectDialog
        isOpen={isDialogOpen}
        isSaving={isSaving}
        onClose={() => {
          if (!isSaving) {
            setIsDialogOpen(false);
            setEditingProject(null);
          }
        }}
        onSubmit={handleDialogSubmit}
        project={editingProject}
        workspaceChoices={workspaceChoices}
      />
    </div>
  );
}
