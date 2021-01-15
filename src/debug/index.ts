const debugMessages: string[] = [
    "%1 should be %2 as %3",
    "%1 should be %3 as a %2"
];

const debugStack: typeof Error = TypeError;

function debugType(args: string[], constraint: any, expected: any): string[] {
    const expectedType: string = typeof expected;
    
    if(typeof constraint !== expectedType){
        args.push(expected?.name || expectedType);
    }
    
    if(typeof constraint === 'undefined' && expectedType === 'object'){
        args.push('initialized');
    } else if(expectedType !== 'object' || expected === null && constraint !== null){
        args.push(expectedType);
        args.push('declared');
    }
    
    return args;
}

export function debugProp(object: any, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function dbg(check: any, constraint?: any, expected: any = {}): void {
    let args: string[] = debugType([check], constraint, expected),
        dbgFor: string = '',
        { [args.length - 2]: debugInfo = 'Unknown' } = debugMessages;
    args.forEach((arg: string, index: number) => {
        debugInfo = debugInfo.replace(`%${index+1}`, arg);
    });
    if(args.length > 1 && debugStack !== null){
        throw new debugStack(debugInfo);
    }
}