const fs = require("fs");

class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }

  //GetAll
  async getAll() {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      const productos = await JSON.parse(data);
      return productos;
    } catch (error) {
      console.log(error);
    }
  }
  //Save new product
  async save(object) {
    const data = await this.getAll();
    const lastId = data[data.length - 1].id;
    data.push({ id: lastId + 1, ...object });
    try {
      await fs.promises.writeFile(this.archivo, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }
  //Get product by ID
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
  //Update by ID
  async updateById(id, object) {
    const data = await this.getAll();
    const index = data.findIndex((product) => product.id == id);
    //Buscar producto para actualizarlo
    const producto = data[index];
    const { title, price, thumbnail } = object;
    producto.id = producto.id;
    producto.title = title;
    producto.price = price;
    producto.thumbnail = thumbnail;
    data[index] = { id: id, ...object };
    await fs.promises.writeFile(this.archivo, JSON.stringify(data));
  }
  //Delete product by ID
  async deleteById(id) {
    const data = await this.getAll();
    const productId = parseInt(id);
    const newData = data.filter((producto) => producto.id !== productId);
    const dataStringify = JSON.stringify(newData);
    await fs.promises.writeFile(this.archivo, dataStringify, "utf-8");
  }
  //Delete All
  async deleteAll() {
    await fs.promises.unlink(this.archivo, "utf-8");
  }
}

module.exports = Contenedor;
