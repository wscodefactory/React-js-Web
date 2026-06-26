import type { AppLanguage } from '../../context/LanguageContext';
import type { ProjectManagementCopy, ProjectStatus, TaskFilter, TaskPriority, TaskStatus } from './types';

export const projectManagementCopy: ProjectManagementCopy = {
  en: {
    activeProjects: 'Active Projects',
    addProject: 'Add Project',
    addProjectTitle: 'Create project',
    addTask: 'Add Task',
    addTaskTitle: 'Add task to selected project',
    assignee: 'Assignee',
    assigneePlaceholder: 'Assignee',
    controlsDescription: 'Update the selected project without leaving the dashboard.',
    controlsTitle: 'Project Controls',
    deadline: 'Deadline',
    delete: 'Delete',
    exportWorkspace: 'Export Workspace',
    metrics: {
      activeProjects: 'Active Projects',
      averageProgress: 'Avg. Progress',
      openTasks: 'Open Tasks',
      teamMembers: 'Team Members',
    },
    messages: {
      createProjectFirst: 'Add a project name before creating a project.',
      createTaskFirst: 'Add a task title and assignee before creating a task.',
      keepOneProject: 'Keep at least one project in the workspace.',
      projectCreated: (name: string) => `${name} created and selected.`,
      projectRemoved: (name: string) => `${name} and its tasks were removed.`,
      projectReset: 'Project workspace reset to the starter data.',
      projectStatusMoved: (name: string, status: string) => `${name} moved to ${status}.`,
      ready: 'Select a project to edit progress and task flow.',
      restored: 'Project workspace restored from local storage.',
      taskAdded: (title: string, projectName: string) => `${title} was added to ${projectName}.`,
      taskRemoved: (title: string) => `${title} removed from the queue.`,
      taskRemovedFallback: 'Task removed.',
      taskUpdated: 'Task status updated.',
      workspaceReady: 'Project workspace is ready to download.',
    },
    moveStatus: 'Move Status',
    noTasks: 'No tasks match this filter.',
    pageDescription: 'Manage projects, track progress, and collaborate with your team',
    pageHighlight: 'Project Management',
    pageTitle: 'App',
    priority: 'Priority',
    progress: 'Progress',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Project name',
    resetWorkspace: 'Reset Workspace',
    selected: 'Selected',
    statusAdvance: 'Advance Status',
    taskCompletion: (progress: number, count: number) => `Task completion: ${progress}% across ${count} tasks`,
    taskCount: (count: number) => `${count} tasks`,
    taskQueueDescription: (projectName: string, count: number) => `${projectName} has ${count} tasks. Click a task action to move it through pending, in-progress, and completed.`,
    taskQueueTitle: 'Task Queue',
    taskTitle: 'Task Title',
    taskTitlePlaceholder: 'Task title',
    team: 'Team',
    teamMembers: (count: number) => `${count} members`,
  },
  ko: {
    activeProjects: '진행 중인 프로젝트',
    addProject: '프로젝트 추가',
    addProjectTitle: '프로젝트 만들기',
    addTask: '작업 추가',
    addTaskTitle: '선택한 프로젝트에 작업 추가',
    assignee: '담당자',
    assigneePlaceholder: '담당자',
    controlsDescription: '대시보드를 벗어나지 않고 선택한 프로젝트를 업데이트합니다.',
    controlsTitle: '프로젝트 제어',
    deadline: '마감일',
    delete: '삭제',
    exportWorkspace: '작업 공간 내보내기',
    metrics: {
      activeProjects: '활성 프로젝트',
      averageProgress: '평균 진행률',
      openTasks: '열린 작업',
      teamMembers: '팀원',
    },
    messages: {
      createProjectFirst: '프로젝트를 만들려면 프로젝트 이름을 입력하세요.',
      createTaskFirst: '작업을 만들려면 작업 제목과 담당자를 입력하세요.',
      keepOneProject: '작업 공간에는 프로젝트가 하나 이상 있어야 합니다.',
      projectCreated: (name: string) => `${name} 프로젝트를 만들고 선택했습니다.`,
      projectRemoved: (name: string) => `${name} 프로젝트와 연결된 작업을 삭제했습니다.`,
      projectReset: '프로젝트 작업 공간을 시작 데이터로 초기화했습니다.',
      projectStatusMoved: (name: string, status: string) => `${name} 상태를 ${status}(으)로 변경했습니다.`,
      ready: '프로젝트를 선택해 진행률과 작업 흐름을 편집하세요.',
      restored: '로컬 저장소에서 프로젝트 작업 공간을 복원했습니다.',
      taskAdded: (title: string, projectName: string) => `${title} 작업을 ${projectName}에 추가했습니다.`,
      taskRemoved: (title: string) => `${title} 작업을 대기열에서 삭제했습니다.`,
      taskRemovedFallback: '작업을 삭제했습니다.',
      taskUpdated: '작업 상태를 업데이트했습니다.',
      workspaceReady: '프로젝트 작업 공간을 다운로드할 수 있습니다.',
    },
    moveStatus: '상태 이동',
    noTasks: '이 필터에 맞는 작업이 없습니다.',
    pageDescription: '프로젝트, 진행률, 작업, 팀 현황을 한곳에서 관리하세요.',
    pageHighlight: '프로젝트 관리',
    pageTitle: '앱',
    priority: '우선순위',
    progress: '진행률',
    projectName: '프로젝트 이름',
    projectNamePlaceholder: '프로젝트 이름',
    resetWorkspace: '작업 공간 초기화',
    selected: '선택됨',
    statusAdvance: '상태 진행',
    taskCompletion: (progress: number, count: number) => `작업 완료율: ${count}개 중 ${progress}%`,
    taskCount: (count: number) => `${count}개 작업`,
    taskQueueDescription: (projectName: string, count: number) => `${projectName}에는 작업 ${count}개가 있습니다. 작업 액션을 눌러 대기, 진행 중, 완료 상태로 이동하세요.`,
    taskQueueTitle: '작업 대기열',
    taskTitle: '작업 제목',
    taskTitlePlaceholder: '작업 제목',
    team: '팀',
    teamMembers: (count: number) => `${count}명`,
  },
};

export const projectStatusLabels: Record<AppLanguage, Record<ProjectStatus, string>> = {
  en: {
    Completed: 'Completed',
    'In Progress': 'In Progress',
    Planning: 'Planning',
  },
  ko: {
    Completed: '완료',
    'In Progress': '진행 중',
    Planning: '계획',
  },
};

export const taskStatusLabels: Record<AppLanguage, Record<TaskStatus, string>> = {
  en: {
    completed: 'completed',
    'in-progress': 'in progress',
    pending: 'pending',
  },
  ko: {
    completed: '완료',
    'in-progress': '진행 중',
    pending: '대기',
  },
};

export const taskPriorityLabels: Record<AppLanguage, Record<TaskPriority, string>> = {
  en: {
    High: 'High',
    Low: 'Low',
    Medium: 'Medium',
  },
  ko: {
    High: '높음',
    Low: '낮음',
    Medium: '보통',
  },
};

export const taskFilterLabels: Record<AppLanguage, Record<TaskFilter, string>> = {
  en: {
    all: 'All',
    completed: 'Completed',
    'in-progress': 'In progress',
    pending: 'Pending',
  },
  ko: {
    all: '전체',
    completed: '완료',
    'in-progress': '진행 중',
    pending: '대기',
  },
};

const projectSampleDisplayCopy: Record<string, string> = {
  Alice: '이지아',
  Bob: '김도윤',
  Charlie: '박준호',
  'Customer Portal': '고객 포털',
  David: '최민재',
  'Design homepage mockup': '홈페이지 목업 디자인',
  'Implement authentication': '인증 구현',
  Marketing: '마케팅',
  'Marketing Campaign': '마케팅 캠페인',
  Mina: '미나',
  'Mobile App Development': '모바일 앱 개발',
  'Prepare stakeholder update': '이해관계자 업데이트 준비',
  'Setup CI/CD pipeline': 'CI/CD 파이프라인 설정',
  'Website Redesign': '웹사이트 리디자인',
  'Write documentation': '문서 작성',
};

export function getProjectDisplayText(language: AppLanguage, value: string) {
  return language === 'ko' ? projectSampleDisplayCopy[value] ?? value : value;
}
