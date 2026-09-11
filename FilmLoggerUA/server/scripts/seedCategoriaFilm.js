/**
 * seedCategoriaFilm.js
 * Links the 100 seeded movies to their categories in Categoria_Film.
 *
 * Usage:
 *   cd server
 *   node scripts/seedCategoriaFilm.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTRmYmQ3MjE1MTA3Yjk5NDRmOTlmODBmM2U4OGRmMiIsIm5iZiI6MTc2NzY1NTQwNS43NzEwMDAxLCJzdWIiOiI2OTVjNDdlZDcyYzQ1MTJiOGE2YmQ5ZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SFWXKYfNkx5Vr1S0ZUvpUzhJMT8XEem8x8-8mn9e8rE";

const TMDB_BASE = "https://api.themoviedb.org/3";
const PAGES_TO_FETCH = 5;
const DELAY_MS = 260;

// TMDB genre ID → our Categorias.id
const GENRE_MAP = {
  28: 4,   // Acción → Accion
  16: 2,   // Animación → Animación
  35: 3,   // Comedia → Comedia
  99: 6,   // Documental → Documental
  18: 1,   // Drama → Drama
  27: 5,   // Terror → Horror
  878: 7,  // Ciencia ficción → Sci-Fi
};

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

async function main() {
  console.log("🔗 Enlazando películas con categorías...\n");

  // 1. Fetch popular pages (language=es-ES gives us Spanish titles + genre_ids in one call)
  const tmdbMovies = [];
  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    const data = await tmdbFetch(`/movie/popular?language=es-ES&page=${page}`);
    tmdbMovies.push(...data.results);
    await sleep(DELAY_MS);
  }
  console.log(`  ${tmdbMovies.length} películas obtenidas de TMDB.\n`);

  // 2. Load all Films from Supabase and build a title → id map
  const { data: films, error: filmsError } = await supabase
    .from("Films")
    .select("id, titulo");

  if (filmsError) {
    console.error("Error cargando Films:", filmsError.message);
    process.exit(1);
  }

  const titleToId = new Map(films.map((f) => [f.titulo.trim().toLowerCase(), f.id]));
  console.log(`  ${films.length} películas cargadas de Supabase.\n`);

  // 3. Build Categoria_Film rows
  const rows = [];
  let matched = 0;
  let unmatched = 0;

  for (const movie of tmdbMovies) {
    const filmId = titleToId.get(movie.title?.trim().toLowerCase());
    if (!filmId) {
      console.warn(`  ⚠️  Sin coincidencia: "${movie.title}"`);
      unmatched++;
      continue;
    }

    const categoryIds = (movie.genre_ids || [])
      .map((gid) => GENRE_MAP[gid])
      .filter(Boolean);

    for (const catId of categoryIds) {
      rows.push({ film_id: filmId, categoria_id: catId });
    }
    matched++;
  }

  console.log(`  Coincidencias: ${matched} | Sin coincidencia: ${unmatched}`);
  console.log(`  Filas a insertar: ${rows.length}\n`);

  if (rows.length === 0) {
    console.log("Nada que insertar.");
    return;
  }

  // 4. Deduplicate in memory, then insert in batches
  const seen = new Set();
  const uniqueRows = rows.filter(({ film_id, categoria_id }) => {
    const key = `${film_id}-${categoria_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`  Filas únicas tras deduplicar: ${uniqueRows.length}\n`);

  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < uniqueRows.length; i += BATCH) {
    const batch = uniqueRows.slice(i, i + BATCH);
    const { error } = await supabase.from("Categoria_Film").insert(batch);

    if (error) {
      console.error(`  ❌ Error en lote ${Math.floor(i / BATCH) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  ✅ Lote ${Math.floor(i / BATCH) + 1}: ${batch.length} filas (total: ${inserted})`);
    }
  }

  console.log(`\n🎉 Completado: ${inserted} relaciones película-categoría insertadas.`);
}

main().catch((err) => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
