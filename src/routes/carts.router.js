import {Router} from "express"
import { __dirname } from "../utils.js"
import CartManager from "../dao/mongomanagers/cartManagerMongo.js"
import ProductManager from "../dao/mongomanagers/productManagerMongo.js"

const cm = new CartManager()
const pm = new ProductManager()

const router =Router()

router.get("/carts",async(req,res)=>{
   const carrito=await cm.getCarts()
   res.json({carrito})
})

router.get("/carts/:cid",async(req,res)=>{
    const carritofound=await cm.getCartbyId(req.params)
    res.json({status:"success",carritofound})
})

router.post('/carts', async (req, res) => {
  try {
      const { obj } = req.body;

      if (!Array.isArray(obj)) {
          return res.status(400).send('Invalid request: products must be an array');
      }

      const validProducts = [];

      for (const product of obj) {
          const checkId = await pm.getProductById(product._id);
          if (checkId === null) {
              return res.status(404).send(`Product with id ${product._id} not found`);
          }
          validProducts.push(checkId);
      }

      const cart = await cm.addCart(validProducts);
      res.status(200).send(cart);

  } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const checkIdProduct = await pm.getProductById(pid);
      if (!checkIdProduct) {
        return res.status(404).send({ message: `No se encontró el producto con ID ${pid} ` });
      }
  
      const checkIdCart = await cm.getCartById(cid);
      if (!checkIdCart) {
        return res.status(404).send({ message: `No se encontró el carrito con ID ${cid} ` });
      }
  
      const result = await cm.addProductInCart(cid, { _id: pid, quantity:quantity });
      console.log(result);
      return res.status(200).send({
        message: `Producto con ID: ${pid} agragado al carrito con ID: ${cid}`,
        cart: result,
      });
    } catch (error) {
      console.error("Ocurrió un error:", error);
      return res.status(500).send({ message: "Ocurrió un error procesando el request" });
    }
  });
  

export default router