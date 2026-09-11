import "../css/Sorprendeme.css";

const Sorprendeme = ({ films, onNavigate }) => {
  const handleClick = () => {
    if (!films.length) return;
    const random = films[Math.floor(Math.random() * films.length)];
    onNavigate(random.id);
  };

  return (
    <section className="sorprendeme" aria-label="Película aleatoria">
      <div className="sorprendeme-content">
        <h2>¿No sabes qué ver?</h2>
        <p>Te sugerimos una peli o serie al azar</p>
        <button
          className="sorprendeme-btn"
          onClick={handleClick}
          disabled={!films.length}
        >
          ¡Sorpréndeme!
        </button>
      </div>
    </section>
  );
};

export default Sorprendeme;