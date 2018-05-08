import { readFileSync, writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import globby from 'globby';



export default function(api) {
    const { paths } = api.service;
    // api.registerCommand('command', fn);
    // console.log(api)
    // api.register('modifyPageWatchers', function(a){
    //     // console.log(api)
    //     let watchers = [...a.memo,'/Users/emiya/xxfworks/umi-ts/plugin']
    //     return watchers
    // })
    function getModels() {
        const pattern = '**/models/*.{ts,js}';
        const modelPaths = globby.sync(pattern, {
          cwd: paths.absSrcPath,
        });
        // console.log(modelPaths)
        return modelPaths
          .map(path =>
        {
            const pathArr = path.split('/')
            console.log(paths.absSrcPath+path)
            // const txt = readFileSync(paths.absSrcPath+path,'utf-8')
            // console.log(txt.indexOf('/**'))
            // console.log(txt.indexOf('*/')+1)
            // const cox = txt.slice(txt.indexOf('/**'),txt.indexOf('*/')+2)
            // console.log(cox)
            const pathName = pathArr[pathArr.length-1].split('.')[0]
            return `${pathName}: any`
        }
          )
          .join('\r\n');
      }
    api.register('generateFiles', (a,b) => {
            const { paths } = api.service;
            // getModels()
            const dvaContainerPath = `${paths.absSrcPath}/declare/modelState.d.ts`;
    const tplContent =
`interface ModelState {
    ${getModels()}
}
 export default ModelState;`

            writeFileSync(dvaContainerPath,tplContent, 'utf-8')
        console.log(a)
        console.log(b)
      });

    api.register('onCompileDone',()=>{
        console.log(12121)
    })
  }
