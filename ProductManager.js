import fs from 'fs';

export default class ProductManager {
  constructor(path) {
      this.path = path;
      this.products = [];
  
      // Cargamos los productos desde el archivo si existe
      if (fs.existsSync(path)) {
        try {
          const data = fs.readFileSync(path, "utf-8");
          this.products = JSON.parse(data);
        } catch (error) {
          console.error("Error al leer el archivo de productos:", error);
        }
      }
    }
  
    async saveProducts() {
      try {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
        console.log("Productos guardados en el archivo.");
      } catch (error) {
        console.error("Error al guardar los productos en el archivo:", error);
      }
    }
  
    addProduct(productData) {
      const { title, description, price, thumbnail, code, stock } = productData;
  
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios.");
        return;
      }
  
      // Generar un nuevo ID autoincrementable
      const newId = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
  
      const product = {
        id: newId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
  
      this.products.push(product);
      this.saveProducts();
      console.log("Producto agregado correctamente.");
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado.");
      }
    }
  
    updateProduct(id, updatedProductData) {
      const productIndex = this.products.findIndex(product => product.id === id);
  
      if (productIndex !== -1) {
        // Mantenemos el mismo ID
        updatedProductData.id = this.products[productIndex].id;
        this.products[productIndex] = updatedProductData;
        this.saveProducts();
        console.log("Producto actualizado correctamente.");
      } else {
        console.error("Producto no encontrado para actualizar.");
      }
    }
  
    deleteProduct(id) {
      const productIndex = this.products.findIndex(product => product.id === id);
  
      if (productIndex !== -1) {
        this.products.splice(productIndex, 1);
        this.saveProducts();
        console.log("Producto eliminado correctamente.");
      } else {
        console.error("Producto no encontrado para eliminar.");
      }
    }
  }
  
  // Ejemplo de uso en el mismo archivo
  const manager = new ProductManager("./productos.json");
  
  // manager.addProduct({
  //   title: "Producto 1",
  //   description: "Descripción del Producto 1",
  //   price: 19.99,
  //   thumbnail: "producto1.jpg",
  //   code: "P1",
  //   stock: 10,
  // });
  
  // manager.addProduct({
  //   title: "Producto 2",
  //   description: "Descripción del Producto 2",
  //   price: 29.99,
  //   thumbnail: "producto2.jpg",
  //   code: "P2",
  //   stock: 5,
  // });
  
  // console.log("Productos existentes:");
  // console.log(manager.getProducts());
  
  // const product = manager.getProductById(1);
  // console.log("Producto con ID 1:");
  // console.log(product);
  
  // manager.updateProduct(1, {
  //   title: "Producto 1 Actualizado",
  //   description: "Descripción actualizada",
  //   price: 24.99,
  //   thumbnail: "producto1_actualizado.jpg",
  //   code: "P1",
  //   stock: 15,
  // });
  
  // console.log("Productos después de la actualización:");
  // console.log(manager.getProducts());
  
  // manager.deleteProduct(2);
  
  // console.log("Productos después de la eliminación:");
  // console.log(manager.getProducts());