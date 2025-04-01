// TASK: restock
// Run this task with:
// forge task:run stock:restock --productId 1 --amount 5

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

const schema = new Schema({
  productId: Schema.number(),
  amount: Schema.number()
})

const boundaries = {
  findProduct: async (id: number) => {
    return prisma.product.findUnique({
      where: { id }
    })
  },
  updateProductStock: async (id: number, newQuantity: number) => {
    return prisma.product.update({
      where: { id },
      data: { quantity: newQuantity }
    })
  }
}

export const restock = createTask(
  schema,
  boundaries,
  async function (argv, { findProduct, updateProductStock }) {
    const product = await findProduct(argv.productId)
    
    if (!product) {
      throw new Error(`Product with id ${argv.productId} not found`)
    }

    const newQuantity = product.quantity + argv.amount
    await updateProductStock(argv.productId, newQuantity)

    return {
      productId: product.id,
      productName: product.name,
      available: newQuantity,
      message: `Restocked ${argv.amount} units of product ${product.name}. New stock: ${newQuantity}`
    }
  }
)
