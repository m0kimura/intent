//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
module.exports={
  server: '', folder: 'frame/', recid: 'every', rc: {},
  bkscreen: [], proc: function(){return {};},
//
  open: function(proc, op){ // open processing
    var me=this; REC={}; REC[me.recid]={}; proc=proc||function(){}; op=op||{};
    document.addEventListener('deviceready', function(){
      me.base(); me.getInfoj(); if(INFOJ.initview){me.loadScreen(INFOJ.initview);}
      INFOJ.frameMode=INFOJ.frameMode||'local';
      INFOJ.frameFolder=INFOJ.frameFolder||'frame';
      if(INFOJ.screenWidth){me.screenZooming();}
      if(INFOJ.initialView){me.show(INFOJ.initialView);}
      proc(INFOJ, REC[me.recid], me);
    }, false);
    document.addEventListener("backbutton", function(){me.onBackkey(me);}, false);
    console.log("BOA:", this.today(), this.now());
  },
//
// extend メソッド、プロパティの拡張
  extend: function(obj, noover){
    var k; for(k in obj){
      if(this[k]){
        if(noover){console.log(k, 'メソッド重複');}
        else{this[k]=obj[k];}
      }else{this[k]=obj[k];}
    }
  },
//
//  基本設定
  base: function(){ //
    var me=this;
    INFOJ.model=window.device.model;
    INFOJ.uuid=window.device.uuid;
    INFOJ.cordova=device.cordova;
    INFOJ.platform=device.platform;
    INFOJ.version=device.version;

    me.pageY=window.innerHeight; me.pageX=window.innerWidth;
    
    console.log('Device Model: '+device.model);
    console.log('Device Cordova: '+device.cordova);
    console.log('Device Platform: '+device.platform);
    console.log('Device UUID: '+device.uuid);
    console.log('Device Version: '+device.version);
  },
//  getInfo()==>INFOJ
//  メタタグからパラメタ取得
  getInfoj: function(){
    var me=this; var k, v;
    $('meta').each(function(){
      k=$(this).attr('name'); if(k){v=$(this).attr('content'); INFOJ[k]=v;}
    });
    INFOJ['loaded']='yes'; me.setJson('INFOJ', INFOJ);
    return INFOJ;
  },
//
  screenZooming: function(op){
    var me=this;
    op=op||{}; op.width=op.width||INFOJ.screenWidth;
    var r=window.parent.screen.width/op.width;
//
    switch(device.model){
      case "Nexus 7": r=1; break;
    }
    $("body").css({width: op.width+"px", zoom: r});
    me.pageX=me.pageX/r; me.pageY=me.pageY/r; 
//
    console.log('parent screen height:', window.parent.screen.height);
    console.log('parent screen width:', window.parent.screen.width);
    console.log('option width:', op.width);
    console.log('Screen Zooming:'+r);
  },
//
  show: function(mem, op){
    var me=this, out=''; op=op||{}; op.mode=op.mode||INFOJ.frameMode;
    var f=me.getFrame(mem, op.mode);
    out+=me.parm(f.HEAD);
    for(var i in REC[me.recid]){out+=me.parm(f.BODY, '', i);}
    out+=me.parm(f.FOOT);
    $('body').html(out);
  },
// オプション用オブジェクトを内部データからセット
  setOption: function(spec, op){
    var me=this; op=op||{}; op.type=op.type||'INFOJ'; op.ix=op.ix||0; var dt;
    switch(op.type){
      case "REC": dt=REC[me.recid][op.ix]; break;
      case "SCREEN": dt=me.SCREEN; break;
      default: dt=INFOJ; break;
    }
    var out={}; for(var i in spec){out[i]=dt[spec[i]];}
    return out;
  },
//  parm(文字列, [展開データ], [展開データインデックス]
//  #{} INFOJ, %{} REC, ${} SCREEN, $0-9 ARGV
  parm: function(ln, dt, ix, i, j, c, sw, out, cc, key, a, ri, it, po){ // develop parameter
    var me=this; sw=0; out=''; key=''; if(!ix){ix=0;}
    if(!ln){return '';}
    for(i=0; i<ln.length; i++){
      c=ln.substr(i, 1); cc=ln.substr(i, 2);
      switch(sw){
       case 0:
        switch(cc){
          case '#{': sw=1; i++; key=''; break; case '%{': sw=2; i++; key=''; break;
          case '${': sw=3; i++; key=''; break; case '&{': sw=4; i++; key=''; break;
          default: if(cc>'$0' && cc<'$9'){sw=9; i++;}else{out+=c;} break;
        } break;
       case 1:
        if(c=='}'){if(INFOJ[key]!==undefined){out+=INFOJ[key]; sw=0;}}
        else{key+=c;} break;
       case 2:
        if(c=='}'){
          if(dt){if(dt[key]!==undefined){out+=dt[key];}}
          else{
            a=key.split('.'); if(!a[1]){it=key; ri=me.recid;}else{it=a[1]; ri=a[0];}
            if(REC[ri]===undefined){REC[ri]=[{}];}
            if(REC[ri][ix][it]!==undefined){out+=REC[ri][ix][it];}
          }
          sw=0;
        }else{
          key+=c;
        } break;
       case 3:
        if(c=='}'){if(me.SCREEN[key]!==undefined){out+=me.SCREEN[key];} sw=0;}else{key+=c;} break;
       case 4:
        if(c=='}'){
          po=me.getFrame(key, {mode: 'local', folder: 'view'});
console.log('po', po);
          if(po.BODY!=undefined){out+=po.BODY;}
          if(po.EFFECT!=undefined){me.Effect[key]=po.EFFECT;}
          sw=0;
        }else{key+=c;} break;
       case 9:
        key=cc.substr(1, 1)-0; out+=me.ARGV[key]; sw=0; break;
      }
    }
    return out;
  },
//  phrase(string)=>obj
//  ?サーチ引数をパラメタオブジェクトに変換
  phrase: function(txt){ // search type -> obj
    txt=txt.replace(/&amp;/g, '&');
    var a=txt.split('&'); var out={}; for(var i in a){var b=a[i].split('='); out[b[0]]=b[1];}
    return out;
  },
//
//
  choose: function(txt, key){ // キーとなる文字列の出現場所から後を取り出す /www/のあとなど
    var p=txt.indexOf(key); if(p<0){return txt;}else{return txt.substr(p+key.length);}
  },
//  develop(member, 展開データ, データインデックス
//  フレームを読み込みデータを展開する
  develop: function(mem, dt, ix){ //
    var me=this; if(!dt){dt=REC[me.recid];} if(!ix){ix=0;} var out='';
    var f=me.getFrame(mem);
    if(f['BODY']){
      out=me.parm(f['HEAD'], dt[ix]);
      for(var i in dt){out+=me.parm(f['BODY'], dt[i]);}
      out+=me.parm(f['FOOT'], dt[ix]);
    }else{
      console.log("#ERROR MEM frame="+mem);
    }
    return out;
  },
//  getFrame(member, モード[server, engine, local])==>obj 
//　フレームを取り出す
  getFrame: function(member, op){
    var me=this; var url, out;
    op=op||{}; op.mode=op.mode||INFOJ.frameMode; op.folder=op.folder||INFOJ.frameFolder;
    switch(op.mode){
      case 'server': url=INFOJ.server+'/'+op.folder+'/'+member+'.html'; break;
      case 'engine': url=INFOJ.server+'/cms/formEngine.php?'+member; break;
      default: url='./'+op.folder+'/'+member+'.html';
    }
    $.ajax({async: false, url: url, type: 'GET', dataType: 'text',
      success: function(data){
        if(op.mode=='engine'){eval(data);}else{out=me.frame(data);}
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){out="ERROR NO FILE";}
    });
    return out;
  },
  frame: function(source){ // Frameフォーマットからオブジェクト作成
    var i=0; var pos=0; var m='BODY'; var out={}; var tps, y, f;
    while(pos<source.length){
      if(tps=source.indexOf("\n", pos)){
        y=source.substr(pos, tps-pos);
        if(y.substr(-1, 1)=="\r"){y=y.substr(0, y.length-1);}
        if(y.substr(0, 1)=='-'){m=y.substr(1); f=false;}else{f=true;}
        if(y.substr(0, 2)!='//'){
          if(f){if(out[m]){out[m]+=y+"\n";}else{out[m]=y+"\n";}}
        }
      }else{
        y=source.substr(pos);
        if(y.substr(0, 2)!='//'){
          if(out[m]){out[m]+=y+"\n";}else{out[m]=y+"\n";}
        }
        tps=source.length;
      }
      pos=tps+1;
    }
    return out;
  },
//  getView(member, モード[server, engine, local])==>obj 
//　Viewを取り出す
  getView: function(member, op){
    var me=this; var url, out;
    op=op||{}; member=member||"screen";
    op.mode=op.mode||INFOJ.viewMode||'file'; op.folder=op.folder||INFOJ.viewFolder||'view';
    switch(op.mode){
      case 'server': url=INFOJ.server+'/'+op.folder+'/'+member+'.json'; break;
      case 'engine': url=INFOJ.server+'/cms/formEngine.php?'+member; break;
      default: url='./'+op.folder+'/'+member+'.json';
    }
    $.ajax({async: false, url: url, type: 'GET', dataType: 'text',
      success: function(data){
        if(op.mode=='engine'){eval(data);}else{out=data;}
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){out={error: "ERROR NO FILE"};}
    });
    try{return JSON.parse(out);}catch(e){console.log(out); alert(e); return out;}
  },
//  getModel(member, モード[server, engine, local])==>obj 
//　Modelを取り出す
  getModel: function(member, op){
    var me=this; var url, out;
    op=op||{}; member=member||"main";
    op.mode=op.mode||INFOJ.modelMode||'file'; op.folder=op.folder||INFOJ.modelFolder||'model';
    switch(op.mode){
      case 'server': url=INFOJ.server+'/'+op.folder+'/'+member+'.json'; break;
      case 'engine': url=INFOJ.server+'/cms/modelEngine.php?'+member; break;
      default: url='./'+op.folder+'/'+member+'.json';
    }
    $.ajax({async: false, url: url, type: 'GET', dataType: 'text',
      success: function(data){
        if(op.mode=='engine'){eval(data);}else{out=data;}
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){out={error: "ERROR NO FILE"};}
    });
    try{return JSON.parse(out);}catch(e){alert(e); return out;}
  },
//  getView(member, モード[server, engine, local])==>obj 
//　Viewを取り出す
  getFile: function(member, op){
    var me=this; var url, out;
    op=op||{}; member=member||"member";
    op.mode=op.mode||'file'; op.folder=op.folder||'library';
    switch(op.mode){
      case 'server': url=INFOJ.server+'/'+op.folder+'/'+member+'.json'; break;
      case 'engine': url=INFOJ.server+'/cms/formEngine.php?'+member; break;
      default: url='./'+op.folder+'/'+member;
    }
    $.ajax({async: false, url: url, type: 'GET', dataType: 'text',
      success: function(data){
        if(op.mode=='engine'){eval(data);}else{out=data;}
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){out={error: "ERROR NO FILE"};}
    });
    return out;
  },
//  getSQL(sql文)==>REC
//　SQL文でサーバーに問い合わせRECを構成
  getSQL: function(sql){
    var me=this; var dt={}; dt['sql']=sql;
    var x=$.ajax({
      type: 'POST', async: false, url: INFOJ.server+'/cms/sqlEngine.php',
      data: dt, dataType: 'json'
    }).responseText;
    var y=JSON.parse(x); me.success=y.success; me.message=y.message;
    if(y.success){
      if(y.data){REC[me.recid]=y.data;}else{REC[me.recid]=[]; REC[me.recid][0]={};}
      REC[me.recid][0].success=y.success; REC[me.recid][0].message=y.message;
    }else{
      REC[me.recid]=y;
    }
  },
//  get(url, パラメタオブジェクト)==>REC
//　GETインターフェイスでのAJAXリクエストからRECを構成
  get: function(url, dt){ // ajax get from url with dt
    var me=this; var x; var y;
    if(url.substr(0, 1)=='#'){
      eval(url.substr(1));
    }else{
      x=$.ajax({type: 'GET', async: false, url: url, data: dt, dataType: 'json'}).responseText;
      y=JSON.parse(x); me.success=y.success; me.message=y.message;
      if(y.success){
        if(y.data){REC[me.recid]=y.data;}else{REC[me.recid]=[]; REC[me.recid][0]={};}
        REC[me.recid][0]['success']=y.success; REC[me.recid][0]['message']=y.message;
      }else{
        REC[me.recid]={}; REC[me.recid][0]=y;
      }
    }
  },
//  getUser(インターフェイス)==>USER
//　ユーザー管理バックエンドを通信する
  getUser: function(dt){ // ajax get from url with dt
    var me=this; dt['COOK']=me.getCook();
    var x=$.ajax({
      type: 'POST', async: false, url: INFOJ.server+'/cms/userEngine.php',
      data: dt, dataType: 'json'
    }).responseText;
    var p=x.indexOf('{'); var y=JSON.parse(x.substr(p));
    if(y.success){
      if(y.data){USER=y.data;} me.setCook(y.cook);
    }else{
      USER={};
    }
    return y;
  },
//  getAjax(url, パラメータオブジェクト)==>REC
//　POSTインターフェイスでAJAX通信
  getAjax: function(url, dt, recid){ // ajax get from url with dt
    var me=this; recid=recid||me.recid;
    var x=$.ajax({
      type: 'POST', async: false, url: me.server+url, data: dt, dataType: 'json'
    }).responseText;
    var y=JSON.parse(x); me.success=y.success; me.message=y.message;
    if(y.success){
      if(y.data){REC[recid]=y.data;}else{REC[recid]=[]; REC[recid][0]={};}
      REC[recid][0].success=y.success; REC[recid][0].message=y.message;
    }else{
      REC[recid]=y;
    }
  },
//
// date 日付編集 YMD ymd HIS his W w
//      (編集文字列)==>編集日付
  date: function(t, time){
    if(time){var d=new Date(time);}else{var d=new Date();}
    t=t.replace(/Y/, d.getYear()-100); t=t.replace(/y/, d.getYear()+1900);
    t=t.replace(/M/, (d.getMonth()+101+' ').substr(1, 2)); t=t.replace(/m/, d.getMonth()+1);
    t=t.replace(/D/, (d.getDate()+100+' ').substr(1, 2)); t=t.replace(/d/, d.getDate());
    t=t.replace(/H/, (d.getHours()+100+' ').substr(1, 2)); t=t.replace(/h/, d.getHours());
    t=t.replace(/I/, (d.getMinutes()+100+' ').substr(1, 2)); t=t.replace(/i/, d.getMinutes());
    t=t.replace(/S/, (d.getSeconds()+100+' ').substr(1, 2)); t=t.replace(/s/, d.getSeconds());
    t=t.replace(/W/, ['日', '月', '火', '水', '木' ,'金' , '土'][d.getDay()]);
    t=t.replace(/w/, ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()]);
    return t;
  },
  today: function(){return this.date('Y/M/D');},
  now:  function(){return this.date('H:I:S');},
//セション変数の管理
//##OK
  setValue: function(key, val){sessionStorage.setItem(key, val);},
  getValue: function(key){return sessionStorage.getItem(key);},
  setJson: function(key, obj){this.setValue(key, JSON.stringify(obj));},
  getJson: function(key){
    var x=sessionStorage.getItem(key); if(!x){return {};}
    x=JSON.parse(x); if(!x){x={}; console.log('no data key='+key);} return x;
  },
  remove: function(key){return sessionStorage.removeItem(key);},
//
// クッキーの代わり
  setCook: function(val){localStorage.setItem('#COOK', val);},
  getCook: function(){return localStorage.getItem('#COOK');},
//
// オブジェクトをデバイスに保存セッションを跨いで保存する
  saveObject: function(key, val){localStorage.setItem(key, JSON.stringify(val));},
  recoverObject: function(key){return JSON.parse(localStorage.getItem(key));},
//
// RECインターフェイスをローカルデータとやりとり
  putLocal: function(key){
    var me=this; localStorage.setItem(key, JSON.stringify(REC));
  },
  getLocal: function(key){
    var me=this; var a=JSON.parse(localStorage.getItem(key)); for(i in a){REC[i]=a[i];}
  },
//
  onBackkey: function(me){
    me.close();
  },
// タグ編集
  tag: function(name, dt, inner, force){
    var me=this, out='', style='', dest; name=name||"div"; dt=dt||{};
    if(force){dest="else";}else{dest=name;}
    switch(dest){
     case 'ul': case 'ol':
      inner=inner||"list";
      out+='<'+name+' id="'+inner+'>';
      for(i in dt){out+='<li ix='+i+' >'+dt[i]+'</li>';}
      out+='</'+name+'>';
      break;
     case 'table':
      inner=inner||"table";
      out+='<table id="'+inner+'">';
      for(i in dt){
        out+='<tr>'; for(j in dt[i]){out+='<td class="'+j+' L'+i+'">'+dt[i][j]+'</td>';} out+='</tr>';
      }
      out+='</table>';
      break;
     default:
      inner=inner||""; out='<'+name;
      for(var i in dt){
        if(i[0]==i[0].toUpperCase() || i[0]=='-'){
          style+=i.toLowerCase()+': '+dt[i]+'; ';
        }else{
          out+=' '+i+'="'+dt[i]+'"';
        }
      }
      if(style){out+=' style="'+style+'"';} out+='>'; out+=inner+'</'+name+'>';
    }
    return out;
  },
//
  appendTag: function(name, attr){
    var head=document.getElementsByTagName("head")[0];
    var e=document.createElement(name); for(var i in attr){e.setAttribute(i, attr[i]);}
    head.appendChild(e);
  },
//
  close: function(op){
    var me=this; op=op||{};
    console.log("EOA:", this.today(), this.now());
    navigator.app.exitApp();
  }
};
