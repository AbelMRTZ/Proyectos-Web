const supabase = require("../supabase");

const getCategories = async (req, res) => {
  const { data, error } = await supabase
    .from("Categorias")
    .select("id, categoria");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

module.exports = {
  getCategories,
};