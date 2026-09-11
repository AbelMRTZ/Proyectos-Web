/**
 * seedActores.js
 * Populates Actores + Actor_Film for:
 *   - The 100 popular movies seeded from TMDB
 *   - 8 manually-added movies (searched by title on TMDB)
 *
 * Usage:
 *   cd server
 *   node scripts/seedActores.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTRmYmQ3MjE1MTA3Yjk5NDRmOTlmODBmM2U4OGRmMiIsIm5iZiI6MTc2NzY1NTQwNS43NzEwMDAxLCJzdWIiOiI2OTVjNDdlZDcyYzQ1MTJiOGE2YmQ5ZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SFWXKYfNkx5Vr1S0ZUvpUzhJMT8XEem8x8-8mn9e8rE";

const TMDB_BASE    = "https://api.themoviedb.org/3";
const PHOTO_BASE   = "https://image.tmdb.org/t/p/w185";
const PAGES        = 5;
const MAX_CAST     = 5;   // top N actors per movie
const DELAY_MS     = 260;

// Manual movies: search term → expected Supabase title variants
const MANUAL_MOVIES = [
  { search: "Inception",                      titulo: ["Inception", "Origen"] },
  { search: "Hereditary",                     titulo: ["Hereditary"] },
  { search: "John Wick",                      titulo: ["John Wick"] },
  { search: "The Nice Guys",                  titulo: ["The Nice Guys", "Nice Guys"] },
  { search: "Midsommar",                      titulo: ["Midsommar"] },
  { search: "Spider-Man Into the Spider-Verse", titulo: ["Spider-Man: Un nuevo universo", "Spiderman into the spiderverse", "Spider-Man: Into the Spider-Verse", "Spider-Man"] },
  { search: "Oppenheimer",                    titulo: ["Oppenheimer", "Oppenhaimer"] },
  { search: "Michael",                        titulo: ["Michael"] },
];

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tmdbFetch(path) {
  const res = await fetch(`${TMDB_BASE}${path}`, {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
}

// ─── Actor upsert ─────────────────────────────────────────────────────────────
// nameMap: nombre.toLowerCase() → supabase actor id (in-memory cache)
async function getOrCreateActor(member, nameMap) {
  const key = member.name.trim().toLowerCase();
  if (nameMap.has(key)) return nameMap.get(key);

  const foto = member.profile_path ? `${PHOTO_BASE}${member.profile_path}` : null;

  const { data, error } = await supabase
    .from("Actores")
    .insert({ nombre: member.name.trim(), foto_perfil: foto })
    .select("id")
    .single();

  if (error) {
    console.warn(`    ⚠️  No se pudo insertar actor "${member.name}": ${error.message}`);
    return null;
  }

  nameMap.set(key, data.id);
  return data.id;
}

// ─── Process one movie ────────────────────────────────────────────────────────
async function processMovie(filmId, cast, nameMap) {
  const top = cast
    .filter((m) => m.known_for_department === "Acting")
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_CAST);

  const rows = [];
  for (const member of top) {
    const actorId = await getOrCreateActor(member, nameMap);
    if (actorId) rows.push({ film_id: filmId, actor_id: actorId, rol: member.character || null });
  }

  if (!rows.length) return 0;

  const { error } = await supabase.from("Actor_Film").insert(rows);
  if (error) console.warn(`    ⚠️  Actor_Film insert error (film ${filmId}): ${error.message}`);
  return rows.length;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🎭 Iniciando seed de actores...\n");

  // 1. Load all existing Actores into the cache
  const { data: existingActores } = await supabase.from("Actores").select("id, nombre");
  const nameMap = new Map((existingActores || []).map((a) => [a.nombre.trim().toLowerCase(), a.id]));
  console.log(`  ${nameMap.size} actores ya en BD.\n`);

  // 2. Load all Supabase films → title map
  const { data: films, error: filmsError } = await supabase.from("Films").select("id, titulo");
  if (filmsError) { console.error("Error cargando Films:", filmsError.message); process.exit(1); }
  const titleMap = new Map(films.map((f) => [f.titulo.trim().toLowerCase(), f.id]));
  console.log(`  ${films.length} películas en BD.\n`);

  // ── Phase 1: 100 popular movies ────────────────────────────────────────────
  console.log("── Fase 1: 100 películas populares ──────────────────────────────");

  const popularIds = [];
  for (let page = 1; page <= PAGES; page++) {
    const data = await tmdbFetch(`/movie/popular?language=es-ES&page=${page}`);
    data.results.forEach((m) => popularIds.push({ tmdbId: m.id, title: m.title }));
    await sleep(DELAY_MS);
  }

  let phase1Done = 0;
  for (let i = 0; i < popularIds.length; i++) {
    const { tmdbId, title } = popularIds[i];
    const filmId = titleMap.get(title.trim().toLowerCase());
    if (!filmId) {
      console.warn(`  ⚠️  Sin coincidencia en BD: "${title}"`);
      await sleep(DELAY_MS);
      continue;
    }

    try {
      const detail = await tmdbFetch(`/movie/${tmdbId}?append_to_response=credits`);
      const cast = detail.credits?.cast || [];
      const inserted = await processMovie(filmId, cast, nameMap);
      process.stdout.write(`  [${i + 1}/100] ${title} → ${inserted} actores\n`);
    } catch (err) {
      console.warn(`  ⚠️  Error en "${title}": ${err.message}`);
    }
    phase1Done++;
    await sleep(DELAY_MS);
  }
  console.log(`\n  Fase 1 completada: ${phase1Done} películas procesadas.\n`);

  // ── Phase 2: manual movies ─────────────────────────────────────────────────
  console.log("── Fase 2: películas manuales ────────────────────────────────────");

  for (const { search, titulo: variants } of MANUAL_MOVIES) {
    // Find Supabase film by trying each title variant
    let filmId = null;
    for (const t of variants) {
      filmId = titleMap.get(t.trim().toLowerCase());
      if (filmId) break;
    }

    if (!filmId) {
      // Fallback: fuzzy search in titleMap
      const lower = search.toLowerCase();
      for (const [key, id] of titleMap) {
        if (key.includes(lower) || lower.includes(key.split(":")[0].trim())) {
          filmId = id;
          break;
        }
      }
    }

    if (!filmId) {
      console.log(`  ✗ "${search}" no encontrada en BD — sin actores`);
      continue;
    }

    try {
      // Search TMDB for the English title to get TMDB id
      const searchRes = await tmdbFetch(
        `/search/movie?query=${encodeURIComponent(search)}&language=en-US`
      );
      await sleep(DELAY_MS);

      const result = searchRes.results?.[0];
      if (!result) {
        console.log(`  ✗ "${search}" no encontrada en TMDB`);
        continue;
      }

      const detail = await tmdbFetch(`/movie/${result.id}?append_to_response=credits`);
      const cast = detail.credits?.cast || [];
      const inserted = await processMovie(filmId, cast, nameMap);
      console.log(`  ✓ "${search}" → ${inserted} actores`);
    } catch (err) {
      console.warn(`  ⚠️  Error buscando "${search}": ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const { count } = await supabase.from("Actor_Film").select("*", { count: "exact", head: true });
  const { count: actCount } = await supabase.from("Actores").select("*", { count: "exact", head: true });
  console.log(`\n🎉 Completado. Actores en BD: ${actCount} | Relaciones Actor_Film: ${count}`);
}

main().catch((err) => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
