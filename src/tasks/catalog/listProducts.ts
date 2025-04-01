// TASK: listProducts
// Run this task with:
// forge task:run catalog:listProducts

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

const schema = new Schema({
  // No parameters needed for this task
})

const boundaries = {
  listAvailableProducts: async () => {
    return prisma.product.findMany({
      where: {
        quantity: {
          gt: 0
        }
      }
    })
  }
}

export const listProducts = createTask(
  schema,
  boundaries,
  async function (_argv, boundaries) {
    const products = await boundaries.listAvailableProducts()

    const productsWithoutTimestamps = products.map((product) => {
      const { createdAt, updatedAt, ...rest } = product
      return rest
    })

    return productsWithoutTimestamps
  }
)
