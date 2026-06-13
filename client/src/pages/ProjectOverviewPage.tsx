import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { Button, Spinner } from '../components/ui';
import { getProjectById } from '../services/projectService';
import type { Project } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';

export default function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId)
      .then(setProject)
      .catch(() => navigate('/projects', { replace: true }))
      .finally(() => setLoading(false));
  }, [projectId, navigate]);

  if (loading) return <div className="empty-panel"><Spinner size="lg" /><p className="mt-4">Opening project...</p></div>;
  if (!project) return null;

  const currentMember = project.members?.find((member) => member.user.id === user.id);
  const isAdmin = currentMember?.role === 'ADMIN';

  return (
    <>
      <button type="button" className="back-link" onClick={() => navigate('/projects')}><Icon name="arrow-left" size={15} /> All projects</button>
      <PageHeader
        eyebrow={project.key}
        title={project.name}
        description={project.description || 'A shared workspace for planning, prioritizing, and delivering the next milestone.'}
        actions={isAdmin ? <Button variant="secondary" onClick={() => navigate(`/projects/${project.id}/settings`)}><Icon name="settings" size={16} /> Project settings</Button> : undefined}
      />
      <section className="stats-grid animate-enter-delay">
        <article className="app-card stat-card"><div className="stat-head"><span>Open tasks</span><span className="stat-icon"><Icon name="tasks" size={18} /></span></div><p className="stat-value">{project._count?.tasks ?? 0}</p><p className="stat-label">Ready to prioritize</p></article>
        <article className="app-card stat-card"><div className="stat-head"><span>Members</span><span className="stat-icon"><Icon name="team" size={18} /></span></div><p className="stat-value">{project.members?.length ?? 0}</p><p className="stat-label">Collaborating here</p></article>
        <article className="app-card stat-card"><div className="stat-head"><span>Active sprints</span><span className="stat-icon"><Icon name="activity" size={18} /></span></div><p className="stat-value">{project.sprints?.length ?? 0}</p><p className="stat-label">Current delivery cycles</p></article>
        <article className="app-card stat-card"><div className="stat-head"><span>Project key</span><span className="stat-icon"><Icon name="board" size={18} /></span></div><p className="stat-value text-xl">{project.key}</p><p className="stat-label">Task identifier prefix</p></article>
      </section>
      <div className="dashboard-grid animate-enter-delay">
        <section className="app-card card-padding">
          <div className="section-heading"><div><h2>Project board</h2><p>Your task workflow will live here.</p></div></div>
          <div className="empty-panel"><span className="empty-icon"><Icon name="board" size={25} /></span><h3>Ready for the first task</h3><p>The project is set up. Task creation and the board workflow can connect here when that backend module is ready.</p></div>
        </section>
        <aside className="app-card card-padding">
          <div className="section-heading"><div><h2>Team</h2><p>People with project access.</p></div></div>
          <div className="focus-list">
            {project.members?.slice(0, 5).map((member) => <div className="focus-item" key={member.id}><span className="avatar">{member.user.name.slice(0, 2).toUpperCase()}</span><span className="focus-copy"><strong>{member.user.name}</strong><span>{member.role.toLowerCase()}</span></span></div>)}
          </div>
        </aside>
      </div>
    </>
  );
}
