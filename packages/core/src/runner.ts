import { Runner } from '@forgehive/runner'

import { addProduct } from './tasks/catalog/addProduct'
import { deleteProduct } from './tasks/catalog/deleteProduct'
import { listProducts } from './tasks/catalog/listProducts'
import { restock } from './tasks/stock/restock'
import { sell } from './tasks/stock/sell'

const runner = new Runner()

runner.load('addProduct', addProduct)
runner.load('deleteProduct', deleteProduct)
runner.load('listProducts', listProducts)
runner.load('restock', restock)
runner.load('sell', sell)

export default runner 