/** Some common Debug Nesaages */
const debugMessages: string[] = [
    '%1 should be %2 as %3',
    '%1 should be %3 as a %2'
];

/** We'd only be throwing TypeErrors */
const debugStack: typeof Error = TypeError;

/**
 * Generate Debug args by debugging the type of the constraint
 *
 * @param args - default args
 * @param constraint - The variable to test
 * @param expected - The value to test with
 * @returns - An array of arguments generated
 */
function debugType(args: string[], constraint: any, expected: any): string[] {
    const expectedType: string = typeof expected;
    
    if(typeof constraint !== expectedType){
        args.push(expected?.name || expectedType);
    }
    
    if(typeof constraint === 'undefined' && expectedType === 'object'){
        args.push('initialized');
    }
    else if(expectedType !== 'object' || (expected === null && constraint !== null)){
        args.push(expectedType);
        args.push('declared');
    }
    
    return args;
}

export function debugProp(object: any, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function extendProp(object: any, constraint: any): any {

    Object.defineProperty(object, 'prototype', {
        value: { ...object.prototype, ...(constraint.prototype||constraint) }
    });
    
    return object;
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