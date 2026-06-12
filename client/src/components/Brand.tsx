import Icon from './Icon';

export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <span className="brand-mark"><Icon name="sparkles" size={19} /></span>
      {!compact && <span className="brand-name">WorkWise</span>}
    </div>
  );
}
