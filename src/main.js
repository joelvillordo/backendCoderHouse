const express = require("express");

const fs = require("fs");
//Contenedor desde archivo
const Contenedor = require("./contenedor.js");

const router = express.Router();

const app = express();
const PORT = 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/api/productos", router);

app.listen(PORT, () => {
  console.log(`Server corriendo en ${PORT}`);
});

const productos = new Contenedor("productos.txt");

//Desafio 4
//GET '/api/productos' -> devuelve todos los productos.
router.get("/", async (req, res) => {
  let productos = [];
  const data = JSON.parse(await fs.promises.readFile("productos.txt", "utf-8"));
  productos.push(data.map((item) => item));
  res.json(productos);
});
//GET '/api/productos/:id' -> devuelve un producto según su id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (productos.getById(id) === null) {
    res.send({ error: "producto no encontrado" });
  } else {
    const productById = await productos.getById(id);

    res.json(productById);
  }
});
//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
router.post("/", async (req, res) => {
  const { body } = req;

  await productos.save(body);

  res.json(body);
});
//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { body } = req;
  await productos.updateById(id, body);
  res.send(`Producto actualizado id:${id}`);
});

//DELETE '/api/productos/:id' -> elimina un producto según su id.
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await productos.deleteById(id, body);

  res.json(`Producto eliminado ${id}`);
});
