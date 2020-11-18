import { AppHandler } from "../../utils";

const list: AppHandler = () => ({ body: "ok" });

export const Healthchecks = {
  list,
};
