import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { Schema } from '@forgehive/schema';
import { type Task } from '@forgehive/task';
import { type Runner } from '@forgehive/runner';

import runner from '../runner'

const toActions = (runner: Runner) => {
  const tasks = runner.getTasks()

  const actions: Record<string, ReturnType<typeof defineAction>> = {}

  Object.keys(tasks).forEach((name) => {
    const descriptor = tasks[name]
    const task = descriptor.task
    
    const schema = task.getSchema() ?? new Schema({})
    const zodSchema = schema.asZod()
    
    actions[name] = defineAction({
      input: zodSchema,
      handler: async (input: z.infer<typeof zodSchema>) => {
        return task.run(input)
      }
    })
  })

  return actions
}

const runnerActions = toActions(runner)

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      return `Hello, ${input.name}!`
    }
  }),
  inventory: runnerActions
}