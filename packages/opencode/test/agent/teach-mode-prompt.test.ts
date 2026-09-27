import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { expect, describe } from "bun:test"
import { Effect } from "effect"
import { Agent } from "../../src/agent/agent"
import { testEffect } from "../lib/effect"

const it = testEffect(LayerNode.compile(Agent.node))

describe("Teach Mode - System Prompt", () => {
  it.instance("teach agent has a dedicated system prompt", () =>
    Effect.gen(function* () {
      const agent = yield* Agent.use.get("teach")

      expect(agent.prompt).toBeDefined()
      expect(agent.prompt!.length).toBeGreaterThan(0)
    }),
  )

  it.instance("prompt instructs the model to teach rather than solve", () =>
    Effect.gen(function* () {
      const agent = yield* Agent.use.get("teach")
      const prompt = agent.prompt?.toLowerCase() ?? ""

      // Should never just hand over a complete, ready-to-run solution unprompted
      expect(prompt).toContain("do not provide a complete")
      // Should push the learner to attempt the problem themselves
      expect(prompt).toContain("attempt")
      // Should use guiding questions (Socratic method) rather than lecturing
      expect(prompt).toContain("socratic")
      // Should break problems down incrementally
      expect(prompt).toContain("one step at a time")
      // Should check the learner's understanding before moving on
      expect(prompt).toContain("check")
    }),
  )
})
