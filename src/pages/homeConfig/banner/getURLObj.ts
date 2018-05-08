export default {
  getURLObj(input) {
    if (!input) {
      return '';
    }
    const str = input.substring(input.indexOf('=') + 1);
    // tslint:disable-next-line:no-var-keyword
    var obj = {};
    try {
      obj = JSON.parse(decodeURIComponent(str));
    // tslint:disable-next-line:no-empty
    } catch (e) {}
    const type = '';
    // tslint:disable-next-line:no-var-keyword
    var Info = null;
    const listArr = [
      { name: 'brand', desc: '品牌' },
      { name: 'series', desc: '系列' },
      { name: 'type', desc: '类型' },
      { name: 'name', desc: '名字' },
      { name: 'tag', desc: '标签' },
      { name: 'lower', desc: '首付下限(单位:分)' },
      { name: 'upper', desc: '首付上限(单位:分)' }
    ];

    if (input.indexOf('/itemList') !== -1) {
      Info = obj;
      Info.typeName = '商品列表';
      Info.msgList = [];
      for (const key in Info) {
        if (key !== 'typeName' && key !== 'trackValue') {
          // tslint:disable-next-line
          for (var i = 0; i < listArr.length; i++) {
            if (listArr[i].name === key) {
              Info.msgList.push(listArr[i].desc + '：' + Info[key]);
            }
          }
        }
      }
      if (Info.trackValue) {
        Info.msgList.push('打点值：' + Info.trackValue);
      }
    } else if (input.indexOf('/itemDetail') !== -1) {
      Info = obj;
      Info.typeName = '商品详情';
      Info.msgList = [];
      if (Info.id) {
        Info.msgList.push('车辆id：' + Info.id);
      }
      if (Info.trackValue) {
        Info.msgList.push('打点值：' + Info.trackValue);
      }
    } else if (input.indexOf('/webview') !== -1) {
      Info = obj;
      Info.typeName = 'web容器';
      Info.msgList = [];
      if (Info.needUserInfo) {
        Info.msgList.push('userid：' + Info.needUserInfo);
      }
      if (Info.title) {
        Info.msgList.push('标题：' + Info.title);
      }
      if (Info.trackValue) {
        Info.msgList.push('打点值：' + Info.trackValue);
      }
      if (Info.url) {
        Info.msgList.push('链接：' + Info.url.trim());
      }
    }
    return Info || null;
  }
};
