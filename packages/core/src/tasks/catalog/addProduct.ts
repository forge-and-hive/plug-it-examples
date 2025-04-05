// TASK: addProduct
// Run this task with:
// forge task:run catalog:addProduct --name "iPhone 15" --quantity 10
// forge task:run catalog:addProduct --name "pixel 8a" --quantity 5

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'
import { prisma } from '../../lib/prisma'

const schema = new Schema({
  name: Schema.string(),
  quantity: Schema.number()
})

const boundaries = {
  createProduct: async (data: { name: string; quantity: number }) => {
    return prisma.product.create({ data })
  }
}

export const addProduct = createTask(
  schema,
  boundaries,
  async function (argv, boundaries) {
    const product = await boundaries.createProduct({
      name: argv.name,
      quantity: argv.quantity
    })

    return product
  }
)

addProduct.setDescription('Add a product to the catalog')
