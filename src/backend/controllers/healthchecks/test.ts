import { Healthchecks } from ".";
import { expect, describe, it } from "@jest/globals";

describe("Healthchecks.list", () => {
  it('returns "ok"', async () => {
    expect(await Healthchecks.list()).toEqual({ body: "ok" });
  });
});
