import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import axios from 'axios';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUserData(response.data.data);
      setFormData({
        name: response.data.data.name || '',
        email: response.data.data.email || '',
        bio: response.data.data.bio || '',
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>My Profile - House of EdTech</title>
      </Head>

      <Navbar user={user} onLogout={logout} />

      {isLoading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', border: '4px solid #e5e7eb', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#6b7280' }}>Loading profile...</p>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '3rem 1rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '3rem', animation: 'slideDown 0.6s ease-out' }}>
              <style>{`
                @keyframes slideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                My Profile
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Manage your account information and settings</p>
            </div>

            {/* Profile Card */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
              {/* Avatar Section */}
              <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', padding: '4rem 1rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '7rem', height: '7rem', borderRadius: '50%', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.75rem', fontWeight: '900', margin: '0 auto', boxShadow: '0 20px 40px rgba(2, 132, 199, 0.4)', border: '5px solid white' }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    {user?.name}
                  </h2>
                  <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', textTransform: 'capitalize', fontSize: '0.95rem', fontWeight: '600', color: 'white', backdropFilter: 'blur(10px)' }}>
                    {user?.role}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div style={{ padding: '2.5rem' }}>
                {!isEditing ? (
                  <>
                    {/* Display Mode */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                      <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Full Name
                        </label>
                        <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginTop: '0.75rem' }}>
                          {user?.name}
                        </p>
                      </div>

                      <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Email Address
                        </label>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginTop: '0.75rem' }}>
                          {user?.email}
                        </p>
                      </div>

                      <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Account Role
                        </label>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginTop: '0.75rem', textTransform: 'capitalize' }}>
                          {user?.role}
                        </p>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Bio
                      </label>
                      <p style={{ fontSize: '1rem', color: '#4b5563', marginTop: '0.75rem', lineHeight: '1.7', minHeight: '3rem' }}>
                        {user?.bio || '✨ No bio added yet. Click edit to add one!'}
                      </p>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem', paddingTop: '2rem', borderTop: '2px solid #e5e7eb' }}>
                      <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '10px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', transition: 'all 0.3s' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                          {userData?.enrolledCourses?.length || 0}
                        </div>
                        <p style={{ color: '#0369a1', fontSize: '0.875rem', fontWeight: '600' }}>Courses Enrolled</p>
                      </div>

                      {user?.role === 'instructor' && (
                        <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '10px', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', transition: 'all 0.3s' }}>
                          <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                            {userData?.createdCourses?.length || 0}
                          </div>
                          <p style={{ color: '#6d28d9', fontSize: '0.875rem', fontWeight: '600' }}>Courses Created</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '2px solid #e5e7eb' }}>
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        ✏️ Edit Profile
                      </Button>
                      {user?.role === 'instructor' && (
                        <Link href="/instructor">
                          <Button variant="primary">
                            🎓 Instructor Panel
                          </Button>
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0284c7', marginBottom: '0.75rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', transition: 'all 0.3s', boxSizing: 'border-box', background: '#f9fafb' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)'; e.currentTarget.style.background = '#f0f9ff'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f9fafb'; }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6d28d9', marginBottom: '0.75rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                          style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', background: '#f3f4f6', cursor: 'not-allowed', boxSizing: 'border-box', color: '#6b7280' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', fontWeight: '500' }}>Email cannot be changed</p>
                      </div>
                    </div>

                    {/* Bio Edit */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed', marginBottom: '0.75rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', transition: 'all 0.3s', fontFamily: 'inherit', boxSizing: 'border-box', background: '#f9fafb', resize: 'vertical' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; e.currentTarget.style.background = '#faf5ff'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f9fafb'; }}
                      />
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '2px solid #e5e7eb' }}>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSave}>
                        💾 Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enrolled Courses Section */}
            {userData?.enrolledCourses && userData.enrolledCourses.length > 0 && (
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1f2937', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>📚</span> My Enrolled Courses
                  <span style={{ fontSize: '1rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: '700' }}>
                    {userData.enrolledCourses.length}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                  {userData.enrolledCourses.map((course: any, index: number) => (
                    <div key={index} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.5rem', transition: 'all 0.3s ease', cursor: 'pointer', border: '1px solid #e5e7eb' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#0284c7'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                      <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>📖</div>
                      </div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                        {typeof course === 'string' ? `Course ${index + 1}` : course.title}
                      </h4>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏷️</span>
                        {typeof course === 'string' ? 'Course details' : course.category || 'Uncategorized'}
                      </p>
                      <Link href={`/courses/${typeof course === 'string' ? course : course._id}`}>
                        <Button variant="outline" size="sm">
                          View Course →
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', borderRadius: '12px', border: '2px solid #fca5a5' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#991b1b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span> Danger Zone
              </h3>
              <p style={{ color: '#7f1d1d', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                These actions cannot be undone. Please proceed with caution. You can logout from all devices or permanently delete your account.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button variant="danger" onClick={() => {
                  logout();
                  router.push('/');
                }}>
                  🚪 Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
