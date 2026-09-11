/**
 * seedMovies.js
 * Inserts 100 popular movies from TMDB into the Supabase `Films` table.
 *
 * Usage:
 *   cd server
 *   node scripts/seedMovies.js
 *
 * Requires server/.env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// ── Config ────────────────────────────────────────────────────────────────────

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTRmYmQ3MjE1MTA3Yjk5NDRmOTlmODBmM2U4OGRmMiIsIm5iZiI6MTc2NzY1NTQwNS43NzEwMDAxLCJzdWIiOiI2OTVjNDdlZDcyYzQ1MTJiOGE2YmQ5ZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SFWXKYfNkx5Vr1S0ZUvpUzhJMT8XEem8x8-8mn9e8rE";

const TMDB_BASE = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PAGES_TO_FETCH = 5; // 5 pages × 20 movies = 100
const DELAY_MS = 260;     // ~4 req/s — well under TMDB's 40 req/10 s limit

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tmdbFetch(path) {
  const url = `${TMDB_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
}

function mapLanguage(code) {
  const map = {
    en: "Inglés", es: "Español", fr: "Francés", de: "Alemán",
    it: "Italiano", ja: "Japonés", ko: "Coreano", zh: "Chino",
    pt: "Portugués", ru: "Ruso", hi: "Hindi", ar: "Árabe",
  };
  return map[code] || code?.toUpperCase() || null;
}

function mapStatus(status) {
  const map = {
    Released: "Estrenada",
    "In Production": "En producción",
    "Post Production": "Post producción",
    Planned: "Planificada",
    Canceled: "Cancelada",
    Rumored: "Rumoreada",
  };
  return map[status] || status || null;
}

function getDirector(credits) {
  const director = credits?.crew?.find((p) => p.job === "Director");
  return director?.name || null;
}

function getTrailer(videos) {
  const trailer = videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

function getCountry(productionCountries) {
  return productionCountries?.[0]?.name || null;
}

function mapToFilm(detail) {
  return {
    titulo: detail.title,
    sinopsis: detail.overview || "Sin sinopsis disponible.",
    fecha_publicacion: detail.release_date || null,
    director: getDirector(detail.credits),
    calificacion: detail.vote_average
      ? Math.round(detail.vote_average / 2)
      : null,
    pais_produccion: getCountry(detail.production_countries),
    duracion: detail.runtime || null,
    idiona_original: mapLanguage(detail.original_language),
    estado: mapStatus(detail.status),
    trailer: getTrailer(detail.videos),
    img_portada: detail.poster_path ? `${POSTER_BASE}${detail.poster_path}` : null,
    edad_recomendada: detail.adult ? 18 : null,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🎬 Iniciando seed de 100 películas desde TMDB...\n");

  // 1. Collect movie IDs from popular pages
  const movieIds = [];
  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    console.log(`  Página ${page}/${PAGES_TO_FETCH} de películas populares...`);
    const data = await tmdbFetch(`/movie/popular?language=es-ES&page=${page}`);
    data.results.forEach((m) => movieIds.push(m.id));
    await sleep(DELAY_MS);
  }

  console.log(`\n  ${movieIds.length} IDs recogidos. Obteniendo detalles...\n`);

  // 2. Fetch details for each movie
  const films = [];
  for (let i = 0; i < movieIds.length; i++) {
    const tmdbId = movieIds[i];
    try {
      const detail = await tmdbFetch(
        `/movie/${tmdbId}?language=es-ES&append_to_response=credits,videos`
      );
      films.push(mapToFilm(detail));
      process.stdout.write(`  [${i + 1}/${movieIds.length}] ${detail.title}\n`);
    } catch (err) {
      console.warn(`  ⚠️  Skipping ID ${tmdbId}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n  ${films.length} películas preparadas. Insertando en Supabase...\n`);

  // 3. Insert in batches of 20 to stay within Supabase request limits
  const BATCH = 20;
  let inserted = 0;
  for (let i = 0; i < films.length; i += BATCH) {
    const batch = films.slice(i, i + BATCH);
    const { error } = await supabase.from("Films").insert(batch);
    if (error) {
      console.error(`  ❌ Error en lote ${i / BATCH + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  ✅ Lote ${i / BATCH + 1}: ${batch.length} insertadas (total: ${inserted})`);
    }
  }

  console.log(`\n🎉 Seed completado: ${inserted} películas insertadas en la base de datos.`);
}

main().catch((err) => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
