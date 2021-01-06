import { dbg } from "./debug"
import { mkConfig } from "./compiler/core"
import { transpile, genTemplate } from "./compiler/parser"
import { Wax, WaxTemplate, WaxDelimiter, WaxConfig, WaxNode, WaxTagOpts } from "./blob"
import { WaxPlugin, WaxPluginConstructor } from "./plugins"
import { CoreWax } from "./plugins/core"

export = class Wax implements Wax {
    
    public configs: WaxConfig
    
    public delimiter: WaxDelimiter
    
    public templates: {
        [name: string]: WaxTemplate
    }
    
    public tags: {
        [tag: string]: WaxNode
    }

    public plugins: {
        [label: string]: WaxPlugin
    }

    private static _core?: Wax

    private constructor()
    {
        if(typeof this !== "object") {
            throw dbg("Wax", this)
        }
        this.configs = WaxConfig
        this.delimiter = WaxDelimiter
        this.tags = {}
        this.plugins = {}
        this.templates = {}
    }
    
    public static setDelimiter(delimiter: WaxDelimiter): WaxDelimiter {
        return Wax.core.delimiter = delimiter
    }
    
    public static getDelimiter(): WaxDelimiter {
        return Wax.core.delimiter
    }
    
    public static getConfigs(): WaxConfig {
        return Wax.core.configs
    }
    
    public static directive(tag: string, descriptor: WaxNode["descriptor"]): WaxNode {
        return this.core.tags[tag] = {tag, descriptor}
    }
    
    public static global(name: string, value: any = null): any{
        return this.core.configs.context[name] = value;
    }
    
    public static getTag(tagOpts: WaxTagOpts): WaxNode {
        let tagDef = this.core.tags[tagOpts.tag] || null
        if(typeof tagDef === "object" && tagDef !== null){
            for (let def in tagOpts) {
                tagDef[def] = tagOpts[def]
            }
        }
        return tagDef
    }
    
    public static addPlugin(classLabel: WaxPluginConstructor){
        let { directives = {} } = new classLabel(this)
        for (let tag in directives) {
            this.directive(tag, directives[tag])
        }
    }

    public static template(name: string, text: string, config: WaxConfig = this.getConfigs()): WaxTemplate
    {
        if(typeof text === "string") {
            return this.core.templates[name] = genTemplate(
                transpile.call(Wax, text, mkConfig(config, Wax.getDelimiter())),
                name
            )
        } else {
            throw dbg("text", text)
        }
    }
    
    public static resolve(selectors: string, context: WaxConfig["context"] = {}, visible: boolean = true): void
    {
        if(typeof document !== "undefined"){
            document.querySelectorAll(selectors).forEach((element: any) => {
                element.innerHTML = element.value = Wax.template(element.id, element.value||element.innerHTML)(context)
                if('hidden' in element) element.hidden = !visible
            })
        }
    }

    /**
     * Gets or Creates the Wax instance
     *
     * @returns Wax
     */
    public static get core(){
        if(!(this._core instanceof Wax)){
            this._core = new Wax
            Wax.addPlugin(CoreWax)
        }
        return this._core
    }
}
