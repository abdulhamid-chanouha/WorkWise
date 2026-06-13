import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { Button, Spinner } from '../components/ui';
import { getUserProjects, getUserInvitations, acceptInvitation, declineInvitation } from '../services/projectService';
import type { Project, Invitation } from '../services/projectService';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getUserProjects(), getUserInvitations()])
      .then(([projectData, invitationData]) => {
        setProjects(Array.isArray(projectData) ? projectData : []);
        setInvitations(Array.isArray(invitationData) ? invitationData : []);
      })
      .catch(() => setError('We could not load your projects. Check the connection and try again.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAccept(invitationId: string) {
    await acceptInvitation(invitationId);
    setInvitations((current) => current.filter((invitation) => invitation.id !== invitationId));
    const updated = await getUserProjects();
    setProjects(Array.isArray(updated) ? updated : []);
  }

  async function handleDecline(invitationId: string) {
    await declineInvitation(invitationId);
    setInvitations((current) => current.filter((invitation) => invitation.id !== invitationId));
  }

  if (loading) return <div className="empty-panel"><Spinner size="lg" /><p className="mt-4">Loading your workspace...</p></div>;

  return (
    <>
      <PageHeader eyebrow="Project portfolio" title="Projects" description="Organize goals, tasks, and people into focused spaces that are easy to navigate." actions={<Button onClick={() => navigate('/projects/create')}><Icon name="plus" size={16} /> New project</Button>} />

      {error && <div className="alert alert-error mb-5">{error} <button className="text-link ml-2" onClick={() => window.location.reload()}>Retry</button></div>}

      {invitations.length > 0 && (
        <section className="invitation-stack animate-enter-delay" aria-label="Pending invitations">
          {invitations.map((invitation) => (
            <article className="invitation-card" key={invitation.id}>
              <div><strong>You&apos;re invited to {invitation.project?.name}</strong><p>{invitation.sender?.name} invited you as {invitation.role.toLowerCase()}.</p></div>
              <div className="flex gap-2"><Button onClick={() => handleAccept(invitation.id)}>Accept</Button><Button variant="secondary" onClick={() => handleDecline(invitation.id)}>Decline</Button></div>
            </article>
          ))}
        </section>
      )}

      {!error && projects.length === 0 ? (
        <div className="app-card empty-panel animate-enter-delay">
          <span className="empty-icon"><Icon name="folder" size={26} /></span>
          <h3>No projects yet</h3>
          <p>Create your first project and give your team one clear place to plan and deliver work.</p>
          <Button onClick={() => navigate('/projects/create')}><Icon name="plus" size={16} /> Create project</Button>
        </div>
      ) : (
        <section className="project-grid animate-enter-delay">
          {projects.map((project) => (
            <article className="app-card project-card" key={project.id} onClick={() => navigate(`/projects/${project.id}`)} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/projects/${project.id}`); }} tabIndex={0} role="link">
              <div className="project-card-top"><span className="project-key">{project.key}</span><span className="project-members">{project.members?.length ?? 0} member{(project.members?.length ?? 0) === 1 ? '' : 's'}</span></div>
              <h3>{project.name}</h3>
              <p>{project.description || 'A focused workspace ready for your team and its next milestone.'}</p>
              <div className="project-meta"><span><Icon name="tasks" size={14} /> {project._count?.tasks ?? 0} tasks</span><span><Icon name="activity" size={14} /> {project.sprints?.[0]?.name || 'No active sprint'}</span></div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
