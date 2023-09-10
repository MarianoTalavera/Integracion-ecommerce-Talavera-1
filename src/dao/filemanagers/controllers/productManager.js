import fs from "fs"

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    getProducts = async (info) => {
        const { limit } = info
        try {
            if (fs.existsSync(this.path)) {
                const productlist = await fs.promises.readFile(this.path, "utf-8")
                const productlistparse = JSON.parse(productlist)
                const productlistsliced = productlistparse.slice(0, limit)
                return productlistsliced
            } else {
                console.error("Error")
                return
            }}
        catch (error) {
            throw new Error(error)
        }}

    getProductbyId = async (id) => {
        const { pid } = id
        const allproducts = await this.getProducts({})
        const found = allproducts.find(element => element.id === parseInt(pid))
        if (found) {
            return found
        } else {
            console.error("Producto no encontrado")
        }}

    generateId = async () => {
        if (fs.existsSync(this.path)) {
            const listaproducts = await this.getProducts({})
            const counter = listaproducts.length
            if (counter == 0) {
                return 1
            } else {
                return (listaproducts[counter - 1].id) + 1
            }}}
  
    addProduct = async (obj) => {
        const { title, description, price, thumbnail, category, status = true, code, stock } = obj
        if (title === undefined || description === undefined || price === undefined || category === undefined || status === undefined || code === undefined || stock === undefined) {
            console.error("Completar los datos")
            return
        } else {
            const listaproducts = await this.getProducts({})
            const codigorepetido = listaproducts.find(elemento => elemento.code === code)
            if (codigorepetido) {
                console.error("El código está repetido")
                return
            } else {
                const id = await this.generateId()
                const productnew = {
                    id, title, description, price, thumbnail, category, status, code, stock
                }
                listaproducts.push(productnew)
                await fs.promises.writeFile(this.path, JSON.stringify(listaproducts, null, 2))
            }}}

    updateProduct = async (id, obj) => {
        const { pid } = id
        const { title, description, price, thumbnail, category, status, code, stock } = obj
        if (title === undefined || description === undefined || price === undefined || category === undefined || status === undefined || code === undefined || stock === undefined) {
            console.error("Completar los datos")
            return
        } else {
            const allproducts = await this.getProducts({})
            const codigorepetido = allproducts.find(elemento => elemento.code === code)
            if (codigorepetido) {
                console.error("El código está repetido")
                return
            } else {
                const newProductsList = allproducts.map(elemento => {
                    if (elemento.id === parseInt(pid)) {
                        const updatedProduct = {
                            ...elemento, title, description, price, thumbnail, code, status, category, stock
                        } 
                        return updatedProduct
                    } else {
                        return elemento
                    }})
                await fs.promises.writeFile(this.path, JSON.stringify(newProductsList, null, 2))
            }}}

    deleteProduct = async (pid) => {
        const allproducts = await this.getProducts({})
        const productswithoutfound = allproducts.filter(elemento => elemento.id !== parseInt(pid))
        await fs.promises.writeFile(this.path, JSON.stringify(productswithoutfound, null, 2))
    }}