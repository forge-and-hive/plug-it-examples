// TASK: description
// Run this task with:
// forge task:run runner:description

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'

import runner from '../../runner'

const schema = new Schema({})

const boundaries = {}

export const description = createTask(
  schema,
  boundaries,
  async function (_argv, _boundaries) {
    const description = await runner.describe()

    return { status: 'Ok', description }
  }
)
