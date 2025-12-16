import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Link from 'next/link';

export default function CourseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, logout } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data.data);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load course';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsEnrolling(true);
    try {
      await axios.post(`/api/courses/${id}?action=enroll`);
      fetchCourse();
      alert('Successfully enrolled in the course!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to enroll';
      alert(message);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading Course - House of EdTech</title>
        </Head>
        <Navbar user={user} onLogout={logout} />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', border: '4px solid #e5e7eb', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#6b7280' }}>Loading course details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Head>
          <title>Course Not Found - House of EdTech</title>
        </Head>
        <Navbar user={user} onLogout={logout} />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem' }}>
              Course Not Found
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {error || 'The course you are looking for does not exist.'}
            </p>
            <Link href="/courses">
              <Button variant="primary">
                ← Back to Courses
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isEnrolled = user && course.students?.includes(user.id);
  const isInstructor = user && course.instructor?._id === user.id;

  return (
    <>
      <Head>
        <title>{course.title} - House of EdTech</title>
      </Head>

      <Navbar user={user} onLogout={logout} />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Back Button */}
          <Link href="/courses">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600', fontSize: '1rem' }}>
              ← Back to Courses
            </div>
          </Link>

          {/* Course Header */}
          <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderRadius: '16px', padding: '3rem 2rem', color: 'white', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', backdropFilter: 'blur(10px)' }}>
                {course.category}
              </div>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
              {course.title}
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.95, marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Instructor</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                  {course.instructor?.name || 'Unknown'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Level</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700', textTransform: 'capitalize' }}>
                  {course.level}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Students</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                  {course.students?.length || 0}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Price</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>
                  ${course.price}
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginBottom: '2rem' }}>
            {/* Main Content */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>📖</span> About This Course
              </h2>
              <div style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  {course.description}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  This course covers comprehensive topics to help you master {course.category}. Whether you're a beginner or looking to advance your skills, this course is designed for you.
                </p>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>✅</span> What You'll Learn
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    'Master the fundamentals and core concepts',
                    'Build real-world projects and applications',
                    'Understand best practices and industry standards',
                    'Get hands-on experience with practical examples',
                  ].map((item, idx) => (
                    <li key={idx} style={{ color: '#4b5563', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ color: '#059669', fontWeight: '700', marginTop: '0.25rem' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', border: '1px solid #e5e7eb', position: 'sticky', top: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                    Course Price
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ${course.price}
                  </div>
                </div>

                {!isInstructor && (
                  <Button
                    variant={isEnrolled ? 'outline' : 'primary'}
                    onClick={handleEnroll}
                    isLoading={isEnrolling}
                    size="lg"
                    style={{ width: '100%', marginBottom: '1rem' }}
                  >
                    {isEnrolled ? '✓ Already Enrolled' : '🎓 Enroll Now'}
                  </Button>
                )}

                {!user && (
                  <div style={{ padding: '1rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', marginBottom: '1rem' }}>
                    <p style={{ color: '#0369a1', fontSize: '0.875rem', margin: 0 }}>
                      <Link href="/auth/login">
                        <span style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Sign in</span>
                      </Link>
                      {' '}to enroll in this course
                    </p>
                  </div>
                )}

                <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                  <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                      Instructor
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>
                      {course.instructor?.name}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                      Level
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', textTransform: 'capitalize' }}>
                      {course.level}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                      Students Enrolled
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>
                      {course.students?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
