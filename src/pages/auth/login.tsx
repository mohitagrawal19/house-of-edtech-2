import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Navbar } from '@/components/Navbar';
import { Form, FormInput } from '@/components/Form';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError('');

    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - House of EdTech</title>
      </Head>

      <Navbar />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '3rem 1rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          opacity: 0.08,
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
          opacity: 0.08,
          zIndex: 0
        }} />

        <div style={{ maxWidth: '28rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Form
            title="Welcome Back"
            description="Sign in to your account to continue"
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            submitButtonText="Sign In"
          >
            {apiError && (
              <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '0.875rem' }}>
                {apiError}
              </div>
            )}

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

            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <Link href="#" style={{ fontSize: '0.875rem', color: '#0284c7', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}>
                Forgot password?
              </Link>
            </div>
          </Form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
