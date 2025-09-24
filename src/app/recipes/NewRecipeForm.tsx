"use client";

import { useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function NewRecipeForm() {
  const supabase = createClientBrowser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let imagePath: string | null = null;
      if (imageFile) {
        const path = `recipes/${Date.now()}-${imageFile.name}`;
        const { error: upErr } = await supabase.storage.from('product images').upload(path, imageFile, { upsert: false });
        if (upErr) throw upErr;
        imagePath = path;
      }

      const { error: insertError } = await supabase
        .from("recipes")
        .insert([{ name, description, image_path: imagePath }]);
      if (insertError) throw insertError;
      setName("");
      setDescription("");
      setImageFile(null);
      // simple refresh to show new row
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create recipe";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-3">
      <div className="font-medium">Create Recipe</div>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div>
        <label className="block text-sm">Name</label>
        <input
          className="mt-1 w-full border rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea
          className="mt-1 w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm">Product Image (optional)</label>
        <input type="file" accept="image/*" className="mt-1 w-full" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      </div>
      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
}


