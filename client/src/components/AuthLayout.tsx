import type { ReactNode } from 'react';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="WorkWise introduction">
        <div className="auth-ambient" aria-hidden="true">
          <span className="auth-orb auth-orb-one" />
          <span className="auth-orb auth-orb-two" />
          <span className="auth-orbit auth-orbit-one" />
          <span className="auth-orbit auth-orbit-two" />
          <span className="auth-orbit auth-orbit-three" />
          <span className="auth-spark auth-spark-one" />
          <span className="auth-spark auth-spark-two" />
          <span className="auth-spark auth-spark-three" />
          <span className="auth-spark auth-spark-four" />
          <span className="auth-spark auth-spark-five" />
          <span className="auth-spark auth-spark-six" />
        </div>
        <Brand />
        <div className="auth-copy animate-enter">
          <h2>Make every project feel <span>effortless.</span></h2>
          <p>Plan, prioritize, and move work forward with one calm workspace built for focused teams.</p>
        </div>
        <div className="auth-proof">
          <div className="proof-avatars" aria-hidden="true">
            <span className="proof-avatar">TY</span>
            <span className="proof-avatar">YF</span>
            <span className="proof-avatar">AI</span>
          </div>
          Built for teams that value momentum and clarity.
        </div>
        <svg className="auth-wave" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true">
          <path className="auth-wave-haze" d="M120 0H76C100 112 54 194 62 304C71 424 108 500 77 616C50 716 94 834 66 1000H120Z" />
          <path className="auth-wave-fill" d="M120 0H91C112 112 65 194 73 304C82 424 117 500 87 616C60 716 104 834 78 1000H120Z" />
        </svg>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-glow" aria-hidden="true" />
        <div className="auth-panel-controls"><ThemeToggle /></div>
        <div className="auth-card animate-enter-delay">
          <div className="auth-mobile-brand"><Brand /></div>
          {children}
        </div>
      </section>
    </main>
  );
}
