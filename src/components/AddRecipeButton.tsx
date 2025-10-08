'use client';

import React, { useState } from 'react';
import { createClientBrowser } from '@/utils/supabase/client';

export default function AddRecipeButton({ role }: { role: string | null }) {
  const supabase = createClientBrowser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (role !== 'owner') return null; // Only show for owner

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { error } = await supabase.from('recipes').insert([
      {
        title,
        description,
        created_by: userId,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Recipe added successfully!');
      setTitle('');
      setDescription('');
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="my-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Add New Recipe
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 p-4 rounded-md bg-white shadow-sm max-w-md"
        >
          <h3 className="font-semibold text-lg mb-2">Add a Recipe</h3>
          <input
            type="text"
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full mb-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-600"
            >
              Cancel
            </button>
          </div>
          {message && <p className="text-sm mt-2">{message}</p>}
        </form>
      )}
    </div>
  );
}
