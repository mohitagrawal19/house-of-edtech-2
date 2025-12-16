import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>House of EdTech - Learn Anywhere, Anytime</title>
        <meta
          name="description"
          content="A modern educational technology platform for learning and teaching"
        />
      </Head>

      <Navbar user={user} onLogout={logout} />

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            {/* Left Content */}
            <div>
              <div style={{ marginBottom: '1.5rem', display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>
                ✨ Welcome to Learning
              </div>
              
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                Learn from <span style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Expert Instructors</span>
              </h1>
              
              <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6' }}>
                Discover world-class courses and transform your skills today.
              </p>

              {!user && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <Button variant="primary" size="lg" onClick={() => router.push('/auth/register')}>
                    🚀 Get Started
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => router.push('/courses')}>
                    📚 Explore
                  </Button>
                </div>
              )}

              {user && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <Button variant="primary" size="lg" onClick={() => router.push('/courses')}>
                    📚 Browse Courses
                  </Button>
                  {user.role === 'instructor' && (
                    <Button variant="outline" size="lg" onClick={() => router.push('/instructor')}>
                      ➕ Create
                    </Button>
                  )}
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0284c7' }}>10K+</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Students</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0284c7' }}>500+</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Courses</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0284c7' }}>4.9★</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Rated</div>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#dbeafe', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.9rem' }}>Expert Courses</div>
              </div>
              <div style={{ background: '#fed7aa', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.9rem' }}>Fast Learning</div>
              </div>
              <div style={{ background: '#ddd6fe', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.9rem' }}>Certificates</div>
              </div>
              <div style={{ background: '#dcfce7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.9rem' }}>Career Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: '#f9fafb', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>
              Why Choose House of EdTech?
            </h2>
            <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Join thousands of successful learners
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {/* Feature 1 */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', border: '1px solid #e5e7eb', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍🏫</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.75rem' }}>Expert Instructors</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem' }}>Learn from industry professionals with years of experience.</p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', border: '1px solid #e5e7eb', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.75rem' }}>Structured Learning</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem' }}>Comprehensive courses with modules and real projects.</p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', border: '1px solid #e5e7eb', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏅</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.75rem' }}>Verified Certificates</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '0.95rem' }}>Earn recognized certificates upon completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', padding: '3rem 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900' }}>500+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Courses</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900' }}>50K+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Learners</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900' }}>200+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Instructors</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900' }}>98%</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Satisfied</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'white', padding: '60px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1f2937', marginBottom: '1rem' }}>
            Ready to Start Learning?
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
            Join thousands of learners transforming their careers.
          </p>

          {!user && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" onClick={() => router.push('/auth/register')}>
                Start Now
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('/courses')}>
                Browse Courses
              </Button>
            </div>
          )}

          {user && (
            <Button variant="primary" size="lg" onClick={() => router.push('/courses')}>
              Continue Learning
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: '#f3f4f6', padding: '3rem 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '1rem' }}>🏠 EdTech</h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '0.9rem' }}>Empowering learners worldwide.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="/courses" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Courses</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Instructors</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Help</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
          <p>&copy; 2024 House of EdTech. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
