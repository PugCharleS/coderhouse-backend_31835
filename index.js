const fs = require("fs");
const express = require("express");

class Contenedor {
  constructor(file) {
    this.file = file;
    this.id = 1;
    this.fileProductList = [];
  }

  async save(obj) {
    try {
      let content;

      if (fs.existsSync(this.file)) {
        content = await fs.promises.readFile(this.file, "utf-8");
      } else {
        content = await fs.promises.writeFile(this.file, "");
      }

      if (content && content.length > 0) {
        this.fileProductList = await JSON.parse(content);
        let oldId = this.fileProductList.length - 1;
        this.id = this.fileProductList[oldId].id + 1;
        this.fileProductList.push({ id: this.id, ...obj });
      } else {
        this.fileProductList.push({ id: this.id, ...obj });
      }

      await fs.promises.writeFile(
        this.file,
        `${JSON.stringify(this.fileProductList)}`
      );

      return this.id;
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async getById(id) {
    try {
      if (fs.existsSync(this.file)) {
        const content = await fs.promises.readFile(this.file, "utf-8");

        const products = await JSON.parse(content);

        let productFound = products.find((product) => {
          return product.id === id;
        });

        return productFound;
      } else {
        console.log("File does not exist");
        return null;
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async getAll() {
    try {
      if (fs.existsSync(this.file)) {
        const content = await fs.promises.readFile(this.file, "utf-8");
        if (content && content.length > 0) {
          const products = await JSON.parse(content);
          return products;
        } else {
          console.log("There are no products");
        }
      } else {
        console.log("File does not exist");
        return null;
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async deleteById(id) {
    try {
      if (fs.existsSync(this.file)) {
        const content = await fs.promises.readFile(this.file, "utf-8");
        if (content && content.length > 0) {
          const products = await JSON.parse(content);

          let filteredProducts = products.filter((product) => {
            return product.id !== id;
          });

          await fs.promises.writeFile(
            this.file,
            `${JSON.stringify(filteredProducts)}`
          );

          return filteredProducts;
        } else {
          console.log("There are no products");
        }
      } else {
        console.log("File does not exist");
      }
    } catch (err) {
      console.log("Error ", err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.file, "");
      console.log("There are no longer products in the file");
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

const product1 = {
  title: "Apple iPhone 13",
  price: "$1500",
  thumbnail: "http://thumbnail1.com",
};
const product2 = {
  title: "Apple MacBook Air",
  price: "$1300",
  thumbnail: "http://thumbnail2.com",
};
const product3 = {
  title: "Apple Watch",
  price: "$650",
  thumbnail: "http://thumbnail3.com",
};

const container = new Contenedor("./products.txt");

// container.save(product3).then((response) => console.log(response));

// container.getById(2).then((response) => console.log(response));

// container
//   .getAll()
//   .then((response) => (response ? console.log(response) : null));

// container.deleteById(1).then((response) => console.log(response));

// container.deleteAll();

const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server Running in port: ${server.address().port}`);
});

app.get("/", (req, res) => {
  res.send("Verificando puerto");
});

app.get("/productos", async (req, res) => {
  try {
    let products = await container.getAll();
    res.send(products);
  } catch (err) {
    console.log(err);
  }
});

app.get("/productoRandom", async (req, res) => {
  try {
    let productos = await container.getAll();
    const id = Math.floor(Math.random() * productos.length);
    const productoRandom = productos.filter((producto) => producto.id === id);
    res.send(...productoRandom);
  } catch (err) {
    console.log(err);
  }
});

server.on("Error", (err) => console.log(`Server Error: ${err}`));
