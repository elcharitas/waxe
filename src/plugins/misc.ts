export class MiscDirectives {
    
    [name: string]: WaxDescriptor;

    public includeIf(this: WaxNode): string {
        return this.write(`$template(#[0],#[1],1)`);
    }

    public includeWhen(this: WaxNode): string {
        return this.write(`#[0]?$template(#[1],#[2]):''`);
    }
    
    public bind(this: WaxNode): string {
        return this.write(`$["bind"+#[0]]=#[1];setInterval(function(){document.querySelectorAll(#[0]).forEach(function(hook){if($["bind"+#[0]]!==#[1]){hook.value = this["bind"+#[0]]=#[1]}})})`);
    }
    
    public escape(this: WaxNode): string {
        return this.write(`$escape(#[0]||#[1])`);
    }
    
    public json(this: WaxNode, literal: WaxLiteral): string {
        return this.write(`$json${literal}`);
    }
    
    public js(): string {
        return 'var hjs=out;';
    }
    
    public endjs(this: WaxNode): string {
        return this.exec(`hjs=$reverse(out).replace($reverse(hjs),"");out=$reverse($reverse(out).replace(hjs,""));(new Function($reverse(hjs))).bind(this)();delete hjs`);
    }
}