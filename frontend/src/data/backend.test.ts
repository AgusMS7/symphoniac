import { afterEach, describe, expect, it, vi } from "vitest"

describe("selector de backend", () => {
  afterEach(() => {
    vi.doUnmock("./config")
    vi.resetModules()
  })

  it("usa el backend demo cuando IS_DEMO es true", async () => {
    vi.resetModules()
    vi.doMock("./config", () => ({ IS_DEMO: true }))

    const { backend } = await import("./backend")
    const { demoBackend } = await import("./demoBackend")

    expect(backend).toBe(demoBackend)
  })

  it("usa el backend remoto cuando IS_DEMO es false", async () => {
    vi.resetModules()
    vi.doMock("./config", () => ({ IS_DEMO: false }))

    const { backend } = await import("./backend")
    const { remoteBackend } = await import("./remoteBackend")

    expect(backend).toBe(remoteBackend)
  })
})
