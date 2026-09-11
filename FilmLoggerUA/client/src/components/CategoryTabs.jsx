import "../css/CategoryTabs.css";

const CategoryTabs = ({ categories, activeCategory, onSelect }) => (
  <nav className="category-tabs" aria-label="Filtrar por categoría">
    <button
      className={`category-tab ${activeCategory === null ? "active" : ""}`}
      onClick={() => onSelect(null)}
    >
      Ver todas
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
        onClick={() => onSelect(activeCategory === cat.id ? null : cat.id)}
      >
        {cat.categoria}
      </button>
    ))}
  </nav>
);

export default CategoryTabs;