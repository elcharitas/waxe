/**
 * Encodes JavaScript to prevent malicious input
 *
 * @param {string} js - The suspected js
 * @returns string
 */
export function encodeJS(js: string): string {
  const encodeRules: {[x: string]: string} = {
    "&": "&#38;",
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "/": "&#47;",
  }

  const matchJS: RegExp = /&(?!#?\w+;)|<|>|"|'|\//g
  
  return typeof js === "string" ? js.replace(matchJS, (m) => encodeRules[m] || m) : js
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