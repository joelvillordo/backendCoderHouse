const express = require("express");

const fs = require("fs");

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

//Usando la clase Contenedor
const item1 = {
  title: "Ejemplo1",
  price: 185,
  thumbnail: "link/ejemplo1.jpg",
};
const item2 = {
  title: "Ejemplo2",
  price: 300,
  thumbnail: "link/ejemplo2.jpg",
};
const item3 = {
  title: "Ejemplo3",
  price: 450,
  thumbnail: "link/ejemplo3.jpg",
};

class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }
  async save(object) {
    await this.getAll();
    this.id++;
    this.data.push({
      id: this.id,
      product: object,
    });
    try {
      await fs.promises.writeFile(this.archivo, JSON.stringify(this.data));
    } catch (error) {
      console.log(error);
    }
  }
  async getById(id) {
    try {
      const lista = JSON.parse(
        await fs.promises.readFile(this.archivo, "utf-8")
      );

      const productById = lista.find((product) => product.id == id);

      const resultado = productById ? productById : null;

      return resultado;
    } catch (error) {
      console.log(error);
    }
  }
  async getAll() {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data) {
        this.data = JSON.parse(data);
        this.data.map((producto) => {
          if (this.id < producto.id) this.id = producto.id;
        });
      }
    } catch (error) {
      return;
    }
  }
  async deleteById(id) {
    const data = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
    const newData = JSON.stringify(
      data.filter((producto) => producto.id !== id)
    );
    console.log(newData);
    fs.promises.writeFile(this.archivo, newData, "utf-8");
  }
  async deleteAll() {
    await fs.promises.unlink(this.archivo, "utf-8");
  }
}

const productos = new Contenedor("productos.txt");

//Desafio 4
//GET '/api/productos' -> devuelve todos los productos.
router.get("/", async (req, res) => {
  let productos = [];
  const data = JSON.parse(fs.readFileSync("productos.txt", "utf-8"));
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
//DELETE '/api/productos/:id' -> elimina un producto según su id.
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await productos.deleteById(id);

  res.json(`Producto eliminado ${id}`);
});
