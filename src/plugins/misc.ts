export class MiscDirectives {
    
    [name: string]: WaxDescriptor;
    
    public includeIf(literal: WaxLiteral): string {
        return `out+=(Wax.template(${literal.arg(0)})||new Function("return ''"))(${literal.arg(1)},this);`;
    }

    public includeWhen(literal: WaxLiteral): string {
        return `out+=${literal.arg(0)}?Wax.template(${literal.arg(1)})(${literal.arg(2)},this):"";`;
    }
    
    public bind(literal: WaxLiteral): string {
        const hook: string = literal.arg(1),
            el: string = literal.arg(0);
        return `out+=this["bind${el}"]=${hook};setInterval(function(){
            document.querySelectorAll(${el}).forEach(function(hook){
                if(this["bind${el}"] !== ${hook}){
                    hook.value = this["bind${el}"] = ${hook}
                }
            })
        });`;
    }
    
    public escape(literal: WaxLiteral): string {
        return `out+=this.escape(${literal.arg(0)||literal.arg(1)});`;
    }
    
    public json(literal: WaxLiteral): string {
        return `out+=JSON.stringify${literal}`;
    }
    
    public js(): string {
        return 'var holdjs = out;';
    }
    
    public endjs(): string {
        return 'holdjs=this.reverse(out).replace(this.reverse(holdjs), "");out=this.reverse(this.reverse(out).replace(holdjs, ""));(new Function(this.reverse(holdjs))).bind(this)();delete holdjs';
    }

    public comment(literal: WaxLiteral): string {
        return `/*${literal}*/`;
    }
}