// ======================================================
// 注视影视 (https://gaze.red/) — TVBox drpy 规则 (自用)
//
// 说明:
//   - 该站列表/详情等页面挂了 CAP 工作量证明验证 (开源 cap.js)。
//   - 规则会自动 POST /event/cap/challenge 拿题, 用 SHA-256 PoW
//     解出 nonce 再 POST /event/cap/redeem 换通行 token,
//     token 会写进本地 Cookie(cap-token), 之后自动带上。
//   - 若被网关直接拦截(Cloudflare 拦数据中心网络很常见)或 redeem
//     不成功: 先用手机浏览器打开 gaze.red 完成一次验证, 然后
//     F12 -> 应用 -> Cookie, 把整段 Cookie 粘贴到下面 userCookie 引号内。
// ======================================================

var rule = {
    title: 'gazered',
    host: 'https://gaze.red',
    userCookie: '',
    url: '/filter?mform=fyclass&page=fypage',
    searchUrl: '/filter?search=**',
    searchable: 1,
    quickSearch: 0,
    filterable: 0,
    play_parse: true,
    limit: 6,
    推荐: '*',
    double: false,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'Referer': 'https://gaze.red/'
    },
    预处理: [
        'var __c=getItem("gz_ck","");',
        'if(!__c&&rule.userCookie){__c=rule.userCookie;try{setItem("gz_ck",__c)}catch(e){}}',
        'if(!rule.headers){rule.headers={}}',
        'if(__c){rule.headers.Cookie=__c}'
    ].join("\n"),
    class_parse: [
        'js:',
        'var __t=["电影:1","剧集:2","番剧:bangumi"];',
        'var __out=[];',
        '__t.forEach(function(s2){var q=s2.split(":");__out.push({type_id:q[1],type_name:q[0]})});',
        'var __html="";try{__html=request(rule.host+"/")}catch(e){}',
        'if(gzIsGate(__html)&&!gzSync(__html)){',
        '  __out=[{type_id:"hint",type_name:"⚠️ 注视影视被CAP验证拦截: 规则每次启动会自动重试; 若总失败请用手机浏览器过一次验证或把 Cookie 填到 js/gazered.js 的 userCookie"}];',
        '}',
        'input=__out;'
    ].join("\n"),
    一级: [
        'js:',
        'var __u=input;',
        'var __html=gzGet(__u);',
        'if(gzIsGate(__html)){',
        '  if(gzSync(__html)){__html=gzGet(__u)}',
        '}',
        'var __cs=gzCards(__html,__u);',
        'if(!__cs.length){',
        '  setResult([gzHintEntry("⚠️ 无数据: 若提示验证拦截, 用浏览器打开 gaze.red 过验证后重试", gzHost()+"/")]);',
        '}else{setResult(__cs)}'
    ].join("\n"),
    二级: [
        'js:',
        'var __url=input;',
        'var __html=gzGet(__url);',
        'var __gated=gzIsGate(__html);',
        'if(__gated&&gzSync(__html)){__gated=false;__html=gzGet(__url)}',
        'if(__gated){',
        '  VOD={vod_name:"⚠️ 此片详情被CAP验证拦截",vod_pic:"",vod_remarks:"验证未通过",vod_content:"规则自动过验证失败。请在手机浏览器打开 https://gaze.red 完成一次验证, 之后把 Cookie 填到 js/gazered.js 的 userCookie。",vod_play_from:"提示",vod_play_url:"打开官网过验证$https://gaze.red/"};',
        '}else{',
        '  var __cs=gzCards(__html,__url);',
        '  var __nm="",__pic="",__rk="";',
        '  if(__cs.length){__nm=__cs[0].vod_name;__pic=__cs[0].vod_pic;__rk=__cs[0].vod_remarks}',
        '  if(!__nm){var __h2=__html.match(/<title>([^<]{1,80})/);__nm=__h2?__h2[1].trim():"未知"}',
        '  var __play=__html.match(/[\\u0022\\u0027]([^\\u0022\\u0027\\s]*\\.m3u8[^\\u0022\\u0027\\s]*)/);',
        '  var __mp4=__html.match(/[\\u0022\\u0027]([^\\u0022\\u0027\\s]*\\.mp4[^\\u0022\\u0027\\s]*)/);',
        '  var __v=__play?__play[1]:(__mp4?__mp4[1]:"");',
        '  if(__v&&__v.indexOf("http")!==0){__v=gzJoin(__url,__v)}',
        '  if(__v){',
        '    VOD={vod_name:__nm,vod_pic:__pic,vod_remarks:__rk,vod_content:"m3u8 直连",vod_play_from:"直连",vod_play_url:"播放$"+__v};',
        '  }else{',
        '    VOD={vod_name:__nm,vod_pic:__pic,vod_remarks:__rk,vod_content:"未直接提取到视频地址",vod_play_from:"网页嗅探",vod_play_url:"嗅探播放$"+__url};',
        '  }',
        '}'
    ].join("\n"),
    lazy: [
        'js:',
        'if(/\\.m3u8|\\.mp4/.test(input)){input={jx:0,url:input,parse:0}}',
        'else{input={jx:0,url:input,parse:1}}'
    ].join("\n"),
    isVideo: 'https?:\\/\\/[^\\u0022\\u0027<>\\s]*\\.(?:m3u8|mp4|ts)',
    搜索: [
        'js:',
        'var __u=gzHost()+"/filter?search="+encodeURIComponent(KEY);',
        'var __html=gzGet(__u);',
        'if(gzIsGate(__html)){',
        '  if(gzSync(__html)){__html=gzGet(__u)}',
        '}',
        'var __cs=gzCards(__html,__u);',
        'if(!__cs.length){',
        '  setResult([gzHintEntry("⚠️ 未搜索到内容, 或被CAP验证拦截", __u)]);',
        '}else{setResult(__cs)}'
    ].join("\n")
};

// ---- 以下辅助函数挂在 rule._g 上, 供上面各 js: 代码块调用 ----
// (drpy 引擎把规则文件包在 IIFE 里 eval, 只有 rule 能出来)
(function(g){
    g.gzUA=function(){
        return "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";
    };
    g.gzHost=function(){
        return (typeof rule!=="undefined"&&rule&&rule.host)?rule.host:"https://gaze.red";
    };
    g.gzHs=function(){
        var h={"User-Agent":g.gzUA(),"Referer":g.gzHost()+"/"};
        var c="";
        try{c=getItem("gz_ck","")}catch(e){}
        if(!c&&typeof rule!=="undefined"&&rule&&rule.userCookie){c=rule.userCookie}
        try{var s=getItem("gz_sid","");if(s){c=c?(c+"; "+s):s}}catch(e2){}
        if(c){h.Cookie=c}
        return h;
    };
    g.gzGet=function(url){
        try{
            var r=request(url,{headers:g.gzHs(),withHeaders:true})||"{}";
            var j={};try{j=JSON.parse(r)}catch(e1){}
            var sc=j["set-cookie"]||[];
            if(!Array.isArray(sc)){sc=sc?[sc]:[]}
            var sid=[];
            sc.forEach(function(x){
                var kv=String(x).split(";")[0];
                if(/^[A-Za-z][A-Za-z0-9_]*=/.test(kv)){sid.push(kv)}
            });
            if(sid.length){try{setItem("gz_sid",sid.join("; "))}catch(e2){}}
            return String(j.body||"");
        }catch(e){return ""}
    };
    g.gzIsGate=function(html){
        return /访问验证|cap-widget|data-cap-api-endpoint/.test(html||"");
    };
    g.gzCapApi=function(html){
        var m=(html||"").match(/data-cap-api-endpoint=\u0022([^\u0022]+)\u0022/);
        return m?m[1]:"/event/cap/";
    };
    // 开源 cap.js 的 PRNG 函数 b(seed,len): FNV1a 种子 + xorshift 十六进制流
    g.gzB=function(seed,len){
        var t=2166136261,i;
        for(i=0;i<seed.length;i++){
            t^=seed.charCodeAt(i);
            t+=(t<<1)+(t<<4)+(t<<7)+(t<<8)+(t<<24);
        }
        t=t>>>0;
        var nx=function(){
            t^=t<<13;t^=t>>>17;t^=t<<5;
            return t>>>0;
        };
        var r="";
        while(r.length<len){
            var hx=nx().toString(16);
            while(hx.length<8){hx="0"+hx}
            r+=hx;
        }
        return r.slice(0,len);
    };
    g.gzPow=function(salt,target){
        var n=0,h="",tt=String(target);
        try{
            while(n<3000000){
                h=CryptoJS.SHA256(salt+String(n)).toString();
                if(h.slice(0,tt.length)===tt){return n}
                n++;
            }
        }catch(e){log("gaze pow error:"+e.message)}
        return -1;
    };
    g.gzSolveChal=function(api){
        var j;
        try{j=JSON.parse(request(api+"challenge",{method:"POST",headers:g.gzHs()}))}catch(e){return null}
        if(!j||j.error){return null}
        var pairs=[],token=j.token||"";
        if(j.format===2&&j.challenges){
            j.challenges.forEach(function(c){if(c&&c.salt&&c.target){pairs.push([c.salt,c.target])}});
        }else if(j.challenge){
            var c=j.challenge;
            if(Array.isArray(c)){pairs=c}
            else if(c.s&&c.d&&c.c){
                for(var i=1;i<=c.c;i++){
                    pairs.push([g.gzB(token+String(i),c.s),g.gzB(token+String(i)+"d",c.d)]);
                }
            }
        }
        if(!pairs.length){return null}
        var sols=[];
        for(var k=0;k<pairs.length;k++){
            var n=g.gzPow(pairs[k][0],pairs[k][1]);
            if(n<0){return null}
            sols.push(n);
        }
        try{
            var r2=JSON.parse(request(api+"redeem",{method:"POST",headers:g.gzHs(),body:JSON.stringify({token:token,solutions:sols})}));
            if(r2&&r2.success===true&&r2.token){return r2.token}
        }catch(e2){}
        return null;
    };
    g.gzSync=function(html){
        if(!g.gzIsGate(html)){return true}
        var api=g.gzCapApi(html);
        if(api.charAt(0)==="/"){api=((typeof rule!=="undefined"&&rule.host)?rule.host.replace(/\/+$/,""):"https://gaze.red")+api}
        api=api.slice(-1)==="/"?api:api+"/";
        var t=g.gzSolveChal(api);
        if(t){
            try{setItem("gz_ck","cap-token="+t+"; __Host-cap-token="+t)}catch(e){}
            return true;
        }
        return false;
    };
    g.gzJoin=function(base,u){
        u=String(u);
        if(u.indexOf("http")===0){return u}
        var host=g.gzHost();
        while(host.charAt(host.length-1)==="/"){host=host.slice(0,-1)}
        if(u.charAt(0)==="/"){return host+u}
        return host+"/"+u;
    };
    // 服务端渲染卡片: <article> 内含 href="play/<hex>" 与 aria-label="播放 名称"
    g.gzCards=function(html,base){
        var out=[];
        var parts=(html||"").split(/<article[\s\S]/i);
        parts.forEach(function(seg){
            var end=seg.indexOf("</article>");
            var body=end>=0?seg.slice(0,end):seg;
            if(!body||body.length>4000){return}
            var am=body.match(/href=\u0022(?:https?:\/\/[^\/]+)?\/?(play\/[0-9a-fA-F]{6,48})\u0022/);
            if(!am){return}
            var url=g.gzJoin(base,"/"+am[1]);
            var title="";
            var tm=body.match(/aria-label=\u0022播放\s*([^\u0022]{0,80})\u0022/);
            if(tm){title=tm[1].trim()}
            var pic="";
            var pm=body.match(/data-src=\u0022([^\u0022]+)\u0022/);
            if(pm){pic=pm[1]}
            else{
                var pm2=body.match(/src=\u0022(https?:\/\/[^" ]+\.(?:jpg|jpeg|png|webp)[^" ]*)\u0022/);
                if(pm2){pic=pm2[1]}
                else{var xm=body.match(/alt=\u0022([^\u0022]{0,80})\u0022/);title=title||(xm?xm[1]:"")}
            }
            if(!title){return}
            var desc="";
            var dm=body.match(/badge-pill[^>]*>([^<]{1,16})</);
            if(dm){desc=dm[1].trim()}
            out.push({vod_name:title,vod_pic:pic,vod_remarks:desc,vod_id:url});
        });
        return out;
    };
    g.gzHintEntry=function(text,url){
        return {title:text,img:"",url:url||g.gzHost()+"/",desc:""}
    };
})(rule._g=(rule._g||{}));
try{
    globalThis.gzUA=rule._g.gzUA;
    globalThis.gzHost=rule._g.gzHost;
    globalThis.gzHs=rule._g.gzHs;
    globalThis.gzGet=rule._g.gzGet;
    globalThis.gzIsGate=rule._g.gzIsGate;
    globalThis.gzCapApi=rule._g.gzCapApi;
    globalThis.gzSync=rule._g.gzSync;
    globalThis.gzJoin=rule._g.gzJoin;
    globalThis.gzCards=rule._g.gzCards;
    globalThis.gzHintEntry=rule._g.gzHintEntry;
}catch(e){}
