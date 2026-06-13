import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { Input, Button, Card, Spinner } from '../components/ui';
import { getMyProfile, updateMyProfile } from '../services/userService';
import type { UserProfile } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface FormState { name: string; avatarUrl: string; }

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', avatarUrl: '' });
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name, avatarUrl: data.avatarUrl ?? '' });
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [toast]);

  async function handleSave() {
    if (!form.name.trim()) {
      setNameError('Name is required');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateMyProfile({ name: form.name.trim(), avatarUrl: form.avatarUrl.trim() || undefined });
      setProfile((current) => current ? { ...current, ...updated } : current);
      updateUser(updated);
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (profile) setForm({ name: profile.name, avatarUrl: profile.avatarUrl ?? '' });
    setNameError('');
    setEditing(false);
  }

  if (loading) return <div className="empty-panel"><Spinner size="lg" /><p className="mt-4">Loading your profile...</p></div>;
  if (!profile) return <div className="app-card empty-panel"><h3>Profile unavailable</h3><p>We could not load your account details right now.</p></div>;

  return (
    <>
      <PageHeader eyebrow="Personal settings" title="My profile" description="Manage how you appear to teammates across WorkWise." />
      <div className="form-layout animate-enter-delay">
        <section className="app-card profile-hero">
          <div className="profile-identity">
            <div className="profile-avatar">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} /> : getInitials(profile.name)}
            </div>
            <div><h2>{profile.name}</h2><p>{profile.email}</p></div>
          </div>
          <div className="profile-stats">
            <div className="profile-stat"><strong>{profile._count.projectMembers}</strong><span>Projects</span></div>
            <div className="profile-stat"><strong>{user.initials}</strong><span>Initials</span></div>
          </div>

          <div className="auth-note mt-0">
            <Icon name="sparkles" size={17} />
            <span className="focus-copy"><strong>Getting started guide</strong><span>Revisit task creation, invitations, and sprint setup anytime.</span></span>
            <Button variant="secondary" onClick={() => navigate('/profile?onboarding=true')}>Open guide</Button>
          </div>

          {editing ? (
            <div className="form-stack">
              <Input label="Full name" value={form.name} onChange={(event) => { setForm((current) => ({ ...current, name: event.target.value })); setNameError(''); }} error={nameError} autoFocus />
              <Input label="Avatar URL" type="url" placeholder="https://example.com/avatar.jpg" value={form.avatarUrl} onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))} helperText="Optional. Paste a direct link to your profile picture." />
              <div className="flex gap-2"><Button loading={saving} onClick={handleSave}>Save changes</Button><Button variant="secondary" onClick={handleCancel} disabled={saving}>Cancel</Button></div>
            </div>
          ) : (
            <div className="flex justify-end"><Button variant="secondary" onClick={() => setEditing(true)}><Icon name="user" size={16} /> Edit profile</Button></div>
          )}
        </section>

        <Card title="Account details" className="tip-card">
          <div className="form-stack">
            <div><p className="field-help">Full name</p><strong className="text-sm">{profile.name}</strong></div>
            <div><p className="field-help">Email address</p><strong className="text-sm break-all">{profile.email}</strong></div>
            <div>
              <p className="field-help mb-2">Project roles</p>
              {profile.projectMembers.length > 0 ? (
                <div className="focus-list">
                  {profile.projectMembers.map((membership) => (
                    <div className="focus-item" key={membership.project.id}>
                      <span className="project-key">{membership.project.key}</span>
                      <span className="focus-copy">
                        <strong>{membership.project.name}</strong>
                        <span>{membership.role.toLowerCase()}</span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : <p className="field-help">No project roles yet.</p>}
            </div>
            <div className="auth-note mt-0"><Icon name="check" size={17} /> Your email is used for sign-in and project invitations.</div>
          </div>
        </Card>
      </div>
    </>
  );
}
