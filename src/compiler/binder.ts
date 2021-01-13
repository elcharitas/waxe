import { WaxTemplate } from '.';

interface Function {
    bind(this: Function, thisArg: any, ...argArray: any[]): WaxTemplate;
}

export function namefn(name:string, sourceFn: WaxTemplate): WaxTemplate {
    let finalFn: WaxTemplate = new Function('call', 'return function ' + name + '(){return call(this,arguments)}')(Function.apply.bind(sourceFn));
    finalFn.source = sourceFn.source.replace('anonymous', name);
    return finalFn;
}

export function bind(parser: Wax, source: string): WaxTemplate {
    let template: WaxTemplate = null;
    
    try {
        template = new Function('out', `this.merge(arguments);out+=${source};return out`).bind(parser.getConfigs()?.context, '');
        template.source = template.toString();
    } catch(e){
        
    }
    
    return template;
}