import { dbg } from "./debug"
import { mkConfig } from "./compiler/core"
import { transpile, genTemplate } from "./compiler/parser"
import { WaxPlugin, WaxPluginConstructor } from "./plugins"
import { CoreWax } from "./plugins/core"
import * as blob from "./blob"

export = class Wax implements blob.Waxer {
    
    public configs: blob.WaxConfig
    
    public delimiter: blob.WaxDelimiter
    
    public templates: {
        [name: string]: blob.WaxTemplate
    }
    
    public tags: {
        [tag: string]: blob.WaxNode
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
        this.configs = blob.WaxConfig
        this.delimiter = blob.WaxDelimiter
        this.tags = {}
        this.plugins = {}
        this.templates = {}
    }
    
    public static global(name: string, value: any = null): any {
        return this.core.configs.context[name] = value;
    }
    
    public static directive(tag: string, descriptor: blob.WaxNode["descriptor"]): blob.WaxNode {
        return this.core.tags[tag] = {tag, descriptor}
    }
    
    public static setDelimiter(delimiter: blob.WaxDelimiter): blob.WaxDelimiter {
        return Wax.core.delimiter = delimiter
    }
    
    public static getConfigs(): blob.WaxConfig {
        return Wax.core.configs
    }
    
    public static getDelimiter(): blob.WaxDelimiter {
        return Wax.core.delimiter
    }
    
    public static getTag(tagOpts: blob.WaxTagOpts): blob.WaxNode {
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

    public static template(name: string, source: string, config: blob.WaxConfig = this.getConfigs()): blob.WaxTemplate
    {
        if(typeof source === "string") {
            this.core.templates[name] = genTemplate(
                transpile(Wax, source, mkConfig(config, Wax.getDelimiter())),
                name
            )
        }
        
        return this.core.templates[name]
    }
    
    public static resolve(selectors: string, context: blob.WaxConfig["context"] = {}, visible: boolean = true): void
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