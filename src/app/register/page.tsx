'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Պարզ ստուգումներ (Validation)
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Խնդրում ենք լրացնել բոլոր դաշտերը');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Գաղտնաբառերը չեն համընկնում');
      return;
    }

    if (formData.password.length < 6) {
      setError('Գաղտնաբառը պետք է լինի առնվազն 6 նիշ');
      return;
    }

    // Այստեղ կարող եք ուղարկել տվյալները ձեր Backend API-ին
    console.log('Registered User:', formData);
    alert('Գրանցումն հաջողությամբ կատարվեց');
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-950 text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-500">
          Create an Account
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Sign up to get started with MovieApp
        </p>

        {/* Սխալի ցուցադրում */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 mt-2 shadow-lg shadow-blue-600/30"
          >
            Register
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}