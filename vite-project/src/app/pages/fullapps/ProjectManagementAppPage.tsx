import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { getProjectDisplayText } from '@/app/features/project-management/copy';
import { ProjectControls } from '@/app/features/project-management/ProjectControls';
import { ProjectWorkspace } from '@/app/features/project-management/ProjectWorkspace';
import { TaskQueue } from '@/app/features/project-management/TaskQueue';
import { useProjectManagementController } from '@/app/features/project-management/useProjectManagementController';

export function ProjectManagementAppPage() {
  const {
    addProject,
    addTask,
    cycleSelectedProjectStatus,
    cycleTaskStatus,
    deleteSelectedProject,
    deleteTask,
    exportWorkspace,
    language,
    metrics,
    newProjectDeadline,
    newProjectName,
    newProjectTeam,
    newTaskAssignee,
    newTaskPriority,
    newTaskTitle,
    projectText,
    projects,
    resetWorkspace,
    selectProject,
    selectedProject,
    selectedProjectId,
    selectedProjectTasks,
    setNewProjectDeadline,
    setNewProjectName,
    setNewProjectTeam,
    setNewTaskAssignee,
    setNewTaskPriority,
    setNewTaskTitle,
    setTaskFilter,
    statusMessage,
    taskCountsByProject,
    taskFilter,
    updateSelectedProject,
    visibleTasks,
  } = useProjectManagementController();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight={projectText.pageHighlight}
        title={projectText.pageTitle}
        description={projectText.pageDescription}
      />

      <MetricGrid items={metrics} columnsClassName="grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4" />

      <section className="grid min-w-0 gap-6">
        <ProjectWorkspace
          language={language}
          projects={projects}
          selectedProjectId={selectedProjectId}
          taskCountsByProject={taskCountsByProject}
          text={projectText}
          onSelectProject={selectProject}
        />

        <ProjectControls
          language={language}
          newProjectDeadline={newProjectDeadline}
          newProjectName={newProjectName}
          newProjectTeam={newProjectTeam}
          newTaskAssignee={newTaskAssignee}
          newTaskPriority={newTaskPriority}
          newTaskTitle={newTaskTitle}
          projectTasks={selectedProjectTasks}
          selectedProject={selectedProject}
          statusMessage={statusMessage}
          text={projectText}
          onAddProject={addProject}
          onAddTask={addTask}
          onCycleProject={cycleSelectedProjectStatus}
          onDeleteProject={deleteSelectedProject}
          onExportWorkspace={exportWorkspace}
          onNewProjectDeadlineChange={setNewProjectDeadline}
          onNewProjectNameChange={setNewProjectName}
          onNewProjectTeamChange={setNewProjectTeam}
          onNewTaskAssigneeChange={setNewTaskAssignee}
          onNewTaskPriorityChange={setNewTaskPriority}
          onNewTaskTitleChange={setNewTaskTitle}
          onProgressChange={(progress) => updateSelectedProject({ progress })}
          onResetWorkspace={resetWorkspace}
        />
      </section>

      <TaskQueue
        filter={taskFilter}
        items={visibleTasks}
        language={language}
        projectName={getProjectDisplayText(language, selectedProject.name)}
        text={projectText}
        totalCount={selectedProjectTasks.length}
        onCycleTask={cycleTaskStatus}
        onDeleteTask={deleteTask}
        onFilterChange={setTaskFilter}
      />
    </div>
  );
}
