'use client';

import React from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 card">
      <h2 className="text-2xl font-semibold mb-4">Dessert99 — Sign in</h2>

      <form action={loginAction}>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            name="password"
            type="password"
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
