import { server } from ".";
import { expect, describe, it } from "@jest/globals";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

describe("server", () => {
  it("does not include 'x-powered-by' header", async () => {
    const res = await request(server).get("/");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.header["x-powered-by"]).toBeUndefined();
  });

  describe("/", () => {
    it("healthcheck", async () => {
      const res = await request(server).get("/");

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toEqual("ok");
    });
  });
});
