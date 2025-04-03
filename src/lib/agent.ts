import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { tool, Tool } from "@langchain/core/tools";

import { type Task } from '@forgehive/task';
import { type Runner } from '@forgehive/runner';
import { Schema } from '@forgehive/schema';

import { LANGCHAIN_PROJECT } from './config'
import runner from '../runner'

const MODEL = 'gpt-4o-mini'

console.log('Loggint to LANGCHAIN_PROJECT', LANGCHAIN_PROJECT)
console.log('Using model', MODEL)

const model = new ChatOpenAI({ model: MODEL, temperature: 0 })

const convertTaskToTool = (descriptor: any, name: string): Tool => {
  const task = descriptor.task
  const schema = task.getSchema() ?? new Schema({})
  
  return tool(async (input) => {
    console.log('==============================================')
    console.log('Invoking tasks:', name, 'with input:', input)
    console.log('==============================================')
    const result = await task.run(input)
    console.log('==============================================')
    console.log('Result:', result)
    console.log('==============================================')
    
    return JSON.stringify(result)
  }, {
    name,
    description: task.getDescription() ?? `Execute the ${name} task`,
    schema: schema.schema,
  })
}

const toTools = (runner: Runner): Tool[] => {
  const tasks = runner.getTasks()
  const tools: Tool[] = []

  Object.keys(tasks).forEach((name) => {
    const descriptor = tasks[name]
    tools.push(convertTaskToTool(descriptor, name))
  })

  return tools
}

const tools = toTools(runner)

export const agent = createReactAgent({ 
  llm: model, 
  tools,
  prompt: `
    You are a helpful assistant that can help manage the inventory system.
    You can only answer questions with the tools provided.
  `
});