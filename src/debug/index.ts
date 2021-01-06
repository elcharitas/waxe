import * as MessageList from "./messages.json"

const Message: {
    [type: string]: any
} = MessageList

declare var window: {
    [name: string]: any
}

export function formatDbg(name: string, args: string[]): string {
    if(Message.hasOwnProperty(name)){
        let { [name]: { [args.length - 1]: msg = '' } } = Message
        args.forEach((arg: string, index: number) => {
            msg = msg.replace(`%${index+1}`, arg?.toString())
        })
        return msg
    }
}

export function dbg(check: any, constraint: any): string {
    let args: string[] = []
        ,dbg: string
    switch(typeof check){
        case 'object':
            if (constraint && !(check instanceof constraint)) {
                dbg = "TypeError"
                args.push(check, constraint)
            }
        default:
            if (typeof check !== typeof constraint) {
                dbg = "TypeError"
                args.push(check.name || check, constraint ? typeof check : 'class', !constraint ? 'initialized' : 'declared')
            }
    }
    
    return dbg ? new (typeof global !== "undefined" ? global: window)[dbg](formatDbg(dbg, args)): null
}