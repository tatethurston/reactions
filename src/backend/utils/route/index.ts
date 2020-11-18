import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router as ExpressRouter,
} from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Promisable } from "type-fest";
import { IS_DEVELOPMENT } from "../../config";

type Response = {
  statusCode?: StatusCodes;
  body: unknown;
};

export type AppHandler = (request?: ExpressRequest) => Promisable<Response>;

type ExpressHandler = (
  request: ExpressRequest,
  response: ExpressResponse
) => void;

export function expressify(handler: AppHandler): ExpressHandler {
  return async (request, response) => {
    try {
      const res = await handler(request);
      return response.status(res.statusCode ?? StatusCodes.OK).json(res.body);
    } catch (error) {
      console.error(error);
      if (IS_DEVELOPMENT) {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error,
        });
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export function routes(
  configurator: (router: ExpressRouter) => void
): ReturnType<typeof ExpressRouter> {
  const expressRouter = ExpressRouter();
  configurator(expressRouter);
  return expressRouter;
}
