const supabase = require("../supabase");
const { v4: uuidv4 } = require("uuid");

const BUCKET = "imagenes";

/**
 * Uploads a single file to Supabase Storage.
 *
 * @param {Buffer} buffer     - File buffer (from multer memoryStorage)
 * @param {string} mimetype   - MIME type, e.g. "image/jpeg"
 * @param {string} folder     - Full storage folder, e.g. "movies/42/portada"
 * @returns {{ publicUrl: string, storagePath: string }}
 */
const uploadFile = async (buffer, mimetype, folder) => {
  const extension = mimetype.split("/")[1];
  const filename = `${uuidv4()}.${extension}`;
  const storagePath = `${folder}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  return {
    publicUrl: data.publicUrl,
    storagePath,
  };
};

/**
 * Deletes one or more files from Supabase Storage.
 * Best-effort: logs errors but does not throw (used for rollback).
 *
 * @param {string[]} storagePaths
 */
const deleteFiles = async (storagePaths) => {
  if (!storagePaths.length) return;

  const { error } = await supabase.storage.from(BUCKET).remove(storagePaths);

  if (error) {
    console.error("[Storage] Cleanup failed:", error.message, "Paths:", storagePaths);
  }
};

module.exports = { uploadFile, deleteFiles };