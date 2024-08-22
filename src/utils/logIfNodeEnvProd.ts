import { NODE_ENV } from "./config.js"

const logIfNodeEnvProd = (str: string, variable?: any) => {
  if (NODE_ENV === 'production')
    return console.log(
      str,
      variable ? variable : ''
    )
}

export default logIfNodeEnvProd
