import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { CourseGrid } from '@/components/CourseCard';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { Button } from '@/components/Button';

export default function Courses() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, [filters.category, filters.level, filters.search, pagination.page]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.level && { level: filters.level }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`/api/courses?${params}`);
      setCourses(response.data.data.courses);
      setPagination(response.data.data.pagination);
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await axios.post(`/api/courses/${courseId}?action=enroll`);
      // Refresh courses to show enrollment status
      fetchCourses();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to enroll';
      alert(message);
    }
  };

  const courseCards = courses.map((course) => ({
    id: course._id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    price: course.price,
    instructor: course.instructor,
    rating: course.rating,
    reviews: course.reviews,
    isEnrolled: user ? course.students?.includes(user.id) : false,
  }));

  return (
    <>
      <Head>
        <title>Courses - House of EdTech</title>
      </Head>

      <Navbar user={user} onLogout={logout} />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            <h1 style={{ fontSize: '2.75rem', fontWeight: '900', marginBottom: '1rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🎓 Explore Courses
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '500' }}>
              Find the perfect course to expand your skills and knowledge
            </p>
          </div>

          {/* Filters */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', padding: '2rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#0284c7', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🔍 Search
                </label>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '0.95rem', background: '#f9fafb', transition: 'all 0.3s' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0284c7'; e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)'; e.target.style.background = '#f0f9ff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f9fafb'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#7c3aed', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📚 Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '0.95rem', background: '#f9fafb', transition: 'all 0.3s', cursor: 'pointer' }}
                  onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; e.target.style.background = '#faf5ff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f9fafb'; }}
                >
                  <option value="">All Categories</option>
                  <option value="programming">Programming</option>
                  <option value="web-development">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#059669', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📊 Level
                </label>
                <select
                  value={filters.level}
                  onChange={(e) =>
                    setFilters({ ...filters, level: e.target.value })
                  }
                  style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '0.95rem', background: '#f9fafb', transition: 'all 0.3s', cursor: 'pointer' }}
                  onFocus={(e) => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)'; e.target.style.background = '#f0fdf4'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f9fafb'; }}
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: '1 / -1' }}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    setFilters({ category: '', level: '', search: '' })
                  }
                  style={{ width: '100%' }}
                >
                  ✨ Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '24rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '4rem', height: '4rem', border: '4px solid #e5e7eb', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading courses...</p>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <>
              <CourseGrid
                courses={courseCards}
                onEnroll={user ? handleEnroll : undefined}
              />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page - 1,
                      })
                    }
                  >
                    ← Previous
                  </Button>

                  <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <span style={{ color: '#0369a1', fontWeight: '700' }}>
                      Page {pagination.page} of {pagination.pages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.pages}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', border: '2px dashed #e5e7eb' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                No courses found
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button
                variant="primary"
                onClick={() =>
                  setFilters({ category: '', level: '', search: '' })
                }
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
