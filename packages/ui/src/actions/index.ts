import { Schema } from '@forgehive/schema';
import { defineAction } from 'astro:actions';
import type Runner from '@forgehive/runner';
import type { TaskInstanceType } from '@forgehive/task';
import { z } from 'astro:schema';
import { description, runner, chat } from '@plugit/core'

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
        try {
          return task.run(input)
        } catch (error) {
          console.error(`Error running task ${name}:`, error);
          return { error: `Failed to run task: ${error.message}` };
        }
      }
    })
  })

  return actions
}

const runnerActions = runnerToActions(runner)

const descriptionAction = taskToAction(description)
const chatAction = taskToAction(chat)

export const server = {
  description: descriptionAction,
  inventory: runnerActions,
  chat: chatAction
}