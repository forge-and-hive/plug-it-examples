// TASK: listProducts
// Run this task with:
// forge task:run catalog:listProducts

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const schema = new Schema({})

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
  async function ({}, { listAvailableProducts }) {
    const products = await listAvailableProducts()

    const productsWithoutTimestamps = products.map((product) => {
      const { createdAt, updatedAt, ...rest } = product
      return rest
    })

    return productsWithoutTimestamps
  }
)

listProducts.setDescription('List all available products in the catalog')
