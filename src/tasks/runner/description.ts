// TASK: description
// Run this task with:
// forge task:run runner:description

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'

import runner from '../../runner'

const schema = new Schema({
  // Add your schema definitions here
  // example: myParam: Schema.string()
})

const boundaries = {
  // Add your boundary functions here
  // example: readFile: async (path: string) => fs.readFile(path, 'utf-8')
}

export const description = createTask(
  schema,
  boundaries,
  async function (_argv, _boundaries) {
    const description = await runner.describe()

    console.log('description:', JSON.stringify(description, null, 2))

    return { status: 'Ok', description }
  }
)
