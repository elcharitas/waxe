const WaxConfig: WaxConfig = {
    strip: true,
    throwUndefined: false,
    autoescape: true,
    context: {
        startTime: Date.now(),
        now(): number {
            return Date.now()
        }
        ,escape(text: string, strict: boolean = false){
            text = encodeHTML(text)
            if(strict === true){
                text = (escape || String)(text)
            }
            return text
        }
        ,merge(this: WaxConfig["context"], args: WaxConfig["context"][] = []): void {
            args = [].slice.call(args);
            args.forEach(arg => {
                for (let name in arg) {
                    this[name] = arg[name]
                }
            })
        }
        ,reverse(text: string, delimiter: string = ""){
            return text.split(delimiter).reverse().join(delimiter)
        }
    }
}

Object.defineProperties(WaxConfig.context, {
    merge: { writable: false, configurable: false },
    escape: { writable: false, configurable: false }
});

const WaxDelimiter: WaxDelimiter = {
    blockSyntax: "@(\\w+)(\\([^@]+\\))?",
    tagName: 1,
    argList: 2,
    endPrefix: 'end',
}

const WaxTemplate: WaxTemplate = (context: WaxConfig["context"] = {}) => null;

function mkConfig(config: WaxConfig, delimiter: WaxDelimiter): WaxConfig {
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
function encodeHTML(html: string): string {
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

export {
    WaxConfig,
    WaxTemplate,
    WaxDelimiter,
    mkConfig,
    encodeHTML
}