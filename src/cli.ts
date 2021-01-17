import Wax from './waxe';
import { readFileSync } from 'fs';

const { 2: action, 3: path } = process.argv,
    { log, error } = console,
    version = '0.0.6',
    description = 'Waxe CLI Tool',
    cmdHelp: { [command: string]: string } = {
        render: `[path]\tRenders a template`,
        compile: `[path]\tRenders a template`,
        version: '\tDisplays version info',
        help: '[topic]\tShows this help or help [topic]'
    },
    parse = (src: string, pagefn: WaxTemplate = Wax.template('cliTest', src)) => {
        switch(action){
        case 'render':
            src ? log(pagefn({})): help(action);
            break;
        case 'compile':
            src ? log(pagefn.toString()): help(action);
            break;
        case 'help':
            help(path);
            break;
        case 'version':
            log(version);
            break;
        default:
            help(action);
            error('Unrecognized Command or Action!');
        }
    },
    help = (action?: string) => {
        let commands = `\nCommands:\n`;
        
        log(`Usage: waxe ${action||'[command]'} [path]\n`);
        log(description);
        
        for(const command in cmdHelp){
            commands += `\t${command}\t${cmdHelp[command]}\n`;
        }
        
        log(commands);
    };

parse(path ? readFileSync(path).toString(): '');