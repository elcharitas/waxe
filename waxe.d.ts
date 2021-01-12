/**
 * Used internally to describe numbers, string and literals
 */
type NumStr = number | string | WaxLiteral;

/**
 * **Interface WaxContext**
 *
 * This is an object defining variables and macros
 */
declare interface WaxContext extends WaxCollection<NumStr|object> {
    /**
     * @returns - The current timestamp
     */
    now?(): number
    /**
     * Template macro for escaping text
     *
     * @param text - The text to escape
     * @param strict - Whether or not to apply strict parsing
     * @returns - The escaped text
     */
    escape?(text: string, strict: boolean): string;
    /**
     * Merge an array of Context objects to the current context
     *
     * @param args - The array of contexts to merged
     */
    merge?(this: WaxContext, args: WaxContext[]): void;
    /**
     * Reverses a text
     *
     * @param text - The text to reverse
     * @param delimiter - The character delimiter
     * @returns - The reversed text
     */
    reverse?(text: string, delimiter: string): string
}

/**
 * **Interface WaxConfig**
 *
 * This is an object defining compilation configurations
 */
declare interface WaxConfig extends WaxCollection<boolean|WaxContext|WaxDelimiter> {
    /**
     * Whether or not to strip line breaks and whitespace
     * 
     * @default true
     */
    strip?: boolean;
    /**
     * Whether or not to catch undefined contexts/directives
     * 
     * @default false
     */
    throwUndefined?: boolean;
    /**
     * Whether or not to escape outputs
     *
     * @default true
     */
    autoescape?: boolean;
    /**
     * The current context
     *
     * @default WaxContext
     */
    context?: WaxContext;
    /**
     * Delimiter for matching blocks
     *
     * @default WaxDelimiter
     */
    delimiter?: WaxDelimiter;
}

/**
 * **Interface WaxDelimiter**
 *
 * This is a record defining how templates are parsed
 */
declare interface WaxDelimiter extends WaxCollection<any> {
    /**
     * RegExp Pattern String to match blocks.
     * 
     * @example `"(pattern)"`
     * @default `"@(\\w+)(\\([^@+]\\))"`
     */
    blockSyntax?: string;
    /**
     * Position of tagName in RegExpMatchArray of `blockSyntax`
     *
     * @default 1
     */
    tagName?: number;
    /**
     * Position of the optional arguments record
     *
     * @default 2
     */
    argrecord?: number;
    /**
     * A string to determine end of a block by it tagName
     * Set as null to disable this
     *
     * @default `"end"`
     */
    endPrefix?: string;
}

/**
 * **Interface WaxTemplate**
 *
 * This is a function called to render a resolved template
 */
declare interface WaxTemplate extends Function {
    /**
     * Generated precompiled template function
     *
     * @param scopes - Scopes to merge
     * @returns - The rendered template
     */
    (...scopes: WaxContext[]): string;
    /**
     * @returns - The source value of the template
     */
    source?: string;
}

/**
 * **Interface WaxPlugin**
 *
 * This is a class describing what should be loaded into the context globally
 */
declare interface WaxPlugin {
    /**
     * @var - Collection of descriptors to be loaded as directives
     */
    directives?: WaxCollection<WaxDescriptor>
}

/**
 * **Interface WaxPluginConstruct**
 * 
 * This is used to create a new plugin class
 */
declare interface WaxPluginConstruct {
    /**
     * Create new Instance of the plugin
     *
     * @param Wax - The Wax Singleton
     */
    new(Wax: Wax): WaxPlugin;
    /** @internal */
    prototype: WaxPlugin;
}

/**
 * **Interface WaxTagOpts**
 *
 * This is a record of tag options used to generate/find it
 */
declare interface WaxTagOpts extends WaxCollection<NumStr|WaxConfig|WaxContext|WaxDescriptor> {
    /**
     * The tag name to match
     */
    tag?: string;
    /**
     * The retrieved args
     */
    argLiteral?: WaxLiteral;
    /**
     * The current block being traversed
     */
    block?: string;
    /**
     * Current Configuration options
     */
    configs?: WaxConfig;
    /**
     * The current context
     */
    context?: WaxContext;
}

/**
 * **Interface WaxLiteral**
 *
 * This is a string with mutable characteristics that resolves to an array
 */
declare interface WaxLiteral extends String {
    /**
     * Used to fetch an arg by its `position: key`
     *
     * @param key - The position of the arg
     * @returns - A literal string wrapped to expose the arg
     */
    arg?(key: number): string;
    /**
     * @returns - The literal string
     */
    text?(): string;
    /**
     * @returns - A parsed literal for further processing
     */
    parse?(): string;
}

/**
 * **Interface WaxNode**
 *
 * This is an object declaring a directive
 */
declare interface WaxNode extends WaxTagOpts {
    /**
     * The source of the parsed Node
     */
    source?: string;
    /**
     * The position from which the node is describing
     */
    position?: number;
    /**
     * The function used in describing the current node
     */
    descriptor?: WaxDescriptor;
}

/**
 * **Interface WaxDescriptor**
 * 
 * This is a special function which parses a node using its literal
 */
declare interface WaxDescriptor {
    /**
     * Parse the node and resolve
     *
     * @param literal - The argLiteral for the current node
     * @returns - The resolved string
     */
    (this: WaxNode, literal?: WaxLiteral): string;
    /** @internal */
    prototype: Function;
}

/**
 * **Interface WaxTreeRoot**
 *
 * This is required internally while traversing
 */
declare interface WaxTreeRoot extends WaxDelimiter {
    /**
     * The source text to parse
     */
    text?: string;
    /**
     * A list of directives matched from source text
     */
    directives?: RegExpMatchArray;
}

/**
 * **Interface WaxWalker**
 *
 * This is used to traverse a source text and resolve its node
 */
declare interface WaxWalker extends WaxTreeRoot, WaxTagOpts {
    /**
     * Start walking through the source text's Nodes
     *
     * @returns - The resolved text
     */
    walk(): string;
    /**
     * Creates the literal for each Node
     *
     * @returns - The literal string
     */
    toArgs(argrecord: string): WaxLiteral;
    /**
     * Checks if the `tagName` can end the block
     *
     * @returns - `false` if `tagName` can't end a block
     */
    isBlockEnd(tagName: string): boolean;
}

declare interface WaxConstruct {
    configs?: WaxConfig;
    delimiter?: WaxDelimiter;
    templates?: WaxCollection<WaxTemplate>
}

/**
 * **Interface Wax**
 * 
 * This is the heart of Waxe and is instantiated only once.
 * 
 * It includes the necessary static methods to get your app running.
 */
declare interface Wax {
    /** @internal */
    prototype: WaxConstruct;
    /**
     * Gets or sets the Wax Instance
     */
    core?: WaxConstruct;
    /**
     * Assigns a value to a variable globally
     * 
     * **Example**
     * ```js
     * Wax.global('monkey', 'Buboo');
     * ```
     * Now you can use it in any template
     * ```waxe
     * @yield($monkey)
     * ```
     *
     * @param name - The Name of new variable
     * @param value - Value to be assigned
     * @returns - The assigned value
     */
    global(name: string, value: any): any;
    /**
     * Create a new directive
     * 
     * **Example**
     * ```js
     * Wax.directive('monkey', function(){
     *      return 'prompt("I am a monkey!");'
     * });
     * ```
     * Now it can be used in a template
     * ```waxe
     * @monkey
     * ```
     *
     * @param tagName - The name of the directive
     * @param descriptor - The directive's descriptor
     * @returns - The created node for type checks
     */
    directive(tagName: string, descriptor: WaxDescriptor): WaxNode;
    /**
     * Creates a template using its `name` and `source` text
     * Can also be used to get a template by using the name only
     *
     * **Example**
     * ```js
     * var tpl = Wax.template('hello.waxe', '@yield("Hello")');
     * tpl === Wax.template('hello.waxe') // true
     * ```
     * 
     * @param name - The name of the template
     * @param source - The source text for the template
     * @returns - The resolved {@link WaxTemplate|template function}
     */
    template(name: string, source?: string): WaxTemplate;
    /**
     * Gets the {@link WaxConfig | configuration options}
     */
    getConfigs(): WaxConfig;
    /**
     * Gets the {@link WaxDelimiter|delimiter}
     */
    getDelimiter(): WaxDelimiter;
    /**
     * Get a directive/creates a fake using its options
     *
     * @param tagOpts - A convienent match of tag options to search
     * @returns - The directive node
     */
    getTag(tagOpts?: WaxTagOpts): WaxNode;
}

/**
 * **Interface WaxCollection**
 * 
 * This is used internally to create a record using a specified type
 *
 * @typeParam WaxType - The type to use for values
 */
declare interface WaxCollection<WaxType> {
    /**
     * @returns The Collection's Type Value or undefined
     */
    [name: string]: WaxType | undefined;
}

/**
 * waxe module
 * 
 * This is the module exports Wax class, which must be default imported.
 * 
 * This export is assignment based and as such the `--esModuleInterop` flag must be enabled before Waxe can be default imported and use
 */
declare module "waxe" {
    const Wax: Wax;
    export = Wax;
}