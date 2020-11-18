import { Request, Response } from "express";
import { expect, describe, it } from "@jest/globals";
import { expressify } from ".";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import * as config from "../../config";

describe("expressify", () => {
  const mockRequest = {} as Request;
  const mockResponse = ({
    status: jest.fn(() => mockResponse),
    json: jest.fn(() => mockResponse),
  } as unknown) as Response;

  beforeEach(() => {
    (mockResponse.status as jest.Mock).mockClear();
    (mockResponse.json as jest.Mock).mockClear();
  });

  it("synchronous handlers", async () => {
    const handler = () => ({ body: true });

    expressify(handler)(mockRequest, mockResponse);
    await Promise.resolve();
    expect(mockResponse.json).toBeCalledWith(true);
  });

  it("asynchronous handlers", async () => {
    const handler = () => Promise.resolve({ body: true });

    expressify(handler)(mockRequest, mockResponse);
    await Promise.resolve();
    expect(mockResponse.json).toBeCalledWith(true);
  });

  describe("response status code", () => {
    it("defaults to OK", async () => {
      const handler = () => ({ body: true });

      expressify(handler)(mockRequest, mockResponse);
      await Promise.resolve();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.status).toBeCalledWith(StatusCodes.OK);
    });

    it("can be set", async () => {
      const handler = () => ({ body: true, statusCode: StatusCodes.NOT_FOUND });

      expressify(handler)(mockRequest, mockResponse);
      await Promise.resolve();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.status).toBeCalledWith(StatusCodes.NOT_FOUND);
    });
  });

  describe("errors", () => {
    let mockConsoleError: jest.SpyInstance;
    beforeEach(() => {
      mockConsoleError = jest
        .spyOn(console, "error")
        .mockImplementationOnce(() => false);
    });

    it("responds with error when config.IS_DEVELOPMENT is true", async () => {
      const mockError = new Error("Oh No");
      const handler = () => {
        throw mockError;
      };

      expressify(handler)(mockRequest, mockResponse);
      await Promise.resolve();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.status).toBeCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(mockResponse.json).toBeCalledWith({
        error: mockError,
      });
      expect(mockConsoleError).toBeCalledWith(mockError);
    });

    it("responds with generic error when config.IS_DEVELOPMENT is false", async () => {
      // eslint-disable-next-line
      (config as any).IS_DEVELOPMENT = false;
      const mockError = new Error("Oh No");
      const handler = () => {
        throw mockError;
      };

      expressify(handler)(mockRequest, mockResponse);
      await Promise.resolve();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.status).toBeCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(mockResponse.json).toBeCalledWith({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
      expect(mockConsoleError).toBeCalledWith(mockError);
      // eslint-disable-next-line
      (config as any).IS_DEVELOPMENT = true;
    });
  });
});
