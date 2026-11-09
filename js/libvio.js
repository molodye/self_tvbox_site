// ======================================================
// LIBVIO (https://www.libvio.io/) — TVBox drpy 规则 (自用)
//
// 说明:
//   - 主站 www.libvio.io 对非浏览器请求可能返回 403(浏览器验证)。
//   - 规则启动时会自动探测可用域名(也在下面 HostList 里),
//     命中的域名会被保存在本地, 之后请求都会带过去。
//   - 若电视盒端始终 403: 手机浏览器打开 www.libvio.io,
//     F12 -> 应用 -> Cookie, 把整段 Cookie 粘贴到下面 USER_COOKIE。
// ======================================================

var USER_COOKIE = "";

var HostList = [
    'https://www.libvio.io/',
    'https://libvio.host/',
    'https://www.libvio.to/',
    'https://www.libviobd.com/'
];

var rule = {
    title: 'libvio',
    host: 'https://www.libvio.io/',
    url: 'fyclass',
    searchUrl: '/index.php/ajax/suggest?mid=1&wd=**&limit=50',
    searchable: 1,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'https://www.libvio.io/'
    },
    // 载入时: 探测可用域名 -> 写回 rule.host; 合并 Cookie
    预处理: [
        'var rule_headers=rule.headers||{};',
        'var ua="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";',
        'var __hv=getItem("libvio_host","");',
        'var __ok=false;',
        'if(__hv){try{var t0=request(__hv,{headers:{"User-Agent":ua}});if(t0&&/browser verification/.test(t0)){__ok=false}else if(t0&&/stui|LIBVIO|影视/.test(t0)){__ok=true}else{__ok=false}}catch(e){__ok=false}}',
        'if(!__ok){for(var __i=0;__i<HostList.length;__i++){var __h=HostList[__i];try{var __t=request(__h,{headers:{"User-Agent":ua}});if(__t&&!/browser verification/.test(__t)&&/stui|LIBVIO|影视/.test(__t)){__hv=__h;__ok=true;try{setItem("libvio_host",__h)}catch(e2){}break}}catch(e3){}}}',
        'if(!__hv){__hv="https://www.libvio.io/"}',
        'if(!__ok){try{setItem("libvio_fail","1")}catch(e4){}}else{try{clearItem("libvio_fail")}catch(e5){}}',
        'rule.host=__hv;',
        'rule_headers.Referer=__hv;',
        'var __ck=getItem("libvio_ck","");',
        'if(!__ck&&typeof USER_COOKIE!=="undefined"&&USER_COOKIE){__ck=USER_COOKIE;try{setItem("libvio_ck",__ck)}catch(e6){}}',
        'if(__ck){rule_headers.Cookie=__ck}',
        'rule.headers=rule_headers;'
    ].join("\n"),
    class_parse: [
        'js:',
        'var __host=rule.host||"https://www.libvio.io/";',
        'pdfa=jsp.pdfa;pdfh=jsp.pdfh;pd=jsp.pd;',
        'var __input=[];',
        'var __fail=getItem("libvio_fail","");',
        'if(__fail){',
        '  __input.push({type_id:"hint",type_name:"⚠️ LIBVIO 全部镜像不可用(浏览器验证拦截):请在手机浏览器打开 www.libvio.io 把 Cookie 填入 js/libvio.js 的 USER_COOKIE"});',
        '}else{',
        '  var __html="";try{__html=request(__host)}catch(e){__html=""}',
        '  var __lit=pdfa(__html,".stui-header__menu&&li");',
        '  if(__lit&&__lit.length){',
        '    __lit.forEach(function(it){',
        '      try{',
        '        var __nm=pdfh(it,"a&&Text").trim();',
        '        var __hr=pd(it,"a&&href",__host);',
        '        if(!__nm||!/show\\/\\d+/.test(__hr)){return}',
        '        var __mt=__hr.match(/(https?:\\/\\/[^\\s"\']+\\/show\\/\\d+[^\\s"\']*\\.html)/);',
        '        __input.push({type_id:__mt?__mt[1]:__hr,type_name:__nm});',
        '      }catch(e2){}',
        '    });',
        '  }else{',
        '    __input.push({type_id:"hint2",type_name:"⚠️ LIBVIO 页面结构可能已改版,请反馈日志"});',
        '  }',
        '}',
        'input=__input;'
    ].join("\n"),
    cate_exclude: '首页|留言|APP|公告|帮助|关于|榜单|导航',
    play_parse: true,
    推荐: '*',
    double: false,
    一级: 'body&&ul.stui-vodlist&&li;a&&title;a&&data-original;span&&Text;a&&href',
    二级: {
        title: 'h1&&Text;.data:eq(0)&&Text',
        img: '.stui-content__thumb img&&src',
        desc: '.data.hidden-xs&&Text;;;.data:eq(1)&&Text;.data:eq(4)&&Text',
        content: '.detail-content&&Text',
        tabs: [
            'js:',
            'pdfa=jsp.pdfa;pdfh=jsp.pdfh;',
            'TABS=[];',
            'var __hs=[];try{__hs=pdfa(html,"body&&.stui-pannel-box")}catch(e){}',
            '__hs.forEach(function(bd){',
            '  try{',
            '    if(pdfa(bd,"body&&ul&&a").length===0){return}',
            '    var t=pdfh(bd,"body&&h3&&Text").trim();',
            '    if(!t){t="线路"+(TABS.length+1)}',
            '    TABS.push(t)',
            '  }catch(e2){}',
            '});',
            'if(!TABS.length){TABS=["线路1"]}'
        ].join("\n"),
        lists: [
            'js:',
            'pdfa=jsp.pdfa;pdfh=jsp.pdfh;pd=jsp.pd;',
            'LISTS=[];',
            'var __hs=[];try{__hs=pdfa(html,"body&&.stui-pannel-box")}catch(e){}',
            '__hs.forEach(function(bd){',
            '  try{',
            '    var aus=pdfa(bd,"body&&ul&&a");',
            '    if(!aus.length){return}',
            '    var ds=[];',
            '    aus.forEach(function(it){',
            '      var t=pdfh(it,"body&&Text").trim();',
            '      var u=pd(it,"a&&href",MY_URL);',
            '      ds.push(t+"$"+play_url+urlencode(u))',
            '    });',
            '    LISTS.push(ds)',
            '  }catch(e2){}',
            '});',
            'if(!LISTS.length){LISTS=[["预览$"+play_url+urlencode(input)]]}'
        ].join("\n")
    },
    lazy: [
        'js:',
        'var __host=rule.host||"https://www.libvio.io/";',
        'var __ua="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";',
        'var __u=input;',
        'function abs(u){if(/https?:\\/\\//.test(u)){return u}if(u.charAt(0)==="/"){return __host.replace(/\\/$/,"")+u}return __host.replace(/\\/$/,"")+"/"+u}',
        'function findVid(h){',
        '  var m=h.match(/[\\u0022\\u0027](((https?:)?\\/\\/|\\/)[^\\u0022\\u0027\\s<>]*\\.(?:m3u8|mp4|ts)[^\\u0022\\u0027\\s<>]*)/);',
        '  if(m){return m[1]}',
        '  return ""',
        '}',
        'var done=false;',
        'try{',
        '  if(/\\.m3u8|\\.mp4/.test(__u)){done=true;input={jx:0,url:abs(__u),parse:0}}',
        '}catch(e1){}',
        'if(!done){',
        '  try{',
        '    var h1=request(abs(__u),{headers:{"User-Agent":__ua,"Referer":__host}});',
        '    var v=findVid(h1||"");',
        '    if(!v){var fi=h1.match(/(?:iframe|frame)[^>]{0,400}?src=([\\u0022\\u0027])([^\\u0022\\u0027]+)\\1/);',
        '      if(fi){var iu=abs(fi[2]);',
        '        var h2=request(iu,{headers:{"User-Agent":__ua,"Referer":abs(__u)}});',
        '        v=findVid(h2||"");',
        '        if(!v){var pj=h2.match(/player_?aaaa[^=]*=\\s*\\{[\\s\\S]{0,500}?[\\u0022\u0027]url[\\u0022\u0027]\\s*:\\s*[\\u0022\u0027]([^\\u0022\u0027]+)/);',
        '          if(pj){v=pj[1]}}',
        '      }}',
        '    if(v){input={jx:0,url:abs(v),parse:0,header:JSON.stringify({"user-agent":__ua,"referer":__host})}}',
        '    else{input={jx:0,url:abs(__u),parse:1}}',
        '  }catch(e2){input={jx:0,url:abs(__u),parse:1}}',
        '}'
    ].join("\n"),
    isVideo: 'https?:\\/\\/[^\u0022\u0027<>\\s]*\\.(?:m3u8|mp4|ts)',
    搜索: [
        'js:',
        'var __host=rule.host||"https://www.libvio.io/";',
        'var __ua="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";',
        'var d=[];',
        'var surl=__host+"index.php/ajax/suggest?mid=1&wd="+encodeURIComponent(KEY)+"&limit=50";',
        'try{',
        '  var j=JSON.parse(request(surl,{headers:{"User-Agent":__ua,"Referer":__host}}));',
        '  (j.list||[]).forEach(function(it){',
        '    d.push({title:it.name,img:it.cover,url:__host+"detail/"+it.id+".html",desc:(it.time||""),"content":"演员:"+(it.actor||"")})',
        '  });',
        '}catch(e){log("libvio 搜索失败:"+e.message)}',
        'if(!d.length){',
        '  d.push({title:"⚠️ 无结果或被浏览器验证拦截",img:"",url:"https://www.libvio.io/",desc:"若全部搜索失败请填 Cookie"})',
        '}',
        'setResult(d);'
    ].join("\n")
};
