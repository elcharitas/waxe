import * as MessageList from "./messages.json"

const Message: {
    [type: string]: any
} = MessageList

export const debugkit: {
    [name: string]: any
} = typeof global !== "undefined" ? global : window

export function debugProp(object: any, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, property)
}

export function dbgType(args: string[], constraint: any, expected: any): string[] {
    
    if(typeof constraint !== typeof expected){
        args.push(typeof expected)
    }
    
    if(typeof constraint === "undefined" && typeof expected === "object"){
        args.push("initialized")
    } else if(typeof expected !== "object"){
        args.push("declared")
    }
    
    return args
}

export function formatDbg(name: string, args: string[]): string {
    if(debugProp(Message, name)){
        let { [name]: { [args.length - 2]: msg = '' } } = Message
        args.forEach((arg: string, index: number) => {
            msg = msg.replace(`%${index+1}`, arg?.toString())
        })
        return msg
    }
}

export function dbg(check: any, constraint: any, expected: any = {}, dbgFor: string = "Type"): void {
    let args: string[] = []
        ,debugArg: string = check?.toString()
        ,debugStack: typeof Error = null
    
    dbgFor += "Error"
    
    if(debugProp(debugkit, dbgFor)){
        args = dbgType([check], constraint, expected)
        debugStack = debugkit[dbgFor]
        debugArg = formatDbg(dbgFor, args)
    }
    
    if(args.length > 1 && debugStack !== null){
        throw new debugStack(debugArg)
    }
}