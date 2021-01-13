/**
 * Encodes HTML to prevent malicious input
 *
 * @param {string} html - The suspected html
 * @returns string
 */
function encodeHTML(html: string): string {
  const encodeRules: {[x: string]: string} = {
    '&': '&#38;',
    '<': '&#60;',
    '>': '&#62;',
    '"': '&#34;',
    '\'': '&#39;',
    '/': '&#47;',
  };

  const matchHTML: RegExp = /&(?!#?\w+;)|<|>|"|'|\//g;
  
  return typeof html === 'string' ? html.replace(matchHTML, (m) => encodeRules[m] || m) : html;
}

function conflictProp(context: any, props: string[] = Object.keys(context)): void {
    const config: PropertyDescriptor = {
        writable: false,
        configurable: false
    };
    props.forEach(name => {
        Object.defineProperty(context, name, config);
    });
}

const WaxTemplate: WaxTemplate = (context: WaxContext = {}) => null;

const WaxDelimiter: WaxDelimiter = {
    blockSyntax: '@(\\w+)(\\([^@]+\\))?',
    tagName: 1,
    argList: 2,
    endPrefix: 'end'
};

/** The default configurations */
const WaxConfig: WaxConfig = {
    strip: true,
    throwUndefined: false,
    autoescape: true,
    delimiter: WaxDelimiter,
    context: {
        startTime: Date.now(),
        now(): number {
            return Date.now();
        },
        escape(text: string, strict: boolean = false): string {
            text = encodeHTML(text);
            if(strict === true){
                text = (escape || String)(text);
            }
            return text;
        },
        merge(this: WaxContext, args: WaxContext[] = []): void {
            args = [].slice.call(args);
            args.forEach(arg => {
                for (let name in arg) {
                    this[name] = arg[name];
                }
            });
        },
        reverse(text: string, delimiter: string = ''): string {
            return text.split(delimiter).reverse().join(delimiter);
        }
    }
};

/** prevent mutation */
conflictProp(WaxConfig.context);

export {
    WaxConfig,
    WaxTemplate,
    WaxDelimiter,
    encodeHTML,
    conflictProp
};