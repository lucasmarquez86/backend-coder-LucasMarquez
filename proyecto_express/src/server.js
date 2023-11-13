import express from 'express';
import ProductManager from '../ProductManager.js';

const app = express();
const port = 8080;

const productManager = new ProductManager('./productos.json');

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Endpoint para obtener todos los productos con posible límite
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    console.log('Productos enviados al cliente:', products);

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en puerto ${port}`);
});