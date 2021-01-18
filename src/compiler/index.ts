import { debug } from '../debug';

function conflictProp<T extends Record<string, unknown>>(context: T, props: Array<keyof T> = Object.keys(context)): T {
    const config: PropertyDescriptor = {
        writable: false,
        configurable: false
    };
    props.forEach(name => {
        Object.defineProperty(context, name, config);
    });
    return context;
}

/** fail safe template function */
const WaxTemplate: WaxTemplate = () => '';

/** The default delimiter */
const WaxDelimiter: WaxDelimiter = conflictProp({
    blockSyntax: /@(\w+)(\([^@]+\))?/,
    tagName: 1,
    argList: 2,
    endPrefix: 'end'
}, ['endPrefix']);

/** The default configurations */
const WaxConfig: WaxConfig = {
    strip: true,
    debug: false,
    autoescape: true,
    delimiter: WaxDelimiter,
    context: conflictProp({
        /** Time the context was resolved. This may be off by a few ms */
        startTime: Date.now(),
        /** Returns JSON string representation of object */
        json: JSON.stringify,
        /** Returns current timestamp */ 
        now: Date.now,
        /**
         * Encodes HTML to prevent malicious input
         *
         * @param {string} html - The suspected html
         * @returns string
         */
        escape(html: string): string {
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
        },
        /**
         * Merges an array of contexts into current context
         *
         * @param args - The array of context to merge with
         */
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
        /**
         * Reverses a string
         *
         * @param text - The string to reverse
         * @param delimiter - The character delimiter to use
         * @returns - The reversed string
         */
        reverse(text: string, delimiter = ''): string {
            return text.split(delimiter).reverse().join(delimiter);
        },
        template(id: string, context: WaxContext = {}, safe: boolean): string {
            const template = require('../waxe').template(id);
            if(safe !== true && !template) {
                debug(`can't extend ${id}!`, template, WaxTemplate);
            }
            return (template || WaxTemplate)(context);
        }
    })
};

export {
    WaxConfig,
    WaxTemplate,
    WaxDelimiter
};