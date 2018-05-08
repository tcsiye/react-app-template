export default {
  plugins:
  [
    'umi-plugin-dva',
    ['umi-plugin-routes', {
      exclude: [
        function({component}) {
          if(component.indexOf('page.tsx')>=0){
            return false
          }
          if(component.indexOf('Page.tsx')<0&&component.indexOf('404.tsx')<0){
            return true
          }
          //  if(component.sp)
          return false
        },
        // 忽略测试用例
        /\.test\.ts$/,
      ],
      // 暂不支持，等下个版本
      // include: [
      //   // 可以写路径，支持 glob，转换为 { path: 'user/search', exact: true, component }
      //   './src/pages/user/search.js',
      // ],
      update(routes) {
        // console.log(routes)
        return routes.map(item => {
          return {...item,path:item.path.replace('indexPage','').replace('Page','')}
        })
      },
    }]
  // ,'./plugin/umi-plugin-dva-models-tsd/index.js'
],
  // exportStatic: {},
  hashHistory: true
};
