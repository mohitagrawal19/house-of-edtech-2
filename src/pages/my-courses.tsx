import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import axios from 'axios';

export default function MyCourses() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get('/api/users/me');
      if (response.data.data.enrolledCourses) {
        setCourses(response.data.data.enrolledCourses);
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.enrolledAt || 0).getTime() - new Date(a.enrolledAt || 0).getTime();
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];

  return (
    <ProtectedRoute>
      <Head>
        <title>My Courses - House of EdTech</title>
      </Head>

      <Navbar user={user} onLogout={logout} />

      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.875rem' }}>
              ← Back to Dashboard
            </Link>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>
              📚 My Courses
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              You have enrolled in {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '24rem' }}>
              <div style={{ width: '3rem', height: '3rem', border: '4px solid #e5e7eb', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : courses.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '3rem 1.5rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                No Courses Yet
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                You haven&apos;t enrolled in any courses yet. Start learning today!
              </p>
              <Link href="/courses">
                <Button variant="primary">
                  Explore Courses
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {/* Search */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Search Courses
                    </label>
                    <input
                      type="text"
                      placeholder="Search by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Category
                      </label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}
                      >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sort */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}
                    >
                      <option value="recent">Recently Enrolled</option>
                      <option value="title">Course Title</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              {filteredCourses.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
                  <p style={{ color: '#6b7280' }}>No courses match your search or filters.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {filteredCourses.map((course) => (
                    <div
                      key={course._id}
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = '#0284c7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {/* Course Header Image */}
                      <div style={{
                        height: '12rem',
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ fontSize: '3rem' }}>📚</div>
                        )}
                        {/* Progress Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#0284c7',
                        }}>
                          {course.progress || 0}% Complete
                        </div>
                      </div>

                      {/* Course Content */}
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                            {course.title}
                          </h3>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {course.description}
                          </p>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                          {course.category && (
                            <span style={{ fontSize: '0.75rem', fontWeight: '500', background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                              {course.category}
                            </span>
                          )}
                          {course.level && (
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              background: course.level === 'beginner' ? '#dcfce7' : course.level === 'intermediate' ? '#fef3c7' : '#fee2e2',
                              color: course.level === 'beginner' ? '#166534' : course.level === 'intermediate' ? '#854d0e' : '#991b1b',
                            }}>
                              {course.level}
                            </span>
                          )}
                        </div>

                        {/* Instructor */}
                        {course.instructor && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            <div style={{
                              width: '1.75rem',
                              height: '1.75rem',
                              borderRadius: '50%',
                              background: '#e0f2fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}>
                              {course.instructor.avatar ? (
                                <img
                                  src={course.instructor.avatar}
                                  alt={course.instructor.name}
                                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                              ) : (
                                course.instructor.name?.charAt(0)
                              )}
                            </div>
                            <span>{course.instructor.name || 'Unknown Instructor'}</span>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '0.5rem',
                            background: '#e5e7eb',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                          }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${course.progress || 0}%`,
                                background: 'linear-gradient(90deg, #0284c7, #0369a1)',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>

                        {/* Rating */}
                        {course.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  style={{ color: i < Math.floor(course.rating) ? '#facc15' : '#d1d5db', fontSize: '1rem' }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span style={{ color: '#6b7280' }}>({course.reviews || 0})</span>
                          </div>
                        )}

                        {/* Button */}
                        <Link href={`/courses/${course._id}`} style={{ marginTop: 'auto' }}>
                          <Button variant="primary" size="sm" style={{ width: '100%' }}>
                            Continue Learning →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </ProtectedRoute>
  );
}
