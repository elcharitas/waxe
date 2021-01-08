import Wax from "./waxe"
import { readFileSync } from "fs"

let { 2: action, 3: path } = process.argv
    ,{ version, description } = require("../package.json")
    ,{ log, error } = console
    ,parse = (src: string, pagefn: any = Wax.template("cliTest", src)) => {
        switch(action){
            case "render":
                src ? log(pagefn({})): help(action)
            break;
            case "compile":
                src ? log(pagefn.source): help(action)
            break;
            case "help":
                help(path)
            break;
            case "version":
                log(version)
            break;
            default:
                help(action)
                error("Unrecognized Command or Action!")
        }
    }
    ,help = (action?: string) => {
        let cmdHelp: { [command: string]: string } = {
            render: `[path]\tRenders a template`,
            compile: `[path]\tRenders a template`,
            version: '\tDisplays version info',
            help: '[topic]\tShows this help or help [topic]'
        }
        ,commands: string = `\nStandard Commands:\n`
        
        log(`Usage: waxe ${action||"[command]"} [path]\n`)
        log(description)
        
        for(let command in cmdHelp){
            commands += `\t${command}\t${cmdHelp[command]}\n`
        }
        
        log(commands)
    }

parse(path ? readFileSync(path).toString(): "")