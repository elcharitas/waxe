const fs = require('fs');
const docs = require('typedoc');
const Wax = require('../lib/waxe');
const { absolutePath } = require('../lib/compiler');
const { resolve, basename, dirname } = require('path')
const glob = require('glob');
const cwd = module.path;
const cdir = process.cwd();
const srcObj = glob.sync('src/**/*.waxe', { cwd });

async function main() {
    const app = new docs.Application();
    const pages = {};
    
    app.options.addReader(new docs.TSConfigReader);
    app.options.addReader(new docs.TypeDocReader);
    
    app.bootstrap(require('./typedoc.json'));
    
    const project = app.convert();
    
    if (project) {
        const outputDir = '_dist/api';
        // this is used for special cases ;)
        process.chdir(cdir);
        await app.generateDocs(project, outputDir);
        
        Wax.setConfig('strip', false);
        Wax.directive('url', function(){
            this.context.path = absolutePath;
            return this.write(`$path(#[0], #[1] == 'asset' ? './api/assets/path/': #[1] || './')`);
        });
        srcObj.forEach(src => {
            const path = resolve(cwd, src);
            const outPath = src.replace('src', '_dist').replace('waxe', 'html');
            const tpl = Wax.template(src.replace('src/', ''), fs.readFileSync(path).toString());
            // do not output layout templates
            if(src.indexOf('src/_') !== 0) {
                const dir = dirname(outPath);
                const file = basename(outPath);
                if(!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                fs.writeFileSync(outPath, tpl({ project, file, src }));
            }
        });
    }
}

main(process.chdir(cwd)).catch(console.error);