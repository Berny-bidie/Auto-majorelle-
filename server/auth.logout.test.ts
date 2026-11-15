import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("auth.me", () => {
  it("returns the authenticated Supabase user exposed by the request context", async () => {
    const ctx = {
      user: { id: "user-1", email: "admin@example.com", role: "admin" },
    } as TrpcContext;

    const caller = appRouter.createCaller(ctx);

    await expect(caller.auth.me()).resolves.toEqual(ctx.user);
  });

  it("returns null when no Supabase session is present", async () => {
    const ctx = { user: null } as TrpcContext;
    const caller = appRouter.createCaller(ctx);

    await expect(caller.auth.me()).resolves.toBeNull();
  });
});
