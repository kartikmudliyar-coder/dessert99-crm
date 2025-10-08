'use client';

import React, { useState } from 'react';
import { createClientBrowser } from '@/utils/supabase/client';

export default function AddRecipeButton() {
  const supabase = createClientBrowser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    yield_info: '',
    steps: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not logged in');

      const { error } = await supabase.from('recipes').insert([
        {
          name: form.name,
          description: form.description,
          yield_info: form.yield_info,
          steps: form.steps,
          created_by: user.id,
        },
      ]);

      if (error) throw error;
      alert('Recipe added successfully!');
      setForm({ name: '', description: '', yield_info: '', steps: '' });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-[--color-brand] text-white px-4 py-2 rounded hover:bg-[--color-brand-dark]"
        onClick={() => setOpen(true)}
      >
        + Add Recipe
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Recipe</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                placeholder="Recipe name"
                value={form.name}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <input
                name="yield_info"
                placeholder="Yield info (e.g., 2 servings)"
                value={form.yield_info}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <textarea
                name="steps"
                placeholder="Steps"
                value={form.steps}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[--color-brand] text-white px-4 py-2 rounded"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
