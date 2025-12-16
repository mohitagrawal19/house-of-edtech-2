import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.95) 100%)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(226, 232, 240, 0.5)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', transition: 'all 0.3s' }}>
                🏠 EdTech
              </div>
            </Link>
          </div>

          {/* Desktop Menu - Profile on Right */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            {user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500', color: '#374151', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(2, 132, 199, 0.1)'; e.currentTarget.style.color = '#0284c7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                  title="Click to open menu"
                >
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: '900', position: 'relative', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
                    {user.name.charAt(0).toUpperCase()}
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'capitalize' }}>{user.role}</span>
                  </div>
                  <svg style={{ width: '1rem', height: '1rem', transition: 'transform 0.3s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.75rem', width: '14rem', background: 'white', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', overflow: 'hidden', border: '1px solid #e5e7eb', zIndex: 1000 }}>
                    {/* User Info Header */}
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)', borderBottom: '1px solid #bfdbfe' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: '900' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', fontSize: '0.875rem' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                    >
                      <span style={{ fontSize: '1.125rem' }}>👤</span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', fontSize: '0.875rem', borderTop: '1px solid #e5e7eb' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                    >
                      <span style={{ fontSize: '1.125rem' }}>📊</span>
                      <span>Dashboard</span>
                    </Link>

                    {user.role === 'instructor' && (
                      <Link
                        href="/instructor"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', fontSize: '0.875rem', borderTop: '1px solid #e5e7eb' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                      >
                        <span style={{ fontSize: '1.125rem' }}>🎓</span>
                        <span>Instructor Panel</span>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={() => { setDropdownOpen(false); onLogout?.(); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', padding: '0.75rem 1rem', color: '#dc2626', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', border: 'none', borderTop: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '0.875rem' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#991b1b'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#dc2626'; }}
                    >
                      <span style={{ fontSize: '1.125rem' }}>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500', color: '#374151', padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #e5e7eb', background: 'white', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.borderColor = '#0284c7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  title="Click to login or register"
                >
                  <span style={{ fontSize: '1.25rem' }}>👤</span>
                  <span>Guest</span>
                  <svg style={{ width: '1rem', height: '1rem', transition: 'transform 0.3s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', width: '13rem', background: 'white', borderRadius: '10px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)', overflow: 'hidden', border: '1px solid #e5e7eb', zIndex: 1000 }}>
                    {/* Header */}
                    <div style={{ padding: '0.875rem 1rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderBottom: '1px solid #bfdbfe' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>👋 Welcome, Guest</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Sign in to your account</div>
                    </div>

                    {/* Login Option */}
                    <Link
                      href="/auth/login"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', fontSize: '0.875rem', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                    >
                      <span>🔑</span>
                      <span>Login to Account</span>
                    </Link>

                    {/* Register Option */}
                    <Link
                      href="/auth/register"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', fontSize: '0.875rem', borderTop: '1px solid #e5e7eb', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                    >
                      <span>✨</span>
                      <span>Create New Account</span>
                    </Link>

                    {/* View Courses Option */}
                    <Link
                      href="/courses"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s', backgroundColor: 'transparent', fontSize: '0.875rem', borderTop: '1px solid #e5e7eb', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#0284c7'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                    >
                      <span>📚</span>
                      <span>Browse Courses</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
