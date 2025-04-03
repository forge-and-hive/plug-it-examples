// TASK: chat
// Run this task with:
// forge task:run agent:chat --message "Restock 5 iphones 16 please"

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'

import { agent } from '../../lib/agent'

const schema = new Schema({
  message: Schema.string()
})

const boundaries = {
  invokeAgent: async (message: string) => {
    const inputs = { messages: [{ role: "user", content: message }] };

    const result = await agent.invoke(inputs);


    return {
      output: result.messages[result.messages.length - 1].content
    }
  }
}

export const chat = createTask(
  schema,
  boundaries,
  async function ({ message }, { invokeAgent }) {
    console.log('Message:', message)

    const result = await invokeAgent(message)

    console.log('Result:', result)

    return { status: 'Ok', output: result.output }
  }
)
