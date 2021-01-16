import { dbg } from '../debug';

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

    const matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
  
    return typeof html === 'string' ? html.replace(matchHTML, (m) => encodeRules[m] || m) : html;
}

function conflictProp(context: Record<string, unknown>, props: string[] = Object.keys(context)): void {
    const config: PropertyDescriptor = {
        writable: false,
        configurable: false
    };
    props.forEach(name => {
        Object.defineProperty(context, name, config);
    });
}

const WaxTemplate: WaxTemplate = () => '';

const WaxDelimiter: WaxDelimiter = {
    blockSyntax: /@(\w+)(\([^@]+\))?/,
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
        json: JSON.stringify,
        escape: encodeHTML,
        now: Date.now,
        merge(this: WaxContext, args: WaxContext[] = []): void {
            args = [].slice.call(args);
            args.forEach(arg => {
                for (const name in arg) {
                    if(!(name in this) || Object.getOwnPropertyDescriptor(this, name).configurable === true){
                        this[name] = arg[name];
                    }
                }
            });
        },
        reverse(text: string, delimiter = ''): string {
            return text.split(delimiter).reverse().join(delimiter);
        },
        template(name: string, context: WaxContext = {}, safe = false): string {
            const template: WaxTemplate = require("../waxe").template(name);
            if(safe === false && !template) {
                dbg(template, WaxTemplate);
            }
            return (template || WaxTemplate)(context);
        }
    }
};

/** prevent mutation */
conflictProp(WaxConfig);
conflictProp(WaxConfig.context);

export {
    WaxConfig,
    WaxTemplate,
    WaxDelimiter,
    encodeHTML,
    conflictProp
};