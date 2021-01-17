export class MiscDirectives {
    
    [name: string]: WaxDescriptor;

    /**
     * Includes a template if it exists only
     */
    public includeIf(this: WaxNode): string {
        return this.write(`$template(#[0],#[1],!0)`);
    }

    /**
     * Includes a template when a condition is met
     */
    public includeWhen(this: WaxNode): string {
        return this.write(`#[0]?$template(#[1],#[2]):''`);
    }
    
    /**
     * Escapes a given text for malicious inputs
     */
    public escape(this: WaxNode): string {
        return this.write(`$escape(#[0]||#[1])`);
    }

    /**
     * Outputs the JSON representation of any value
     */
    public json(this: WaxNode, literal: WaxLiteral): string {
        return this.write(`$json${literal}`);
    }

    /**
     * Run good old javascript in a template
     */
    public js(): string {
        return 'var hjs=out;';
    }

    /**
     * Closes and evaluates the js directive
     */
    public endjs(this: WaxNode): string {
        return this.exec(`hjs=$reverse(out).replace($reverse(hjs),"");out=$reverse($reverse(out).replace(hjs,""));(new Function($reverse(hjs))).bind(this)();delete hjs`);
    }
    
    /**
     * Binds an element to a value
     * 
     * @deprecated This directive stopped working as expected in v0.0.7 hence support is dropped. It will be removed in v0.1
     */
    public bind(this: WaxNode): string {
        return this.write(`$["bind"+#[0]]=#[1];setInterval(function(){document.querySelectorAll(#[0]).forEach(function(hook){if($["bind"+#[0]]!==#[1]){hook.value = this["bind"+#[0]]=#[1]}})})`);
    }
}