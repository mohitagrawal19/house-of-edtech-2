import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { Form, FormInput, FormSelect, FormTextArea } from '@/components/Form';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'programming',
      level: 'beginner',
      price: '0',
    }
  });

  useEffect(() => {
    if (user?.role === 'instructor') {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setCourses(response.data.data.createdCourses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsCreating(true);
    try {
      // Ensure price is a number
      const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
      
      if (isNaN(price)) {
        alert('Price must be a valid number');
        setIsCreating(false);
        return;
      }

      const courseData = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        category: data.category?.trim(),
        level: data.level?.trim(),
        price: price,
        modules: [],
      };

      await axios.post('/api/courses', courseData);
      reset();
      fetchCourses();
      alert('Course created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create course';
      alert(`Error: ${message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        fetchCourses();
        alert('Course deleted successfully');
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  return (
    <ProtectedRoute requiredRole="instructor">
      <Head>
        <title>Instructor Dashboard - House of EdTech</title>
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
              🎓 Instructor Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem', fontWeight: '500' }}>Create and manage your courses with ease</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {/* Create Course Form */}
            <div>
              <Form
                title="Create New Course"
                onSubmit={handleSubmit(onSubmit)}
                isLoading={isCreating}
                submitButtonText="Create Course"
              >
                <FormInput
                  label="Course Title"
                  name="title"
                  placeholder="React Fundamentals"
                  error={errors.title?.message as string}
                  register={register}
                  required
                />

                <FormTextArea
                  label="Description"
                  name="description"
                  placeholder="Describe your course..."
                  error={errors.description?.message as string}
                  register={register}
                  required
                  rows={4}
                />

                <FormSelect
                  label="Category"
                  name="category"
                  options={[
                    { value: 'programming', label: 'Programming' },
                    { value: 'web-development', label: 'Web Development' },
                    { value: 'data-science', label: 'Data Science' },
                    { value: 'design', label: 'Design' },
                    { value: 'business', label: 'Business' },
                  ]}
                  error={errors.category?.message as string}
                  register={register}
                  required
                />

                <FormSelect
                  label="Level"
                  name="level"
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                  error={errors.level?.message as string}
                  register={register}
                  required
                />

                <FormInput
                  label="Price ($)"
                  name="price"
                  type="number"
                  placeholder="49.99"
                  error={errors.price?.message as string}
                  register={register}
                  required
                />
              </Form>
            </div>

            {/* Courses List */}
            <div>
              <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ padding: '2rem', borderBottom: '2px solid #e5e7eb', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>📚</span> My Courses
                    <span style={{ fontSize: '1rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: '700' }}>
                      {courses.length}
                    </span>
                  </h2>
                </div>

                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '4rem', height: '4rem', border: '4px solid #e5e7eb', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                      <p style={{ color: '#6b7280' }}>Loading courses...</p>
                    </div>
                  </div>
                ) : courses.length > 0 ? (
                  <div>
                    {courses.map((course) => (
                      <div key={course._id} style={{ padding: '1.75rem', borderBottom: '1px solid #e5e7eb', transition: 'all 0.3s ease', cursor: 'default' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                              {course.title}
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
                              {course.description}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                              <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>📁</span> {course.category}
                              </span>
                              <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>💰</span> ${course.price}
                              </span>
                              <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>👥</span> {course.students?.length || 0} {course.students?.length === 1 ? 'student' : 'students'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', flexShrink: 0 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.location.href = `/courses/${course._id}`;
                              }}
                            >
                              👁️ View
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                      You haven&apos;t created any courses yet
                    </p>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                      Use the form on the left to create your first course
                    </p>
                  </div>
                )}
              </div>

              {/* Course Statistics */}
              {courses.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.75rem', border: '1px solid #e5e7eb', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                      👥 Total Students
                    </p>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {courses.reduce((sum, c) => sum + (c.students?.length || 0), 0)}
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '1.75rem', border: '1px solid #e5e7eb', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                      💰 Potential Revenue
                    </p>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      ${courses.reduce((sum, c) => sum + (c.price * (c.students?.length || 0)), 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
