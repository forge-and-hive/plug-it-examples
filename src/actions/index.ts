import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { Schema } from '@forgehive/schema';
import { type Runner } from '@forgehive/runner';
import { type TaskInstanceType } from '@forgehive/task';

import runner from '../runner'
import { chat } from '../tasks/agent/chat'
import { description } from '../tasks/runner/description'

const taskToAction = (task: TaskInstanceType) => {
  const schema = task.getSchema() ?? new Schema({});

  return defineAction({
    input: schema.asZod(),
    handler: async (input) => {
      return task.run(input)
    }
  })
}

const runnerToActions = (runner: Runner) => {
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

const runnerActions = runnerToActions(runner)
const chatAction = taskToAction(chat)
const descriptionAction = taskToAction(description)

export const server = {
  inventory: runnerActions,
  chat: chatAction,
  description: descriptionAction
}
