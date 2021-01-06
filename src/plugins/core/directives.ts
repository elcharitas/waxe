
import { WaxNode, WaxLiteral } from "../../blob"

export class CoreDirectives {
    
    [directive: string]: WaxNode["descriptor"]

    public elseif(literal: WaxLiteral): string {
        return `} else if(${literal}) {`
    }

    public else(): string {
        return "} else {"
    }

    public switch(literal: WaxLiteral): string {
        return `switch${literal}{/*`
    }

    public case(literal: WaxLiteral): string {
        return `*/case ${literal}:`
    }

    public break(){
        return 'break;/*'
    }

    public endswitch(): string {
        return '*/}'
    }
    
    public define(literal: WaxLiteral): string {
        return `scope[${literal.arg(0)}] = ${literal.arg(1)}`
    }

    public yield(literal: WaxLiteral): string {
        return 'out+='+literal.arg(0)
    }

    public bind(literal: WaxLiteral): string {
        let hook: string = literal.arg(1)
            ,el: string = literal.arg(0)
        return `out+=this["bind${el}"]=${hook};setInterval(function(){
            document.querySelectorAll(${el}).forEach(function(hook){
                if(this["bind${el}"] !== ${hook}){
                    hook.value = this["bind${el}"] = ${hook}
                }
            })
        })`
    }

    public comment(literal: WaxLiteral): string {
        return '/*'+literal.arg(0)+'*/'
    }
}