// ======================================================
// 低调影视 (https://ddys.app/) — TVBox drpy 规则 (自用)
// 访问密码: ddys (低调影视的拼音缩写, 4 个小写字母)
//
// 使用说明 (网站启用了点选验证码, 只能手动过一次门):
//   1) 手机/电脑浏览器打开 https://ddys.app/ 输入密码 ddys 完成
//      点选验证进入网站;
//   2) 浏览器 F12 -> 应用/存储 -> Cookie -> ddys.app, 把全部 Cookie
//      复制到下面 userCookie 的引号内,
//      格式: 名称=值; 名称2=值2  (分号空格分隔, 一行写完)
//   3) 重新载入 TVBox 配置即可 (Cookie 会存到本地, 失效后再重填)。
// ======================================================

var rule = {
    title: 'ddys',
    host: 'https://ddys.app',
    userCookie: 'ddys_protect_9ff7a5a24e94ca3c5f214a63ee379f1f=v2%7Csite%7C1%7C1%7C1795031060%7Cdba2b9ecac8d695e3d6abec7005dd094a08212cc5c0c920b2b0f37d8e7aa1a04; _clck=rb7f2u%5E2%5Egb2%5E0%5E2506; _clsk=a4h8i%5E1794397464069%5E1%5E1%5Ea.clarity.ms%2Fcollect',
    url: '[https://ddys.app/fyclass/]https://ddys.app/fyclass/page/fypage/',
    searchUrl: 'https://ddys.app/?s=**&post_type=post',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    limit: 6,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'https://ddys.app/'
    },
    预处理: [
        'var __ck=getItem("ddys_ck","");',
        'if(!__ck&&rule.userCookie){__ck=rule.userCookie;try{setItem("ddys_ck",__ck)}catch(e){}}',
        'if(!rule.headers){rule.headers={}}',
        'if(__ck){rule.headers.Cookie=__ck}'
    ].join("\n"),
    class_parse: [
        'js:',
        'var _pa=jsp.pdfa,_ph=jsp.pdfh,_ppd=jsp.pd;',
        'var __host=(typeof HOST!=="undefined"&&HOST)?HOST:rule.host;',
        'var __ck=getItem("ddys_ck","");',
        'if(!__ck&&rule.userCookie){__ck=rule.userCookie;try{setItem("ddys_ck",__ck)}catch(e){}}',
        'if(__ck&&rule.headers){rule.headers.Cookie=__ck}',
        'var __html="";try{__html=request(__host+"/")}catch(e){__html=""}',
        'var __gated=/ddys_protect_password/.test(__html);',
        'var __out=[];',
        'if(!__html){',
        '  __out.push({type_id:"hint",type_name:"⚠️ 无法连接 ddys.app (网络或DNS问题), 请检查网络/DOH 或稍后重试"});',
        '}else if(__gated){',
        '  __out.push({type_id:"hint",type_name:"⚠️ ddys.app 需要验证:请用浏览器打开 https://ddys.app 输入密码 ddys 完成点选验证, 然后复制 Cookie 填到本规则 userCookie 并重载配置"});',
        '}else{',
        '  var __list=_pa(__html,"#primary-menu li.menu-item");',
        '  var __re=/\\.(app|pro|site|wiki|mov|tv)\\/(.*)/;',
        '  __list.forEach(function(it){',
        '    try{',
        '      var __name=_ph(it,"a&&Text").trim();',
        '      var __href=_ppd(it,"a&&href",__host);',
        '      var __mt=__href.match(__re);',
        '      if(__mt&&__mt[2]){__out.push({type_id:__mt[2].replace(/\\/+$/,""),type_name:__name})}',
        '    }catch(e2){}',
        '  });',
        '  if(!__out.length){__out.push({type_id:"hint",type_name:"⚠️ ddys.app 分类解析为空(可能已改版), 请反馈日志截图"})}',
        '}',
        'input=__out;'
    ].join("\n"),
    cate_exclude: '站长|^其他$|关于|^电影$|^剧集$|^类型$|会员|登录|播放记录|播放历史',
    play_parse: true,
    推荐: '*',
    double: true,
    一级: '.post-box-list&&article;a:eq(-1)&&Text;.post-box-image&&style;a:eq(0)&&Text;a:eq(-1)&&href',
    二级: {
        title: '.post-title&&Text;.cat-links&&Text',
        img: '.doulist-item&&img&&src',
        desc: '.published&&Text',
        content: '.abstract&&Text',
        tabs: [
            'js:',
            'var _ph=jsp.pdfh;',
            'var __d={};',
            'try{__d=JSON.parse(_ph(html,"script.ddys-playlist-data&&Html")||"{}")}catch(e){__d={}}',
            'var __ns=(__d&&__d.nodes)||[];',
            '__ns.sort(function(a,b){return ((a&&a.access)==="public"?0:1)-((b&&b.access)==="public"?0:1)});',
            'TABS=[];',
            '__ns.forEach(function(n){if(n&&n.id){TABS.push(n.label||n.id)}});',
            'if(!TABS.length){TABS=["默认线路"]}'
        ].join("\n"),
        lists: [
            'js:',
            'var _ph=jsp.pdfh;',
            'var __d={};',
            'try{__d=JSON.parse(_ph(html,"script.ddys-playlist-data&&Html")||"{}")}catch(e){__d={}}',
            'var __ns=((__d&&__d.nodes)||[]).slice();',
            '__ns.sort(function(a,b){return ((a&&a.access)==="public"?0:1)-((b&&b.access)==="public"?0:1)});',
            'var __ss=(__d&&__d.seasons)||[];',
            'var __multi=__ss.length>1;',
            'LISTS=[];',
            '__ns.forEach(function(n){',
            '  var ds=[];',
            '  __ss.forEach(function(s2){',
            '    (s2&&s2.tracks||[]).forEach(function(t){',
            '      if(!t){return}',
            '      var title=(__multi&&s2.title?s2.title+" ":"")+(t.title||((t.episode?("第"+t.episode+"集"):"正片")));',
            '      var u=(t.nodeSources&&t.nodeSources[n.id])||t[n.id]||t.src||"";',
            '      if(!u){return}',
            '      ds.push(title+"$"+play_url+urlencode(u+"|"+input));',
            '    });',
            '  });',
            '  LISTS.push(ds);',
            '});'
        ].join("\n")
    },
    lazy: [
        'js:',
        'var __host=(typeof HOST!=="undefined"&&HOST)?HOST:rule.host;',
        'var purl=input.split("|")[0];',
        'var referer=input.split("|")[1];',
        'var zm=input.split("|")[2];',
        'print("purl:"+purl);',
        'var __ua="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";',
        'if(/getvddr/.test(purl)){',
        '  var h=request(purl,{headers:{Referer:__host,"User-Agent":__ua}});',
        '  try{input={jx:0,url:JSON.parse(h).url,parse:0}}catch(e){input=purl}',
        '}else{',
        '  input={jx:0,url:purl,parse:0,header:JSON.stringify({"user-agent":__ua,"referer":__host+"/"})}',
        '}'
    ].join("\n"),
    搜索: '#main&&article;.post-title&&Text;;.published&&Text;a&&href'
};
