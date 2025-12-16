import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - House of EdTech</title>
      </Head>

      <Navbar user={user} onLogout={logout} />

      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '24rem' }}>
              <div style={{ width: '3rem', height: '3rem', border: '4px solid #e5e7eb', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1f2937' }}>
                  Welcome, {user?.name}!
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                  Manage your learning journey
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Enrolled Courses Card */}
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.875rem', fontWeight: '900', color: '#0284c7', marginBottom: '0.5rem' }}>
                    {profile?.enrolledCourses?.length || 0}
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Enrolled Courses</p>
                  <Link href="/my-courses">
                    <Button variant="outline">
                      View Courses
                    </Button>
                  </Link>
                </div>

                {/* Created Courses Card (Instructors) */}
                {user?.role === 'instructor' && (
                  <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.5rem' }}>
                    <div style={{ fontSize: '1.875rem', fontWeight: '900', color: '#0284c7', marginBottom: '0.5rem' }}>
                      {profile?.createdCourses?.length || 0}
                    </div>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Created Courses</p>
                    <Link href="/instructor">
                      <Button variant="outline">
                        Manage Courses
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Profile Card */}
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>
                    {user?.email}
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem', textTransform: 'capitalize' }}>
                    {user?.role} Account
                  </p>
                  <Link href="/profile">
                    <Button variant="outline">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: '#1f2937' }}>
                  Recent Activity
                </h2>

                {profile?.enrolledCourses && profile.enrolledCourses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {profile.enrolledCourses.slice(0, 5).map((course: any) => (
                      <div
                        key={course._id}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', transition: 'all 0.3s', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                      >
                        <div>
                          <h3 style={{ fontWeight: '600', color: '#1f2937' }}>
                            {course.title}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {course.category}
                          </p>
                        </div>
                        <Link href={`/courses/${course._id}`}>
                          <Button variant="outline" size="sm">
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', padding: '2rem 0', textAlign: 'center' }}>
                    You haven&apos;t enrolled in any courses yet.{' '}
                    <Link
                      href="/courses"
                      style={{ color: '#0284c7', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Browse courses
                    </Link>
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                  Quick Actions
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <Link href="/courses">
                    <Button variant="primary" style={{ width: '100%' }}>
                      Browse More Courses
                    </Button>
                  </Link>

                  {user?.role === 'instructor' && (
                    <Link href="/instructor">
                      <Button variant="primary" style={{ width: '100%' }}>
                        Create New Course
                      </Button>
                    </Link>
                  )}

                  <Link href="/profile">
                    <Button variant="outline" style={{ width: '100%' }}>
                      Update Profile
                    </Button>
                  </Link>

                  {user?.role !== 'instructor' && (
                    <Button variant="outline" style={{ width: '100%' }}>
                      Become an Instructor
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
