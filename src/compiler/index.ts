import { WaxConfig, WaxDelimiter, WaxTemplate } from "../blob"

export function mkConfig(config: WaxConfig, delimiter: WaxDelimiter): WaxConfig {
    let cfg: WaxConfig = WaxConfig
    cfg.delimiter = WaxDelimiter
    for(let bar in delimiter) {
        cfg.delimiter[bar] = delimiter[bar]
    }
    for(let cf in config){
        cfg[cf] = config[cf]
    }
    return cfg
}

/**
 * Encodes HTML to prevent malicious input
 *
 * @param {string} html - The suspected html
 * @returns string
 */
export function encodeHTML(html: string): string {
  const encodeRules: {[x: string]: string} = {
    "&": "&#38;",
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "/": "&#47;",
  }

  const matchHTML: RegExp = /&(?!#?\w+;)|<|>|"|'|\//g
  
  return typeof html === "string" ? html.replace(matchHTML, (m) => encodeRules[m] || m) : html
}