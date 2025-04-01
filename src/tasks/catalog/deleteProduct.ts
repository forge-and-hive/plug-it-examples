// TASK: deleteProduct
// Run this task with:
// forge task:run catalog:deleteProduct --id 1

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

const schema = new Schema({
  id: Schema.number()
})

const boundaries = {
  findProduct: async (id: number) => {
    return prisma.product.findUnique({
      where: { id }
    })
  },
  deleteProduct: async (id: number) => {
    return prisma.product.delete({
      where: { id }
    })
  }
}

export const deleteProduct = createTask(
  schema,
  boundaries,
  async function (argv, { findProduct, deleteProduct }) {
    const product = await findProduct(argv.id)
    
    if (!product) {
      throw new Error(`Product with id ${argv.id} not found`)
    }

    await deleteProduct(argv.id)
    return { message: `Product with id ${argv.id} deleted successfully` }
  }
)
