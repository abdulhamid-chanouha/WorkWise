import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

export default function TasksPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader eyebrow="Personal queue" title="My tasks" description="A focused view of work assigned to you across every project." />
      <div className="app-card empty-panel animate-enter-delay">
        <span className="empty-icon"><Icon name="tasks" size={26} /></span>
        <h3>No assigned tasks yet</h3>
        <p>Once tasks are assigned to you, they will appear here with priority and due date context.</p>
        <Button variant="secondary" onClick={() => navigate('/projects')}>Browse projects <Icon name="arrow-right" size={16} /></Button>
      </div>
    </>
  );
}
