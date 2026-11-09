// ======================================================
// 低调影视 (https://ddys.app/) — TVBox drpy 规则 (自用)
// 访问密码: ddys (低调影视的拼音缩写, 4 个小写字母)
//
// 使用说明:
//   1) 规则启动时会先尝试自动通过 ddys.app 的访问门槛(ALTCHA/PoW);
//   2) 如果网站后续加强了点选验证码, 自动过门可能失败——请按以下步骤
//      手动填 Cookie:
//        1. 手机/电脑浏览器打开 https://ddys.app/ 输入密码 ddys 完成
//           点选验证;
//        2. 浏览器里按 F12 -> 应用 -> Cookie -> ddys.app, 复制全部
//           Cookie, 粘贴到下面 USER_COOKIE,
//           格式: 名称=值; 名称2=值2  (分号空格分隔, 一行写完)
// ======================================================

var USER_COOKIE = "";

var rule = {
    title: 'ddys',
    host: 'https://ddys.app',
    url: '/fyclass/page/fypage/',
    searchUrl: '/?s=**&post_type=post',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    limit: 6,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'https://ddys.app/'
    },
    // 载入时: 优先用本地存储里成功过门的 Cookie, 其次用 USER_COOKIE
    预处理: [
        'js:',
        'var __ck=getItem("ddys_ck","");',
        'if(!__ck&&typeof USER_COOKIE!=="undefined"&&USER_COOKIE){__ck=USER_COOKIE;try{setItem("ddys_ck",__ck)}catch(e){}}',
        'if(!rule.headers){rule.headers={}}',
        'if(__ck){rule.headers.Cookie=__ck}'
    ].join(""),
    class_parse: [
        'js:',
        'var __host=(typeof HOST==="string"&&HOST)?HOST:rule.host;',
        'var __ck=getItem("ddys_ck","");',
        'var __html="";try{__html=request(__host+"/")}catch(e){__html=""}',
        'var __gated=/ddys-protect|ddys_protect_password/.test(__html);',
        'if(__gated&&!__ck&&typeof CryptoJS!=="undefined"&&CryptoJS.SHA256){',
        '  try{',
        '    var __f=function(n){var qq=String.fromCharCode(34);var m=__html.match(new RegExp("name"+qq+n+qq+"[^>]*value"+qq+"([^"+qq+"]*)"+qq));return m?m[1]:""};',
        '    var __ch=JSON.parse(request(__host+"/wp-json/ddys-protect/v1/gatecha/challenge",{headers:{"User-Agent":"MOBILE_UA"}}));',
        '    var __s=0;var __sol=-1;',
        '    var __max=Number(__ch.maxNumber||580000);',
        '    for(__s=0;__s<=__max;__s++){if(CryptoJS.SHA256(String(__ch.salt)+__s).toString()===String(__ch.challenge)){__sol=__s;break}}',
        '    if(__sol>=0){',
        '      var __pay=base64Encode(JSON.stringify({algorithm:__ch.algorithm,challenge:__ch.challenge,number:__sol,salt:__ch.salt,signature:__ch.signature,taken:Date.now()}));',
        '      var __body="ddys_protect_password=ddys&ddys_protect_company=&ddys_protect_started="+__f("ddys_protect_started")+"&ddys_protect_started_sig="+__f("ddys_protect_started_sig")+"&ddys_protect_click_points=&ddys_protect_captcha_token="+__f("ddys_protect_captcha_token")+"&ddys_protect_action=gate_login&redirect_to=https%3A%2F%2Fddys.app%2F&ddys_protect_nonce="+__f("ddys_protect_nonce")+"&_wp_http_referer=%2F&ddys_protect_altcha_gate="+encodeURIComponent(__pay);',
        '      var __resp=request(__host+"/",{method:"POST",body:__body,headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"MOBILE_UA","Referer":__host+"/"},withHeaders:true});',
        '      var __j=JSON.parse(__resp);',
        '      var __raw=(__j["set-cookie"]||__j["Set-Cookie"]||"");',
        '      if(Object.prototype.toString.call(__raw)==="[object Array]"){__raw=__raw.join(", ")}',
        '      var __nobody=String(__j.body||"");',
        '      if(__raw&&!/ddys-protect/.test(__nobody)){',
        '        var __pairs=__raw.split(/,(?=[^;]+?=)/).map(function(x){return x.split(";")[0]}).filter(function(x){return x.indexOf("=")>0});',
        '        var __newck=__pairs.join("; ");',
        '        if(__newck){',
        '          setItem("ddys_ck",__newck);',
        '          rule.headers=rule.headers||{};rule.headers.Cookie=__newck;',
        '          __html=request(__host+"/");',
        '          __gated=/ddys-protect|ddys_protect_password/.test(__html)',
        '        }',
        '      }',
        '    }',
        '  }catch(e){log("ddys 自动过门失败: "+e.message)}',
        '}',
        'pdfa=jsp.pdfa;pdfh=jsp.pdfh;pd=jsp.pd;',
        'var __out=[];',
        'if(__gated){',
        '  __out.push({type_id:"hint",type_name:"⚠️ ddys.app 有访问门槛:请在手机浏览器输入密码ddys点选验证后, F12复制Cookie填进 js/ddys.js 的 USER_COOKIE"});',
        '}else{',
        '  var __list=pdfa(__html,"#primary-menu li.menu-item");',
        '  var __re=/\\.(app|pro|site|wiki|mov|tv)\\/(.*)/;',
        '  __list.forEach(function(it){',
        '    try{',
        '      var __name=pdfh(it,"a&&Text").trim();',
        '      var __href=pd(it,"a&&href",__host);',
        '      var __mt=__href.match(__re);',
        '      if(__mt&&__mt[2]){__out.push({type_id:__mt[2],type_name:__name})}',
        '    }catch(e){}',
        '  });',
        '}',
        'input=__out;'
    ].join("\n"),
    cate_exclude: '站长|^其他$|关于|^电影$|^剧集$|^类型$|会员|登录',
    play_parse: true,
    推荐: '*',
    double: true,
    一级: '.post-box-list&&article;a:eq(-1)&&Text;.post-box-image&&style;a:eq(0)&&Text;a:eq(-1)&&href',
    二级: {
        title: '.post-title&&Text;.cat-links&&Text',
        img: '.doulist-item&&img&&data-cfsrc',
        desc: '.published&&Text',
        content: '.abstract&&Text',
        tabs: `js:TABS=['国内(优先用Exo播放)','国内2']`,
        lists: [
            'js:',
            'log(TABS);',
            'let d=[];',
            'pdfh=jsp.pdfh;pdfa=jsp.pdfa;',
            'if(typeof play_url==="undefined"){var play_url=""}',
            'function getLists(html){',
            '  let src=pdfh(html,".wp-playlist-script&&Html");',
            '  src=JSON.parse(src).tracks;',
            '  let list1=[];let list2=[];',
            '  let url1="";let url2="";',
            '  let __b=(typeof HOST==="string"&&HOST)?HOST.slice(HOST.indexOf("//")+2):"ddys.app";',
            '  src.forEach(function(it){',
            '    let src0=it.src0;let src1=it.src1;',
            '    let title=it.caption;',
            '    url1=String(src0).indexOf("http")===0?src0:("https://v."+__b+src0);',
            '    url2=String(src1).indexOf("http")===0?src1:("https://"+__b+"/getvddr2/video?id="+src1+"&type=mix");',
            '    let zm=it.subsrc?("https://"+__b+"/subddr/"+it.subsrc):"";',
            '    list1.push({title:title,url:url1,desc:zm});',
            '    list2.push({title:title,url:url2,desc:zm});',
            '  });',
            '  return{list1:list1,list2:list2}',
            '}',
            'var data=getLists(html);',
            'var list1=data.list1;var list2=data.list2;',
            'let nums=pdfa(html,"body&&.post-page-numbers");',
            'nums.forEach(function(it){',
            '  let num=pdfh(it,"body&&Text");',
            '  let nurl=input+num+"/";',
            '  if(num==1){return}',
            '  let html=request(nurl);',
            '  let _data=getLists(html);',
            '  list1=list1.concat(_data.list1);',
            '  list2=list2.concat(_data.list2);',
            '});',
            'list1=list1.map(function(item){return item.title+"$"+play_url+urlencode(item.url+"|"+input+"|"+item.desc)});',
            'list2=list2.map(function(item){return item.title+"$"+play_url+urlencode(item.url+"|"+input+"|"+item.desc)});',
            'LISTS=[list1,list2];'
        ].join("\n")
    },
    lazy: [
        'js:',
        'var __host=(typeof HOST==="string"&&HOST)?HOST:rule.host;',
        'let purl=input.split("|")[0];',
        'let referer=input.split("|")[1];',
        'let zm=input.split("|")[2];',
        'print("purl:"+purl);',
        'let __ua="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";',
        'if(/getvddr/.test(purl)){',
        '  let html=request(purl,{headers:{Referer:__host,"User-Agent":__ua}});',
        '  try{input={jx:0,url:JSON.parse(html).url,parse:0}}catch(e){input=purl}',
        '}else{',
        '  input={jx:0,url:purl,parse:0,header:JSON.stringify({"user-agent":__ua,"referer":__host+"/"})}',
        '}'
    ].join("\n"),
    搜索: '#main&&article;.post-title&&Text;;.published&&Text;a&&href'
};
