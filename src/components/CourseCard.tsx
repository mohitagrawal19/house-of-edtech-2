import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  instructor?: { name: string; avatar?: string };
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  onEnroll?: (courseId: string) => Promise<void>;
  isEnrolled?: boolean;
  isLoading?: boolean;
}

export function CourseCard({
  id,
  title,
  description,
  category,
  level,
  price,
  instructor,
  rating = 0,
  reviews = 0,
  imageUrl,
  onEnroll,
  isEnrolled = false,
  isLoading = false,
}: CourseCardProps) {
  const [hovering, setHovering] = useState(false);

  const levelStyles = {
    beginner: { background: '#dcfce7', color: '#166534' },
    intermediate: { background: '#fef3c7', color: '#854d0e' },
    advanced: { background: '#fee2e2', color: '#991b1b' },
  };

  return (
    <div 
      style={{ 
        background: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: hovering ? '0 20px 25px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease'
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Image */}
      {imageUrl && (
        <div style={{ 
          height: '12rem', 
          background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <img
            src={imageUrl}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {description}
            </p>
          </div>
        </div>

        {/* Category & Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '500', background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
            {category}
          </span>
          <span
            style={{ fontSize: '0.75rem', fontWeight: '500', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', ...levelStyles[level] }}
          >
            {level}
          </span>
        </div>

        {/* Instructor */}
        {instructor && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem' }}>
              {instructor.avatar ? (
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {instructor.name.charAt(0)}
                </span>
              )}
            </div>
            <span style={{ color: '#374151' }}>{instructor.name}</span>
          </div>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  style={{ width: '1rem', height: '1rem', color: i < Math.floor(rating) ? '#facc15' : '#d1d5db' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span style={{ fontSize: '0.875rem', color: '#4b5563', marginLeft: '0.5rem' }}>
              ({reviews} reviews)
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0284c7' }}>${price}</div>

          {onEnroll && (
            <Button
              variant={isEnrolled ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onEnroll(id)}
              isLoading={isLoading}
              disabled={isEnrolled}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </Button>
          )}

          {!onEnroll && (
            <Link href={`/courses/${id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
interface CourseGridProps {
  courses: CourseCardProps[];
  isLoading?: boolean;
  onEnroll?: (courseId: string) => Promise<void>;
}

export function CourseGrid({
  courses,
  isLoading = false,
  onEnroll,
}: CourseGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} onEnroll={onEnroll} />
      ))}
    </div>
  );
}
