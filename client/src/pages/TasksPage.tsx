import BacklogList from '../components/BacklogList';
import PageHeader from '../components/PageHeader';

export default function TasksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Personal queue"
        title="My tasks"
        description="Review priorities, organize your workload, and keep every assignment moving."
      />
      <BacklogList />
    </>
  );
}
