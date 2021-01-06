import { WaxConfig, WaxDelimiter, WaxTemplate } from "../blob"

export function mkConfig(config: WaxConfig, delimiter: WaxDelimiter): WaxConfig {
    let cfg: WaxConfig = WaxConfig
    cfg.delimiter = WaxDelimiter
    for(let bar in delimiter) {
        cfg.delimiter[bar] = delimiter[bar]
    }
    for(let cf in config){
        cfg[cf] = config[cf]
    }
    return cfg
}