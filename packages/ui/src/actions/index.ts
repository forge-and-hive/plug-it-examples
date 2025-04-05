import { Schema } from '@forgehive/schema';
import { defineAction } from 'astro:actions';

import type { TaskInstanceType } from '@forgehive/task';
import { description } from '@plugit/core'

const taskToAction = (task: TaskInstanceType) => {
  const schema = task.getSchema() ?? new Schema({});

  return defineAction({
    input: schema.asZod(),
    handler: async (input) => {
      return task.run(input)
    }
  })
}

const descriptionAction = taskToAction(description)

export const server = {
  description: descriptionAction
}