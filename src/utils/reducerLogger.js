import logger from "use-reducer-logger"

import { isDev } from "../config/appConfig"

const reducerLogger = (reducer) => {
  if (isDev) return logger(reducer)
  return reducer
}

export default reducerLogger
