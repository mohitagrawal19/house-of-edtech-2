import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Navbar } from '@/components/Navbar';
import { Form, FormInput, FormSelect } from '@/components/Form';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError('');

    try {
      await registerUser(data.name, data.email, data.password, data.role);
      router.push('/dashboard');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - House of EdTech</title>
      </Head>

      <Navbar />

      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <Form
            title="Create Account"
            description="Join House of EdTech and start learning today"
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            submitButtonText="Create Account"
          >
            {apiError && (
              <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '0.875rem' }}>
                {apiError}
              </div>
            )}

            <FormInput
              label="Full Name"
              name="name"
              placeholder="John Doe"
              error={errors.name?.message as string}
              register={register}
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message as string}
              register={register}
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message as string}
              register={register}
              required
            />

            <FormSelect
              label="I want to"
              name="role"
              options={[
                { value: 'student', label: 'Learn (Student)' },
                { value: 'instructor', label: 'Teach (Instructor)' },
              ]}
              error={errors.role?.message as string}
              register={register}
              required
            />
          </Form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
