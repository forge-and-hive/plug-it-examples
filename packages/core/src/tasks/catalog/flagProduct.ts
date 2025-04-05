// TASK: flagProduct
// Run this task with:
// forge task:run catalog:flagProduct --productId 2

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'
import { prisma } from '../../lib/prisma'
import type { Product } from '@prisma/client'

const schema = new Schema({
  productId: Schema.number()
})

const boundaries = {
  findProduct: async (id: number): Promise<Product | null> => {
    return prisma.product.findUnique({
      where: { id }
    })
  },
  toggleProductFlag: async (id: number, currentValue: boolean): Promise<Product> => {
    return prisma.product.update({
      where: { id },
      data: {
        flagged: !currentValue
      }
    })
  }
}

export const flagProduct = createTask(
  schema,
  boundaries,
  async function (argv, boundaries) {
    const { productId } = argv
    
    // Get the current product
    const product = await boundaries.findProduct(productId)
    
    if (!product) {
      return { status: 'Error', message: `Product with ID ${productId} not found` }
    }
    
    // Toggle the flagged status
    const updatedProduct = await boundaries.toggleProductFlag(productId, product.flagged)
    
    return {
      status: 'Ok',
      message: `Product ${productId} flagged status changed to ${updatedProduct.flagged}`
    }
  }
)
