//#######1#########2#########3#########4#########5#########6#########7#########8#########9#########0
var exe=require("./execute.sjs");
exe.extend({
  Count: {
    toolbar: 0, header: 0, baloon: 0, lmenu: 0, bmenu: 0, page: 0, list: 0, panel: 0, flick: 0,
    table: 0, tmenu: 0
  },
  Save: {height: 0, width: 0}, Manner: {}, Scroll: [], Monitor: [], Baloon: [], Slide: [],
  Cancel: [], Scale: {bodyHeader: 0, bodyFooter: 0, childHeader: 0, childFooter: 0},
  Main: {}, Effect: {},
  Flag: {lmenu: true}, Grid: {}, Now: {page: 0, initialize: 0},
  Option: {},
//##########
// open             処理の開始
//
  open: function(proc, op){ // open processing
    var me=this; REC={}; REC[me.recid]={}; proc=proc||function(){}; op=op||{};
    document.addEventListener('deviceready', function(){
      me.base(); me.getInfoj(); if(INFOJ.initview){me.loadScreen(INFOJ.initview);}
      INFOJ.frameMode=INFOJ.frameMode||'local';
      INFOJ.frameFolder=INFOJ.frameFolder||'frame';
      if(INFOJ.screenWidth){me.screenZooming();}

      proc(INFOJ, REC[me.recid], me);
      me.pageChange(0);
    }, false);
    document.addEventListener("backbutton", function(){me.onBackkey(me);}, false);
    console.log("BOA:", this.today(), this.now());
  },
//##########
// create           画面の作成
//
  create: function(op){
    var me=this, out='';
    if(typeof(op)=="string"){op=me.getView(op);}else{op=op||{};}
    op.frame=op.frame||'single';
    me.manner(op); me.Scale['bodyHeader']=0; me.Scale['bodyFooter']=0;
    switch(op.frame){
     case "single":
      op.id=op.id||'x-page'+me.Count.page; out+=me.pages(op, "body");
      var hi=me.pageY-me.Scale.bodyHeader-me.Scale.bodyFooter-me.Scale.childHeader
             -me.Scale.childFooter;
      for(var k in me.Scroll){if(me.Scroll[k].id==me.Scale.id){me.Scroll[k].windowhi=hi;}}
      break;
     case "slide": out+=me.slide(op); break;
    }

    out+=me.tag('img', {
      id: "x-modal", src: me.fbk, Position: "absolute", Top: 0+"px", Left: 0+"px", "Z-index": 7,
      Height: me.pageY+"px", Width: me.pageX+"px", Opacity: 0.7, Display: "none"
    }, "");

    $('body').css({margin: 0});
    $('body').append(out);
    var i=0;
    me.list({}, 'adjust'); me.panel({}, 'adjust'); me.table({}, 'adjust'); me.tmenu({}, 'adjust');

    for(i in me.Monitor){
      switch(me.Monitor[i].ptype){
       case "lmenu": me.lmenu(me.Monitor[i], "monitor"); break;
       case "bmenu": me.bmenu(me.Monitor[i], "monitor"); break;
       case "tmenu": me.tmenu(me.Monitor[i], "monitor"); break;
       default: me.slidebar(me.Monitor[i], "monitor"); break;
      }
    }
    for(i in me.Effect){me.effect(me.Effect[i]);}
    me.alignment();
    for(i in me.Scroll){me.scroll(me.Scroll[i]);}
    me.cancel();
  },
//##########
// manner           全体仕様
//
  manner: function(op){
    var me=this; op=op||{};
    me.Manner.frame=op.frame||'single';                   // frame type single||slide
    me.Manner.baseColor=op.baseColor||"Turquoise",        // basic color name
    me.Manner.baseCN=me.cnx(2);                           // basic color number
    me.Manner.barColor=op.barColor||me.Manner.baseCN;     // bar color
    me.Manner.fontColor=op.fontColor||'#FFF';             // font color
    me.Manner.iconColor=op.iconColor||me.Manner.fontColor;// icon color
    me.Manner.fontL=op.fontL||48;                         // big font size
    me.Manner.fontM=op.fontM||24;                         // midium font size
    me.Manner.fontS=op.fontS||12;                         // small font size
    me.Manner.barHight=op.barHight||me.Manner.fontL;      // bar hight
    me.Manner.barWidth=op.barWidth||'100%';               // bat width
    me.Manner.iconSize=op.iconSize||me.Manner.fontM;      // icon size
    me.Manner.iconMargin=op.iconMargin||me.Manner.fontS;  // icon marign
    me.Manner.maxHeight=window.parent.screen.height;      // window height
    me.Manner.MaxWidth=window.parent.screen.width;        // window width
  },
//##########
// slide            横方向でのページ替え
//
  slide: function(op){
    var me=this, page={}, out='', x='', y='';
    op.pages=op.pages||[]; op.selector=op.selector||"yes"; op.slider=op.slider||"yes";
    out+=me.slidebar(op); var nl=true;
    for(var ix in op.pages){
      page=op.pages[ix]; page.id=page.id||'x-page'+me.Count.page; me.Count.page++;
      me.Scale['childHeader']=0; me.Scale['childFooter']=0;
      x=me.pages(page, page.id);
      var hi=me.pageY-me.Scale.bodyHeader-me.Scale.bodyFooter-me.Scale.childHeader
             -me.Scale.childFooter;
      for(var k in me.Scroll){if(me.Scroll[k].id==me.Scale.id){me.Scroll[k].windowhi=hi;}}
      y+=me.tag('div', me.locate({
        id: page.id,
        Height: me.pageY-me.Save.height+"px", Width: me.pageX+"px", Float: "left", Margin: "0px",
      }, {parent: "cage", nl: false}), x);
      nl=false;
      me.Now.initialize++;
    }
    var wi=me.pageX*op.pages.length;
    out+=me.tag("div",
      me.locate({"class": "c-cage", Margin: 0, Width: wi+"px"}, {parent: "slide", height: "remain"}),
    y);
    return me.tag("div", {
      id: "x-slide", Height: me.pageY+"px", Width: me.pageX+"px", Overflow: "hidden"
    }, out);
  },
//##########
// slidebar         ページ選択・タイトル
//
  slidebar: function(op, mode){
    var me=this; op.iconSize=op.iconSize||24; op.iconColor=op.iconColor||me.Manner.iconColor;
    op.onColor=op.onColor||me.cnx(4);
    op.backgroundColor=op.backgroundColor||me.Manner.barColor;
    op.textSize=op.textSize||me.Manner.fontS; op.thick=op.thick||5;
    op.sliderColor=op.sliderColor||op.color; op.fontColor=op.fontColor||me.Manner.fontColor;
    op.indicatorColor=op.indicatorColor||me.cnx(4); op.animate=op.animate||500;
    var num=op.pages.length; if(num<1){return;}
    var unit=Math.floor(me.pageX / num);
    var tmag=Math.floor(op.iconSize/2)-2;
    var lmag=Math.floor((unit-op.iconSize)/2); var rmag=unit-op.iconSize-lmag;
    var x='', y='', id='', css={}, hi=0, mag=tmag+"px "+rmag+"px "+tmag+"px "+lmag+"px";
    var out='';
//Main
    var Main=function(){
      for(var ix in op.pages){
        id=op.pages[ix].id+'-button'+ix;
        y=me.tag("p", {id: id, ix: ix, Margin: 0},
          me.tag('i', {
            "class": "c-fa", Color: op.iconColor, saveof: op.iconColor, saveon: op.onColor,
            Overflow: "hidden", "Font-size": op.iconSize+"px", Width: op.iconSize+"px",
            Height: op.iconSize+"px", Margin: mag
          }, me.icx(op.pages[ix].icon))
        );
        y+=me.tag("p", {
          "Font-size": op.textSize+"px", "Text-align": "center", Width: unit+"px", Margin: "0 0 1px 0",
          Color: op.fontColor
        }, op.pages[ix].title);
        hi=tmag+op.iconSize+tmag+op.textSize+7;
        x+=me.tag("div", {Float: "left", Margin: 0, Height: hi+"px"}, y);
        me.Slide.push({id:id, page: ix});
      }
      if(op.selector!="no"){
        out=me.tag("div", me.locate({
          id: "x-slidebar", Margin: 0, "Background-color": op.backgroundColor, Height: hi+"px",
          "Z-index": 5
        }, {parent: "slide"}), x);
      }

      if(op.slider!="no"){
        out+=me.tag(
          'div', me.locate({
            Width: "100%", Height: op.thick+"px", "Background-color": "#FFF", Display: "block", "Z-index": 5
          }, {parent: "slide"}), me.tag("img", {
            id: "x-slider", Margin: 0, Height: op.thick+"px", "Background-color": op.indicatorColor,
            src: me.fsq, Width: unit+"px", Height: op.thick+"px", Display: "block"
          }, "")
        );
      }
    };
//Monitor
  var Monitor=function(op){
    var ix, id, l, n, i, m;
    n=op.pages.length;
    for(ix in op.pages){
      id=op.pages[ix].id+'-button'+ix;
      $('#'+id).on('touchstart', function(){
        i=$(this).attr('ix')-0; l=me.pageX*i*-1; m=Math.floor(me.pageX/n)*i;
        $('#x-slide').find('.c-cage').animate({'margin-left': l+"px"}, op.animate);
        if(op.slider!="no"){$('#x-slider').animate({'margin-left': m+"px"}, op.animate);}
        me.pageChange(i); me.Now.page=i;
      });
    }
  };
//Exec
    switch(mode){
     case "monitor": Monitor(op); break;
     default:
      Main(op); if(op.selector!="no"){me.Cancel.push('x-slidebar');}
      if(op.selector!="no"){me.Scale.bodyHeader=me.Scale.bodyHeader+hi;}
      if(op.slider!="no"){me.Scale.bodyHeader=me.Scale.bodyHeader+op.thick;}
      me.Monitor.push(op);
      return out;
    }
  },
//##########
// pages            ページ内の構成
//
  pages: function(op, parent){
    var me=this, out='';
    op=op||{};
    for(var ix in op.items){
      op.items[ix].parent=parent;
      switch(op.items[ix].ptype){
        case 'toolbar': out+=me.toolbar(op.items[ix]); break;
        case 'header': out+=me.header(op.items[ix]); break;
        case 'baloon': out+=me.baloon(op.items[ix]); break;
        case 'panel': out+=me.panel(op.items[ix]); break;
        case 'list': out+=me.list(op.items[ix]); break;
        case 'table': out+=me.table(op.items[ix]); break;
        case 'lmenu': out+=me.lmenu(op.items[ix]); break;
        case 'bmenu': out+=me.bmenu(op.items[ix]); break;
        case 'tmenu': out+=me.tmenu(op.items[ix]); break;
      }
    }
    return out;
  },
//##########
// header           ページヘッダー
//
  header: function(op){
    var me=this; op=op||{}; op.page=op.page||true; op.np=op.np||true;
    op.id=op.id||'x-header'+me.Count.header; me.Count.header++;
    op.iconMargin=op.iconMargin||me.Manner.iconMargin; op.iconColor=op.iconColor||me.Manner.iconColor;
    op.iconSize=op.iconSize||me.Manner.iconSize;
    op.height=op.height||me.Manner.barHight; op.width=op.width||me.Manner.barWidth;
    op.title=op.title||'title'; op.parent=op.parent||'body';

    var x='', sw=false; css; var a;
    for(var i in op.icons){
      if(op.icons[i].name=="title"){
        x+=me.tag('span', {"class": 'c-title', "Font-size": op.iconSize-5+"px",
           Margin: op.iconMargin+"px", Color: op.iconColor, Float: "left"}, op.title);
        sw=true;
      }else{
        css={
          "class": 'c-fa '+op.icons[i].name, Color: op.iconColor, Float: "left",
          "Font-size": op.iconSize+"px", Height: op.iconSize+"px", Width: op.iconSize+"px",
          Margin: op.iconMargin+"px"
        };
        if(sw){css["Float"]='right';} if(op.icons[i].id){css["id"]=op.icons[i].id;}
        x+=me.tag('i', css, me.icx(op.icons[i].name));
      }
    }

    var css=me.locate({id: op.id, Height: op.height+"px", Width: op.width, "Z-index": 3,
       "Background-color": me.Manner.barColor}, {parent: op.parent});
    var out=me.tag('div', css, x);
    me.Cancel.push(op.id);
    if(op.parent=='body'){me.Scale['bodyHeader']=me.Scale.bodyHeader+op.height;}
    else{me.Scale['childHeader']=me.Scale.childHeader+op.height;}
    return out;
  },
//##########
// baloon           バルーンボタン
//
  baloon: function(op){
    var me=this; op=op||{}; op.id=op.id||'x-baloon';
    op.color=op.color||"white"; op.rsize=op.rsize||me.Manner.fontM; op.margin=op.margin||op.rsize;
    op.iconSize=op.iconSize||op.rsize; op.parent=op.parent||'body';
    var hi=op.rsize*2+op.margin*2, lf=me.pageX-(op.rsize*2+op.margin*2);
    var tp=0, x, y, out='', id='', css={}, m=0;
    for(var i in op.icons){
      x=me.tag('circle', {cx: op.rsize, cy: op.rsize, r: op.rsize, fill: me.Manner.baseCN});
      id=op.icons[i].id||op.id+"-"+op.icons[i].name;
      y=me.tag("svg", {
        id: id, Margin: op.margin+"px", Height: hi+'px', Width: hi+"px",
        Position: 'absolute', Left: 0, Top: tp+'px', 'Z-index': 1
      }, x);
      m=Math.floor((op.rsize*2+op.margin*2-op.iconSize)/2);
      y+=me.tag("i", {
        "class": "c-fa", "Font-size": op.iconSize+"px", Color: op.color,
        Margin: m+"px", Position: 'absolute', Left: 0, Top: tp+'px', "Z-index": 3
      }, me.icx(op.icons[i].name));
      tp=tp+(op.margin*2+op.rsize*2);
    }
    id="balpage"+me.Now.initialize;
    out=me.tag("div", me.locate({
      id: id, Display: "none", Left: lf+'px', Height: hi+'px'
    }, {parent: op.parent, bottom: true, occupy: false}), y);
    me.Baloon.push({id: id, page: me.Now.initialize});
    return out;
  },
//##########
// toolbar          ツールバー
//
  toolbar: function(op){
    var me=this; op=op||{};
    op.id=op.id||'x-toolbar'+me.Count.header; me.Count.header+=1;
    op.iconMargin=op.iconMargin||me.Manner.iconMargin; op.iconColor=op.iconColor||me.Manner.iconColor;
    op.iconSize=op.iconSize||me.Manner.iconSize;
    op.height=op.height||me.Manner.barHight; op.width=op.width||me.Manner.barWidth;
    op.parent=op.parent||'body'; op.position=op.position||'top';

    var x='', a, css, m;
    m=Math.floor((me.pageX-op.iconSize*op.icons.length)/(op.icons.length*2));
    for(var i in op.icons){
      css={
        "class": 'c-fa '+op.icons[i].name, Color: op.iconColor, Float: "left",
        "Font-size": op.iconSize+"px", Height: op.iconSize+"px", Width: op.iconSize+"px",
        Margin: op.iconMargin+"px "+m+"px"
      };
      x+=me.tag('i', css, me.icx(op.icons[i].name));
    }

    var b; if(op.position=='top'){b=false;}else{b=true;}
    var css=me.locate({
      id: op.id, Height: op.height+"px", Width: op.width, "Z-index": 3,
      "Background-color": me.Manner.barColor
    }, {parent: op.parent, fix: true, bottom: b, occupy: true});
    var out=me.tag('div', css, x);
    me.Cancel.push(op.id);
    if(b){
      if(op.parent=='body'){me.Scale['bodyFooter']=me.Scale.bodyFooter+op.height;}
      else{me.Scale['childFooter']=me.Scale.childFooter+op.height;}
    }else{
      if(op.parent=='body'){me.Scale['bodyHeader']=me.Scale.bodyHeader+op.height;}
      else{me.Scale['childHeader']=me.Scale.childHeader+op.height;}
    }
    return out;
  },
//##########
// lmenu            左スライドメニュー
//
  lmenu: function(op, mode){
    var me=this;
    var Main=function(op){
      op=op||{}; op.page=op.page||true; op.np=op.np||false;
      op.id=op.id||'x-lmenu'+me.Count.lmenu; me.Count.lmenu++;
      op.fontSize=op.fontSize||me.Manner.fontM;
      op.padding=op.padding||Math.floor(op.fontSize/4); op.color=op.color||"#000";
      op.iconColor=op.iconColor||me.Manner.baseCN; op.wirate=85;
      op.backgroundColor=op.backgroundColor||"#FFF"; op.image=op.image||'library/menu.jpg';

      var k, y='', css={}, item={};

      var Body=function(item, ix){
        if(!item.id){item.id=op.id+'-'+i;}
        var x=me.tag('i', {
          "class": "c-fa "+item.name, "Font-size": op.fontSize+"px", Color: op.iconColor,
          Padding: op.padding+"px",
        }, me.icx(item.name));
        x+=me.tag('span', {
          "Font-size": op.fontSize+"px", Color: op.color, Margin: op.margin+"px"
        }, item.title);
        return me.tag('p', {id: item.id, "class": "c-lmenu-item", ix: ix}, x);
      };
      
      for(var i in op.items){
        switch(op.items[i].itype){
          case "img": y+=me.tag('img', {src: op.image, Width: "100%"}, ""); break;
          case "html": y+=me.parm(op.items[i].html, undefined, 0); break;
          case "rec": for(k in REC[op.items[i].recid]){y+=Body(REC[op.items[i].recid][k], k);}
           break;
          default: y+=Body(op.items[i], 0);
        }
      }

      var base=Math.floor(me.pageX*op.wirate/100);
      var n=(me.pageX*-1)+"px";
      var out=me.tag('div', {
        id: op.id, Height: '100%', Width: op.wirate+"%", "Background-image": "url(./library/white.jpg)",
        "Margin-left": n, save: n, Position: "absolute", "Top": 0, "Left": 0, "Z-index": 9,
        Overflow: "hidden", Display: "none"
      }, y);

      me.Monitor.push(op); me.Main[op.id]={option: op, frame: "lmenu"};
      return out;
    };
////
    var Monitor=function(op){
      op=op||{};
      $('#x-modal').on("touchstart", function(){Hide(op);});
      var data={}; var sx, sy, nx, ny, d;
      $('#'+op.id).on({
        'touchstart': function(e){
          sx=event.changedTouches[0].pageX; sy=event.changedTouches[0].pageY;
        },
        'touchmove': function(e){
          e.preventDefault();
          nx=event.changedTouches[0].pageX; ny=event.changedTouches[0].pageY;
          if((nx-sx)<-15){Hide(op);}
        },
        'touchend': function(e){
        }
      });
    };
////
    var Show=function(op){
      op=op||{}; op.ix=op.ix||0; op.animate=op.animate||500;
      op.id=op.id||"x-lmenu"+op.ix;
      if(me.Flag.lmenu){
        $("#"+op.id).css({display: "block"}); $("#x-modal").css({display: "block"});
        $("#"+op.id).animate({'margin-left': 0}, op.animate, function(){me.Flag.lmenu=true;});
        me.Flag.lmenu=false;
      }
    };
////
    var Hide=function(op){
      var n=0; op=op||{}; op.ix=op.ix||0; op.animate=op.animate||500;
      op.id=op.id||"x-lmenu"+op.ix;
      if(me.Flag.lmenu){
        n=$("#"+op.id).attr('save');
        $("#"+op.id).animate({"margin-left": n}, op.animate, function(){
          me.Flag.lmenu=true;
          $("#"+op.id).css({display: "none"});
          $("#x-modal").css({display: "none"});
          $("#x-modal").off("click");
        });
        me.Flag.lmenu=false;
      }
    };
////
    switch(mode){
      case 'monitor': Monitor(op); break; case 'show': Show(op); break;
      case 'hide': Hide(op); break; default: return Main(op);
    }
  },
//##########
// bmenu            ボトムメニュー
//
  bmenu: function(op, mode){
    var me=this;
//Main
    var Main=function(op){
      op=op||{}; op.page=op.page||true; op.np=op.np||false;
      op.id=op.id||'x-bmenu'+me.Count.bmenu; me.Count.bmenu++; op.fontSize=op.fontSize||me.Manner.fontM;
      op.margin=op.margin||op.fontSize; op.color=op.color||"#000"; op.hirate=60;
      op.iconColor=op.iconColor||"#000";
      op.backgroundColor=op.backgroundColor||me.cnx(0);

      var x='', y='', css={}, item={};
      if(op.html){y=me.parm(op.html, undefined, 0);}else{
        for(var i in op.items){
          item=op.items[i]; if(!item.id){item.id=op.id+'-'+i;}
          x=me.tag('i', {
            "class": "c-fa "+item.name, "Font-size": op.fontSize+"px", Color: op.iconColor,
            Margin: op.margin+"px",
          }, me.icx(item.name));
          x+=me.tag('span', {
            "Font-size": op.fontSize+"px", Color: op.color, Margin: op.margin+"px",
          }, item.title);
          y+=me.tag('p', {id: item.id, "class": "c-lmenu-item"}, x);
        }
      }

      var base=Math.floor(me.pageY*op.hirate/100);
      var n=me.pageY+"px";
      var out=me.tag('div', {
        id: op.id, Width: '100%', Height: op.hirate+"%", "Background-color": op.backgroundColor,
        "Margin-top": n, save: n, Position: "absolute", "Top": 0, "Left": 0, "Z-index": 9,
        Overflow: "hidden", Display: "block" // none
      }, y);

      me.Monitor.push(op); Push(op, me.pageY*(100-op.hirate)/100, me.pageY);
      me.Main[op.id]={option: op, frame: "bmenu"};
      return out;
    };
//Monitor
    var Monitor=function(op){
      op=op||{};
      $('#x-modal').on("click", function(){Hide(op);});
      var data={}; var s, n, d, m, p;
      $('#'+op.id).on({
        'touchstart': function(e){
          me.Flag.bmenu=true;
          data.flg=true; s=event.changedTouches[0].pageY; data.ini=0;
        },
        'touchmove': function(e){if(data.flg){
          e.preventDefault();
          n=event.changedTouches[0].pageY; d=n-s;
          p=me.pagY+d+data.ini; m=me.pageY-$("#"+op.id).outerHeight();
          if(p<m){p=m;} if(p>me.pageY){p=me.pageY;}
          $("#"+op.id).css({"margin-top": p+"px"});
        }},
        'touchend': function(e){
          if(d>15){data.flg=false; Hide(op);}else{Show(op);}
        }
      });
    };
//Show
    var Show=function(op){
      op=op||{}; op.ix=op.ix||0; op.animate=op.animate||500;
      op.id=op.id||"x-bmenu"+op.ix;
      if(me.Flag.bmenu){
        var m=me.pageY-$("#"+op.id).outerHeight();
        $("#"+op.id).css({display: "block"}); $("#x-modal").css({display: "block"});
        $("#"+op.id).animate({'margin-top': m+"px"}, op.animate, function(){me.Flag.bmenu=true;});
        me.Flag.bmenu=false;
      }
    };
//Hide
    var Hide=function(op){
      var n=0; op=op||{}; op.ix=op.ix||0; op.animate=op.animate||500;
      op.id=op.id||"x-bmenu"+op.ix;
      if(me.Flag.bmenu){
        n=$("#"+op.id).attr('save');
        $("#"+op.id).animate({"margin-top": n}, op.animate, function(){
          me.Flag.bmenu=true;
//          $("#"+op.id).css({display: "none"});
          $("#x-modal").css({display: "none"});
          $("#x-modal").off("click");
        });
        me.Flag.bmenu=false;
      }
    };
//Push
    var Push=function(op, min, max){
      for(var i in me.Scroll){if(me.Scroll[i].parent==op.parent){
        me.Scroll[i].bmenuid=op.id; me.Scroll[i].maxM=max; me.Scroll[i].minM=min;
      }}
    };
//Exec
    switch(mode){
      case 'monitor': Monitor(op); break; case 'show': Show(op); break;
      case 'hide': Hide(op); break; default: return Main(op);
    }
  },
//##########
// tmenu            テキストメニュー
//
  tmenu: function(op, mode){
    var me=this;
//Main
    var Main=function(op){
      var x, y, css, item, p, i, hi, wi, out, b, w;

      op=op||{}; op.id=op.id||'x-tmenu'+me.Count.tmenu; me.Count.tmenu++;
      op.fontSize=op.fontSize||me.Manner.fontM; op.padding=op.padding||[2, op.fontSize];
      op.color=op.color||"#000"; op.backgroundColor=op.backgroundColor||me.manner.baseCN;
      op.fixwidth=op.fixwidth||0; op.balanced=op.balanced||false;

      if(op.balanced){p=op.padding[0]+"px 0"}
      else{p=''; for(i in op.padding){p+=' '+op.padding[i]+'px';}}
      if(op.fixwidth){w=op.fixwith+"px";}else{w='';}
      x=''; b=''; for(var i in op.items){
        item=op.items[i]; if(!item.id){item.id=op.id+'-'+i;}
        x+=me.tag('span', {
          "Font-size": op.fontSize+"px", Color: op.color, Padding: p, Height: op.fontSize+"px",
          Display: "block", "Float": "left", Width: w, "Border-left": b
        }, item.title);
        b="1px solid gray";
      }

      hi=op.fontSize+op.padding[0]*2; y='';
      if(op.balanced){wi=me.pageX;}else{wi=me.pageX-48;}
      if(!op.balanced)
        {y+=me.icontag('backward', {"font-size": "24px", "float": "left"}, op.id+"-rwd");}
      y+=me.tag('div', {
        Height: hi+"px", Width: wi+"px", Overflow: "hidden", Display: "block", "Float": "left"
      }, me.tag('div',{id: op.id, Height: hi+"px", min: wi}, x));
      if(!op.balanced)
        {y+=me.icontag('forward', {"font-size": "24px", "float": "left"}, op.id+"-fwd");}
      out=me.tag('div', me.locate(
        {Height: hi+"px", Width: "100%", "Z-index": 9}, {parent: op.parent}
      ), y);
      me.Main[op.id]={option: op, frame: "tmenu"};
      me.Monitor.push(op);
      me.Cancel.push(op.id+'-fwd'); me.Cancel.push(op.id+'-rwd');
      return out;
    };
//Adjust
    var Adjust=function(opc){
      var aw, po=[], i, op, min, w, x, r, l;
      for(var id in me.Main){if(opc.id==undefined || opc.id==id){if(me.Main[id].frame=="tmenu"){
        op=me.Main[id].option;
        if(op.balanced){
          w=Math.floor(me.pageX/op.items.length)-1;
          $('#'+op.id).children().each(function(){
            $(this).css({"width": w+"px", "text-align": "center", overflow: "hidden"});
          });
        }else{
          aw=0; i=0; $('#'+op.id).children().each(function(){
            po.unshift(aw*-1); aw=aw+$(this).outerWidth();
          });
          $('#'+op.id).css({width: aw+"px", "margin-left": "0px"});
          $("#"+op.id).attr('pos', JSON.stringify(po));
          min=$("#"+op.id).attr("min")-0;
          $('#'+op.id+'-rwd').css({opacity: 0.1});
          if(min>aw){$('#'+op.id+'-fwd').css({opacity: 0.1});}
          $("#"+op.id).attr("min", min-aw);
        }
      }}}
    };
//Monitor
    var Monitor=function(op){
      var data={}, s, n, d, i, po, m, min, svm, p;
      svm=0;
      if(op.balanced){return;}
      $('#'+op.id).on({
        'touchstart': function(e){
          data.flg=true; s=event.changedTouches[0].pageX;
          data.ini=pic($('#'+op.id).css('margin-left'));
        },
        'touchmove': function(e){if(data.flg){
          e.preventDefault();
          n=event.changedTouches[0].pageX; d=n-s;
          min=$('#'+op.id).attr('min')-0;
          if(svm==0){$('#'+op.id+'-rwd').css({opacity: 1});}
          if(svm==min){$('#'+op.id+'-fwd').css({opacity: 1});}
          m=data.ini+d*3;
          if(m>=0){m=0; $('#'+op.id+'-rwd').css({opacity: 0.1});}
          if(m<=min){m=min; $('#'+op.id+'-fwd').css({opacity: 0.1});}
          $('#'+op.id).css({"margin-left": m+"px"});
          svm=m;
        }},
        'touchend': function(e){
          data.ini=data.ini+d;
        }
      });

      $('#'+op.id+'-fwd').on('touchstart', function(){
        var po=JSON.parse($('#'+op.id).attr('pos')); var l=pic($('#'+op.id).css("margin-left"));
        var min=$('#'+op.id).attr('min')-0;
        if(svm==0){$('#'+op.id+'-rwd').css({opacity: 1});}
        if(svm==min){$('#'+op.id+'-fwd').css({opacity: 1});}
        i=po.length; f=true; while(f && i>=0){if(po[i]<l){
          if(po[i]<min){po[i]=min;} m=po[i];
          $('#'+op.id).animate({"margin-left": m+"px"}, 300); f=false;
        } i--; p=m;}
        if(m<=min || po[i-1]<=min){m=min; $('#'+op.id+'-fwd').css({opacity: 0.1});}
        svm=m;
      });
      $('#'+op.id+'-rwd').on('touchstart', function(){
        var po=JSON.parse($('#'+op.id).attr('pos')); var l=pic($('#'+op.id).css("margin-left"));
        var min=$('#'+op.id).attr('min')-0;
        if(svm==0){$('#'+op.id+'-rwd').css({opacity: 1});}
        if(svm==min){$('#'+op.id+'-fwd').css({opacity: 1});}
        i=0; f=true; while(f && i<po.length){if(po[i]>l){
          m=po[i];
          $('#'+op.id).animate({"margin-left": m+"px"}, 300); f=false;
        } i++;}
        if(m>=0){m=0; $('#'+op.id+'-rwd').css({opacity: 0.1});}
        svm=m;
      });
    };
//Pic
    var pic=function(x){x=x+" "; return x.substr(0, x.indexOf("px"))-0;};
//Exec
    switch(mode){
      case 'monitor': Monitor(op); break; case 'adjust': Adjust(op); break;
      default: return Main(op);
    }
  },
//##########
// panel            パネルコンテンツ
//
  panel: function(op, mode){
    var me=this;
//Main
    var Main=function(op){
      var x='', y='';
      op=op||{}; op.height=op.height||me.Manner.maxHeight+"px"; op.width=op.wirate||100;
      op.frame=op.frame||'panel'; op.id=op.id||'x-panel'+me.Count.panel; op.parent=op.parent||'body';
      op.html=op.html||"NOT DEFINED";

      me.Count.panel++;
      var x=me.tag('div', me.locate({
        id: op.id, "class": "c-case", Width: op.width+"%"
      }, {parent: op.parent}), Body(op));
      var id="x-flick"+me.Count.flick; var out=me.tag('div', {id: id}, x);
      var h; if(me.Manner.frame=="single"){h=false;}else{h=true;}
      me.Count.flick++;
      me.Scale['id']=id;
      me.Scroll.push({
        id: id, objectid: op.id, horizontal: h, vertical: true, parent: op.parent, windowhi: 0
      });
      me.Main[op.id]={option: op, frame: "panel", flickid: id};
      return out;
    };
//Body
    var Body=function(op){
      return me.parm(op.html, undefined, 0);
    };
//Adjust
    var Adjust=function(op){
      for(var id in me.Main){if(me.Main[id].frame=="panel"){
        
      }}
    };
//Refresh
    var Refresh=function(op){
      op=op||{}; op.id=op.id||"x-panel0";
      if(me.Main[op.id]){
        var x=Body(me.Main[op.id].option); $("#"+op.id).html(x);
        Adjust({id: op.id});
      }
    };
//Exec
    switch(mode){
      case 'body': return Body(op); case 'adjust': Adjust(op); break;
      case 'refresh': Refresh(op); break; default: return Main(op);
    }
  },
//##########
// list             リストコンテンツ
//
  list: function(op, mode){
    var me=this;
//Main
    var Main=function(op){
      var x='', y='';
      op=op||{}; op.height=op.height||Math.floor(me.Manner.maxHeight/12); op.width=op.width||100;
      op.frame='list'; op.id=op.id||'x-list'+me.Count.list; me.Count.list++; op.parent=op.parent||'body';
      op.fontSize=op.fontSize||me.Manner.fontS; if(op.padding==undefined){op.padding='auto';}
      op.border=op.border||1;
      var id="x-flick"+me.Count.flick; me.Count.flick++;
      var y=me.tag('div', me.locate({
        id: op.id, "class": "c-case", Width: op.width+"%"
      }, {parent: id}), Body(op, op.recid));
      me.Main[op.id]={option: op, frame: "list", flickid: id, recid: op.recid};
      var out=me.tag('div', me.locate({id: id, Width: op.width+"%"}, {parent: op.parent}), y);
      var h; if(me.Manner.frame=="single"){h=false;}else{h=true;}
      me.Scale['id']=id;
      me.Scroll.push({id: id, objectid: op.id, horizontal: h, vertical: true, windowhi: 0});
      return out;
    };
//Body
    var Body=function(op, recid){
      var x="", y, p, save;
      op=op||{}; recid=recid||me.recid;
      if(op.html.search('&{')>-1){y=me.parm(op.html);}else{y=op.html;}
      if(isFinite(op.padding)){p=op.padding;}else{p=0;}
      save=me.recid; me.recid=recid;
      for(var i in REC[recid]){
        x+=me.tag('div', {
          id: "x-line-"+recid+i, "class": "c-line-"+recid, Width: op.width, Padding: p+"px",
          "Font-size": op.fontSize+"px", "Border-bottom": op.border+"px solid grey",
          Overflow: "hidden"
        }, me.parm(y, undefined, i));
      }
      me.recid=save;
      return x;
    };
//Adjust
    var Adjust=function(op){
      var hi=0, mx=0, wh=0, ct=0;
      for(var id in me.Main){if(op.id==undefined || op.id==id){if(me.Main[id].frame=="list"){
        wh=0;
        $("#"+id).children().each(function(){
          if(me.Main[id].option.padding=="auto"){
            hi=$(this).outerHeight(); mx=me.Main[id].option.height;
            t=Math.floor((mx-hi)/2); b=mx-hi-t;
            $(this).css({padding: t+"px 5px "+b+"px 5px"});
          }else{mx=$(this).outerHeight();}
          wh=wh+mx; ct++;
        });
        me.Main[id].count=ct;
//        $('#'+me.Main[id].flickid).css({height: me.Main[id].effect+"px"});
      }}}
    };
//Refresh
    var Refresh=function(op){
      op=op||{}; op.id=op.id||"x-list0";
      if(me.Main[op.id]){
        var x=Body(me.Main[op.id].option, me.Main[op.id].recid); $("#"+op.id).html(x);
        Adjust({id: op.id});
      }
    };
//Exec
    switch(mode){
      case 'body': return Body(op); case 'adjust': Adjust(op); break;
      case 'refresh': Refresh(op); break; default: return Main(op);
    }
  },
//##########
// table            テーブルコンテンツ
//
  table: function(op, mode){
    var me=this;
//Main
    var Main=function(op){
      var x='', out, h, hid, id;
      op=op||{}; op.recid=op.recid||me.recid; op.fontSize=op.fontSize||me.Manner.fontM;
      op.padding=op.padding||2; op.border=op.border||1;
      op.width=op.width||100; op.header=op.header||{};
      op.header.fontSize=op.header.fontSize||op.fontSize;
      op.header.height=op.header.height||op.header.fontSize+4;
      op.header.backgroundColor=op.header.backgroundColor||me.Manner.baseCN;
      op.manner=op.manner||{}; op.manner.width=op.manner.width||50;
      op.manner.padding=op.manner.padding||op.padding;
      op.manner.fontSize=op.manner.fontSize||op.fontSize; op.manner.height=op.manner.height||20;
      op.columns=op.columns||[];

      op.frame='table'; op.id=op.id||'x-table'+me.Count.table; me.Count.table++;
      op.parent=op.parent||'body';

      hid='header'+me.Count.header; me.Count.header++;
      out=Head(op, op.recid, hid);

      id="x-flick"+me.Count.flick; me.Count.flick++;
      x=me.tag('div', me.locate({id: op.id, "class": "c-case"}, {parent: id}), Body(op, op.recid), true);
      me.Main[op.id]={option: op, frame: "table", flickid: id, headerid: hid, recid: op.recid};
      out+=me.tag('div', me.locate({id: id, Width: op.width+"%"}, {parent: op.parent}), x);
      if(me.Manner.frame=="single"){h=false;}else{h=true;}
      me.Scale['id']=id;
      me.Scroll.push({id: id, objectid: op.id, horizontal: h, vertical: true, windowhi: 0});
      return out;
    };
//Head
    var Head=function(op, recid, hid){
      var x='', c=''; op=op||{}; recid=recid||me.recid;
      for(var i in op.columns){
        c=op.columns[i]; c.width=c.width||op.manner.width; c.fontSize=c.fontSize||op.manner.fontSize;
        c.height=c.height||op.header.height;
        x+=me.tag('span', {
          "class": 'c-tb'+i, Width: c.width+"px", Height: op.header.height+"px",
          "Font-size": c.fontSize+"px", Display: "block", "Float": "left", Overflow: "hidden",
          "Border-left": op.border+"px solid gray", "Word-wrap": "word-break"
        }, c.name);
      }

      var out=me.tag('div', me.locate({
        id: hid, Height: op.header.height+"px", "Z-index": 3,
        "Background-color": op.header.backgroundColor
      }, {parent: op.parent}), x);
      me.Cancel.push(hid);
      if(op.parent=='body'){me.Scale['bodyHeader']=me.Scale.bodyHeader+op.header.height;}
      else{me.Scale['childHeader']=me.Scale.childHeader+op.header.height;}
      return out;
    };
//Body
    var Body=function(op, recid){
      var x='', c; op=op||{}; recid=recid||me.recid;
      for(var i in REC[recid]){
        for(var j in op.columns){
          c=op.columns[j]; c.width=c.width||op.manner.width; c.fontSize=c.fontSize||op.manner.fontSize;
          x+=me.tag('span', {
            "class": 'c-tb'+c.field, "Font-size": c.fontSize+"px", //Width: c.width+"px",
            Overflow: "hidden", //Padding: op.manner.padding, Height: op.manner.height+"px",
            "Border-left": op.border+"px solid gray", "Border-bottom": op.border+"px solid gray",
            Display: "block", "Float": "left", "Word-wrap": "break-word"
          }, REC[recid][i][c.field]);
        }
      }
      return x;
    };
//Adjust
    var Adjust=function(opc){
      var hi, ah, wi, mhh, mbh, ct, cw, i, hid, d, mw, aw, op;
      for(var id in me.Main){if(opc.id==undefined || opc.id==id){if(me.Main[id].frame=="table"){
        ah=0; i=0, ct=0, cw=0; mhh=0; mbh=0; mw=[], nw=[], ow=[];
        op=me.Main[id].option;
        hid=me.Main[id].headerid;
        cw=0; $("#"+hid).children('span').each(function(){mw[cw]=0; cw++;});
        i=0; $("#"+id).children('span').each(function(){
          wi=$(this).outerWidth(); if(wi>mw[i]){mw[i]=wi;}
          if(i==0){ct++;} i++; if(i>=cw){i=0;}
        });

        aw=0; for(i in mw){aw=aw+mw[i]+op.padding*2;} r=(me.pageX-cw*op.padding*2-2)/aw;
        aw=0; for(i in mw){nw[i]=Math.floor(mw[i]*r); aw=aw+nw[i];}
        d=me.pageX-cw*op.padding*2-2-aw-op.border*cw;
        i=0; while(d>0){
          nw[i]=nw[i]+1;
           d--; i++; if(i>=cw){i=0;}}

        i=0; $("#"+hid).children('span').each(function(){
          $(this).css({width: nw[i]+"px", padding: "0 "+op.padding+"px"});
          i++;
        });
        i=0; $("#"+id).children('span').each(function(){
          $(this).css({width: nw[i]+"px", padding: "0 "+op.padding+"px"});
          i++; if(i>=cw){i=0;}
        });

        $("#"+hid).children('span').each(function(){
          hi=$(this).outerHeight(); if(mhh<hi){mhh=hi;}
          i++; cw++;
        });
        $("#"+id).children('span').each(function(){
          hi=$(this).outerHeight(); if(mbh<hi){mbh=hi;}
          if(i==0){ct++;} i++; if(i>=cw){i=0;}
        });

        $("#"+hid).children('span').each(function(){
          d=mhh-$(this).outerHeight(); $(this).css({"padding-top": "2px", "padding-bottom": d+"px"});
        });
        $("#"+id).children('span').each(function(){
          d=mbh-$(this).outerHeight(); $(this).css({"padding-top": "2px", "padding-bottom": d+"px"});
        });

        me.Main[id].count=ct;
      }}}
    };
//Refresh
    var Refresh=function(op){
      op=op||{}; op.id=op.id||"x-taable0";
      if(me.Main[op.id]){
        var x=Body(me.Main[op.id].option, me.Main[op.id].recid); $("#"+op.id).html(x);
        Adjust({id: op.id});
      }
    };
//Exec
    switch(mode){
      case 'body': return Body(op); case 'adjust': Adjust(op); break;
      case 'refresh': Refresh(op); break; default: return Main(op);
    }
  },
//#########
// scroll           スクロール動作
//
  scroll: function(op){
    op=op||{}; op.id=op.id||'x-flick'; op.pos=op.pos||48;
    var me=this, data={}, start={x: 0, y: 0, t: 0}, now={x: 0, y: 0, t: 0};
//Pic
    var pic=function(x){x=x+" "; return x.substr(0, x.indexOf("px"))-0;};
//Main
    var Main=function(op){
      data.flg=false; data.an=true;
      
      data.maxY=0; data.ini=0; data.left=0;
      data.windowhi=op.windowhi; data.bodyhi=$('#'+op.id).find('.c-case').outerHeight();
      var h= $('#'+op.id).outerHeight();
      if(h<data.windowhi){$('#'+op.id).css({height: data.windowhi+"px"});}
      data.minY=data.windowhi-data.bodyhi;
      data.maxX=0; data.minX=me.pageX*(1-me.Count.page); data.rate=1/me.Count.page;
      $('#'+op.id).on({
        'touchstart': function(e){if(data.an){if(event.changedTouches){Start();}}},
        'touchmove': function(e){e.preventDefault(); if(data.an && data.flg){Move(op);}},
        'touchend': function(e){if(data.an && data.flg){End();}}
      });
      var x=$('#'+op.id).find('.c-case').attr("class"); x+=' clearfix';
      $('#'+op.id).find('.c-case').attr("class", x);
    };
//Start
    var Start=function(){
      data.flg=true; data.xy='x';
      data.iniX=pic($('#x-slide').find('.c-cage').css('margin-left'));
      data.iniM=me.pageY;
      start.x=event.changedTouches[0].pageX;
      start.y=event.changedTouches[0].pageY;
      var t=new Date(); start.t=t.getTime();
//console.log('start', start, data);
    };
//Move
    var Move=function(op){
      var m, l;
      now.x=event.changedTouches[0].pageX; data.dx=now.x-start.x;
      now.y=event.changedTouches[0].pageY; data.dy=now.y-start.y;
      if(Math.abs(data.dy*2)>Math.abs(data.dx)){data.xy='v';}
      else{if(op.horizontal){data.xy='h';}else{data.xy='v';}}
      
      if(data.xy=="v" && op.bmenuid && start.y>525){data.xy='m';}
      switch(data.xy){
        case 'h':
          m=data.iniX+data.dx; if(m<data.minX){m=data.minX;} if(m>data.maxX){m=data.maxX;}
          $('#x-slide').find('.c-cage').css({'margin-left': m+"px"});
          if(op.slider!="no"){l=Math.floor(m*data.rate*-1); $('#x-slider').css({'margin-left': l+"px"});}
          break;
        case 'v':
          m=data.dy+data.ini;
          if(m<data.minY){m=data.minY;} if(m>data.maxY){m=data.maxY;}
          $('#'+op.id).find('.c-case').css({'margin-top': m+"px"});
          break;
        case 'm':
          m=data.dy+data.iniM; if(m<op.minM){m=op.minM;} if(m>op.maxM){m=op.maxM;}
          $('#'+op.bmenuid).css({'margin-top': m+"px"});
          break;
        default: break;
      }
//console.log('move', now, data);
    };
//End
    var End=function(){
      data.flg=false;
      var et=new Date(); et=et.getTime(); var m, l, t;
      var dt=et-start.t; var vx=(now.x-start.x)/dt; var vy=(now.y-start.y)/dt; var diff=0;
      switch(data.xy){
       case 'h':
        switch(true){
          case data.dx>70 : m=data.iniX+me.pageX; if(m>data.maxX){m=data.maxX;} diff=-1; break;
          case data.dx<-70 : m=data.iniX-me.pageX; if(m<data.minX){m=data.minX;} diff=1; break;
          default: m=data.iniX; break;
        }
        me.Now.page=me.Now.page+diff;
        if(me.Now.page<0){me.Now.page=0;}
        if(me.Now.page>=me.Slide.length){me.Now.page=me.Slide.length-1;}
        me.pageChange(me.Now.page);
        $('#x-slide').find('.c-cage').animate({'margin-left': m+"px"}, 300, "swing", function(){
          data.an=true;
        });
        data.an=false;
        if(op.slider!="no"){
          l=Math.floor(m*data.rate*-1);
          $('#x-slider').animate({'margin-left': l+"px"}, 300, "swing");
        }
        break;
       case 'v':
        now.y=event.changedTouches[0].pageY; data.dy=now.y-start.y;
        if(Math.abs(data.dy)>5){
          t=Math.floor(Math.abs(vy*1500)); m=Math.floor(data.dy+data.ini+vy*t);
          if(m<data.minY){m=data.minY;} if(m>data.maxY){m=data.maxY;}
          $('#'+op.id).find('.c-case').animate({'margin-top': m+"px"}, t, "swing", function(){
            data.an=true;
          });
          data.an=false;
          data.ini=m;
        }
        break;
       case 'm':
        now.y=event.changedTouches[0].pageY; data.dy=now.y-start.y;
        if(Math.abs(data.dy)>5){
          $('#'+op.bmenuid).animate({'margin-top': op.minM+"px"}, 500, "swing", function(){
            data.an=true;
          });
          me.bmenu({id: op.bmenuid}, 'monitor');
          data.an=false;
          data.iniM=m;
        }
        break;
       default: break;
      }
//console.log('end', data);
    };
//Exec
    Main(op);
  },
//##########
// cancel           スクロールキャンセル
//
  cancel: function(){
    var me=this;
    for(var i in me.Cancel){
      $('#'+me.Cancel[i]).on('touchmove', function(e){e.preventDefault();});
    }
  },
//##########
// locate           位置計算とCSS出力 
//
  locate: function(out, op){
    var me=this, now={}; op=op||{};
    if(op.fix==undefined){op.fix=false;} if(op.nl==undefined){op.nl=true;}
    op.parent=op.parent||'body';
    if(!me.Grid[op.parent]){me.Grid[op.parent]={x: 0, y: 0, sx: 0, sy: 0, b: 0};}
    now=me.Grid[op.parent];

    var pic=function(x){x=x+" "; return x.substr(0, x.indexOf("px"))-0;};

    if(op.bottom){
      out.Position='fixed'; out.Bottom=now.b+"px";
      if(op.occupy){now.b=now.b+pic(out.Height);}
    }else{
      if(op.height=="remain"){out.Height=me.pageY-now.y-now.sy-now.b+"px";}
      if(op.fix){out.Position='fixed';}else{out.Position='absolute';}
      if(op.nl){now.x=0; now.y+=now.sy;}else{now.x+=now.sx;}
      out.Top=now.y+"px"; out.Left=now.x+"px";
      if(out.Height){now.sy=pic(out.Height);}else{now.sy=0;}
      if(out.Width){now.sx=pic(out.Width);}else{now.sx=0;}
    }
//console.log('locate', op.parent, now);
    me.Grid[op.parent]=now;
    return out; 
  },
//##########
// pageChange       ページ替わり検出
//
  pageChange: function(page){
    var me=this, c;
    for(var ix in me.Baloon){
      if(me.Baloon[ix].page==page){$("#"+me.Baloon[ix].id).css({display: "block"});}
      else{$("#"+me.Baloon[ix].id).css({display: "none"});}
    }
    for(var ix in me.Slide){
      if(me.Slide[ix].page==page){c=$("#"+me.Slide[ix].id).find('i').attr('saveon');}
      else{c=$("#"+me.Slide[ix].id).find('i').attr('saveof');}
      $("#"+me.Slide[ix].id).find('i').css({color: c});
    }
  },
//##########
// show             画面表示コマンド
//
  show: function(op){
    var me=this; op.ptype=op.ptype||me.Main[op.id];
    switch(op.ptype){
     case "lmenu": me.lmenu(op, 'show'); break;
     case "bmenu": me.bmenu(op, 'show'); break;
     case "loading": me.loading(op); break;
     default: break;
    }
  },
//##########
// hide             画面消去コマンド
//
  hide: function(op){
    var me=this; op.ptype=op.ptype||me.Main[op.id];
    switch(op.ptype){
     case "lmenu": me.lmenu(op, 'hide'); break;
     case "bmenu": me.bmenu(op, 'hide'); break;
     case "loading": $("#x-loading").css({display: "none"}); break;
     default: break;
    }
  },
//##########
// refresh          画面更新コマンド
//
  refresh: function(op){
    var me=this; op.ptype=op.ptype||me.Main[op.id];
    op=op||{}; op.id=op.id||"x-list0";
    if(me.Main[op.id]==undefined){console.log('Id Not Found id='+op.id+'(pos: refresh)'); return;}
    op.ptype=me.Main[op.id].frame;
    switch(op.ptype){
      case "list": me.list(op, 'refresh'); break;
      case "panel": me.panel(op, 'refresh'); break;
      default: break;
    }
    me.alignment();
  },
//##########
// effect           表示効果操作
//
  effect: function(txt){
    var me=this, op={};
    if(typeof(txt)=="string"){
      try{op=JSON.parse(txt);}catch(e){alert(e); console.log("ERROR DATA", txt);}
    }else{op=txt;}
//Main
    var Main=function(op){
      for(var i in op){
        switch(op[i].type){
         case "button":
          op[i]["class"]=op[i]["class"]||"c-button";
          op[i].cname=op[i].cname||me.Manner.baseColor; op[i].weight=op[i].weight||"bold";
          op[i].align=op[i].align||"center";
          op[i].spec=op[i].spec||'flat'; op[i].border=op[i].border||2;
          op[i].color=op[i].color||me.Manner.fontColor;
          op[i].size=op[i].size||me.Manner.fontM; op[i].width=op[i].width||100;
          op[i].height=op[i].height||op.size;
          if(op[i].space==undefined){Math.floor(op[i].size*0.8);}
          Button(op[i]);
          break;
         case "box":
          op[i]["class"]=op[i]["class"]||"c-box";
          op[i].weight=op[i].weight||"bold";
          op[i].align=op[i].align||"left";
          op[i].border=op[i].border||1;
          op[i].color=op[i].color||me.Manner.fontColor;
          op[i].size=op[i].size||me.Manner.fontS;
          op[i].padding=op[i].padding||2;
          Box(op[i]);
          break;
         default: break;
        }
      }
    };
//Button
    var Button=function(op){
      var css={};
      $('.'+op["class"]).each(function(){
        var x=$(this).attr('icon'); if(x){
          $(this).prepend(me.tag('i', {"class": "c-fa", Color: me.cnx(1, op.cname)}, me.icx(x)));
        }
      });
      css={
        "text-decoration": "none", "font-weight": op.weight, "text-align": op.align,
        "font-size": op.size+"px", "display": "block", "background-color":  me.cnx(0, op.cname)
      };
      if(op.spec=="flat"){
        css=me.merge(css, {
          background: "#"+me.cnx(0, op.cname),
          border: "1px solid #"+me.cnx(0, op.cname), color: op.color,
          width: op.width+"px", height: op.height+"px", padding: op.space+"px 0"
        });
      }else{
        css=me.merge(css, {
          background: "-webkit-gradient(linear, left top, left bottom, from(#"+me.cnx(2, op.cname)+"), to(#"+me.cnx(1, op.cname)+"))",
          border: "1px solid #"+me.cnx(0, op.cname), color: op.color,
          width: op.width+"px", height: op.height+"px", padding: op.space+"px 0"
        });
      }
      if(op.grad){
        var x="-webkit-gradient(linear, left top, left bottom, from(#"+me.cname(2, op.cname)+")";
        x+=", color-stop(0.5,#"+me.cnx(4, op.cname)+"), color-stop(0.5,#"+me.cnx(3, op.cname)+"), to(#"+me.cnx(1, op.cname)+"))";
        css=me.merge(css, {
          background: x});
      }
      if(op.radius){
        css=me.merge(css, {"-webkit-border-radius": op.radius+"px"});
      }
      if(op.shadow){
        css=me.merge(css, {"-webkit-box-shadow": "1px 1px 1px rgba(000,000,000,0.3)"});
      }
      if(op.white){
        css=me.merge(css, {border: "2px solid #FFF"});
      }
      if(op.css){css=me.merge(css, op.css);}
      if(op['return']){return css;}else{$('.'+op["class"]).css(css);}
    };
//Box
    var Box=function(op){
      var s, a, h, w, f;
      $('.'+op["class"]).each(function(){

        s=$(this).attr('size'); a=s.split('x');
        $(this).css({
          width: a[0]+"px", height: a[1]+"px", //"border-bottom": op.border+"px solid gray",
          display: "block", "float": "left" , overflow: "hidden"
        });

        $(this).children().each(function(){
          s=$(this).attr('size'); a=s.split('x');
          h=a[1]-op.padding*2; w=a[0]-op.padding*2;
          f=$(this).attr('font'); f=f||op.size;
          $(this).css({
            width: w+"px", height: h+"px", padding: op.padding+"px", "font-size": f+"px",
            display: "block", "float": "left", Overflow: "hidden"
          });
        });

      });
    };
//Fold
    var Fold=function(op){
      var i, t;
      $('.'+op["class"]).each(function(){
        
        i=0; t=0; z=5; $(this).children().each(function(){
          $(this).attr('ix', i);
          $(this).css({position: "absolute", left: 0, top: t+"px", "z-index": z});
          t=t+op.tHi+op.sHi; i++; z++;
        });

        $('.'+op["class"]).find('.holdhead').on('click', function(){
          if($(this).attr('status')=='open'){
            $(this).attr('status', 'open'); t=$(this).next().positiion().top+$(this).attr('body');
          }else{
            $(this).attr('status', 'close'); t=$(this).next().positiion().top-$(this).attr('body');
          }
          $(this).next().animate({top: t+"px"}, 300);
        });

      });
    };
//Exec
    Main(op);
  },
//##########
// alignment         位置、サイズ合わせ
//
  alignment: function(id){
    var me=this;
//Main
    var Main=function(obj){
      var l, aw, mw, w, ah, mh, h, m, n, r, i, pl, pr, pt, pb, sp, oh=[];
      mw=0; mh=0;
      aw=obj.attr("width"); if(!aw){aw=me.pageX;} sp=obj.attr("space"); sp=sp||0; sp=sp-0;
      obj.css({margin: 0, paddig: 0, width: aw+"px"});
      i=0; obj.children().each(function(){
        w=$(this).outerWidth(); if(mw<w){mw=w;}
        h=$(this).outerHeight(); if(mh<h){mh=h;} oh[i]=h; i++;
      });
      n=Math.floor(aw/mw); if(i<n){n=i;}
      m=Math.floor((aw-mw*n)/(n*2));
      r=Math.floor((aw-mw*n-m*(n-1)*2)/2);
      i=1; ah=0; j=0;
      obj.children().each(function(){
        h=oh[j];
        pl=m+"px"; pr=m+"px"; if(i==1){pl=r+"px";} if(i==n){pr=r+"px";}
        d=mw-$(this).outerWidth(); w=$(this).width()+d;
        d=mh-h;
        $(this).css({"margin-left": pl, "margin-right": pr, "width": w+"px", "float": "left"});
        $(this).css({"margin-top": sp+"px", "margin-bottom": d+sp+"px"});
        if(i==1){ah=ah+mh+sp*2;}
        if(i==n){i=0;}
        i++; j++;
      });
      obj.css({height: ah+"px"});
    };
//Exec
    if(id){$("#"+id).each(function(){Main($(this));});}
    else{$(".c-alignment").each(function(){Main($(this));});}
  },
//##########
// adjust
//
  adjust: function(id){
    var me=this;
////
    var Main=function(obj){
      var ah, mh=0, h, m, d, i, oh=[];
      i=0; obj.children().each(function(){
        h=$(this).outerHeight(); if(mh<h){mh=h;} oh[i]=h; i++;
      });
      i=0; ah=0;
      obj.children().each(function(){
        d=$(this).css("padding-top")+mh-oh[i];
        $(this).css({"padding-top": d, "margin": 0});
        ah+=mh;
      });
      obj.css({height: ah+"px"});
    };
////
    if(id){$('#'+id).each(function(){Main($(this));});}
    else{$(".adjust").each(function(){Main($(this));});}
  },
//##########
// dialog           ダイアログ表示
//
  dialog: function(op){
    var me=this; op=op||{}; op.type=op.type||'message';
    op.radius=op.radius||5; op.width=op.width||Math.floor(me.pageX*0.8);
    op.size=op.size||me.Manner.fontM;
    op.baseColor=op.baseColor||me.Manner.baseColor; op.align=op.align||'center';
    op.title=op.title||"確認"; op.message=op.message||"確認メッセージです";
    op.selcolor=op.selcolor||'#'+me.cnx(0);
//Main
    var Main=function(op){
      switch(op.type){
       case "items":
        var x=Title(op); x+=Items(op); Footer(op, x, {yes: false, can: true});
        me.alignment('x-diabutton'); me.adjust('x-diacase'); Positining(op); Scroll({id: "x-diawindow"});
        return Monitor(op);
       case "multi":
        var x=Title(op); x+=Items(op); Footer(op, x, {can: true});
        me.alignment('x-diabutton'); me.adjust('x-diacase'); Positining(op); Scroll({id: "x-diawindow"});
        return Monitor(op);
       case "progress":
        op=me.merge(op, {ptype: "loading", size: 80}); me.show(op);
        return;
       default:
        var x=Title(op); x+=Message(op); Footer(op, x);
        me.alignment('x-diabutton'); Positining(op); Scroll({id: "x-diawindow"});
        return Monitor(op);
      }
    };
//Title
    var Title=function(op){
      return me.tag('div', {id: "x-diatitle",
        "-webkit-border-radius": op.radius+"px "+op.radius+"px 0px 0px", Display: "block",
        "Background-color": me.cnx(2, op.baseColor), "Text-align": op.align,
        "Color": "#FFF", "Font-size": op.size+"px", Width: op.width+"px", Padding: op.size+"px 0"
      }, op.title);
    };
//Message
    var Message=function(op){
      return me.tag('div', {
        id: "x-diawindow", Width: op.width+"px", Display: "block", Overflow: "hidden"
      }, me.tag('div', {
        "class": "c-case",  Width: op.width+"px", Display: "block", "Text-align": "left",
        "Background-image": "url(./library/white.jpg)"
      }, op.message));
    };
//Items
    var Items=function(op){
      var y='', c; if(op.type=='multi'){c="dialogchip";}else{c="dialogsel";}
      for(var i in op.items){
        y+=me.tag('div', {id: "x-diaitems"+i, "class": c, data: i,
          "Text-align": "center", Display: "block", "Background-color": "#FFF",
          Width: op.width+"px", "Font-size": op.size+"px",
          Padding: op.size+"px 0", Border: "1px solid gray"
        }, op.items[i]);
      }
      return me.tag('div', {
        id: "x-diawindow", Width: op.width+"px", Display: "block", Overflow: "hidden"
      }, me.tag('div', {id: "x-diacase", "class": "c-case",  Width: op.width+"px", Display: "block"}, y));
    };
//Footer
    var Footer=function(op, html, ap){
      ap=ap||{}; op=me.merge(op, ap); if(op.yes==undefined){op.yes=true;}

      var x='';
      if(op.yes){
        x+=me.tag('span', {id: "x-dialogok", "class": "c-dialogsel c-diabtn", data: "yes"}, "OK");
      }
      if(op.no){
        x=me.tag('span', {id: "x-dialogok", "class": "c-dialogsel c-diabtn", data: "yes"}, "はい");
        x+=me.tag('span', {id: "x-dialogno", "class": "c-dialogsel c-diabtn", data: "no"}, "いいえ");
      }
      if(op.can){x+=me.tag('span', {id: "x-dialogcan", "class": "c-dialogsel c-diabtn", data: "can"}, "取消");}

      html+=me.tag('div', {
        id: "x-diabutton", "class": "c-alignment", width: op.width, space: 10,
        "-webkit-border-radius": "0px 0px "+op.radius+"px "+op.radius+"px", Display: "block",
        "Background-image": "url(./library/white.jpg)", Width: op.width+"px",
      }, x);

      if($('#x-dialog').html()){$('#x-dialog').html(html);$('#x-dialog').css({display: "block"});}
      else{
        $('body').append(me.tag('div', {
          id: "x-dialog", Position: "absolute", Top: 0, Left: 0, Display: "block", "Z-index": 30,
          "-webkit-box-shadow": "2px 2px 2px rgba(000,000,000,0.3)"
        }, html));
      }

      $("#x-modal").css({display: "block"});
      me.effect([{
        "class": "c-diabtn", type:"button", width: 60, size: me.Manner.fontS,
        css: {margin: "15px 0"}
      }]);
    };
//Positioning
    var Positining=function(op){
      var mh, h, w, t, l;
      h=$('#x-diawindow').find('.c-case').outerHeight();
      mh=Math.floor(me.pageY*0.6); if(h>mh){h=mh;} $('#x-diawindow').css({height: h+"px"});
      
      h=$('#x-dialog').outerHeight(); t=Math.floor((me.pageY-h)/2);
      w=$('#x-dialog').outerWidth(); l=Math.floor((me.pageX-w)/2);
      $('#x-dialog').css({top: t+"px", left: l+"px", css: {margin: "10px 0"}});
    };
//Monitor
    var Monitor=function(op){
      var rc;
      if(op.type=="multi"){
        $('.c-dialogchip').on('click', function(){
            var x=$(this).attr('data'); var c;
            var y=$(this).attr('sel');
             if(y=="y"){y="n"; c="#FFF";}else{y="y"; c=op.selcolor;}
            $(this).attr('sel', y); $(this).css({"background-color": c});
        });
        waitfor(){
          $('.c-dialogsel').on('click', function(){
            $('#x-dialog').css({display: "none"}); $('#x-modal').css({display: "none"});
            rc=$(this).attr('data'); if(rc=='can'){return false;} rc=[];
            $('.c-dialogchip').each(function(){
              var x=$(this).attr('sel'); var y=$(this).attr('data'); if(x=="y"){rc.push(y);}
            });
            resume();
          });
        }
        $('.c-dialogsel').off('click'); $('.c-dialogchip').off('click');
        return rc;
      }else{
        waitfor(){
          $('.c-dialogsel').on('click', function(){
            $('#x-dialog').css({display: "none"}); $('#x-modal').css({display: "none"});
            rc=$(this).attr('data'); resume();
          });
        }
        $('.c-dialogsel').off('click');
        return rc;
      }
    };
//Scroll
    var Scroll=function(op){
      op=op||{}; op.id=op.id||'x-flick'; op.pos=op.pos||48;
      var me=this, data={}, sw='x', an=true; m=0; l=0, t=0;
      var dx=0, nx=0, sx=0, dy=0, ny=0, sy=0, dt=0, st=0, et=0, vx=0, vy=0;
      var pic=function(x){x=x+" "; return x.substr(0, x.indexOf("px"))-0;};
      data.hi=$("#"+op.id).height(); data.li=$("#"+op.id).find(".c-case").height();
      data.maxY=0; data.minY=data.hi-data.li; data.ini=0;
      $('#'+op.id).on({
        'touchstart': function(e){if(event.changedTouches){
          sy=event.changedTouches[0].pageY;
        }},
        'touchmove': function(e){
          e.preventDefault();
          ny=event.changedTouches[0].pageY; dy=ny-sy;
          m=dy+data.ini; if(m<data.minY){m=data.minY;} if(m>data.maxY){m=data.maxY;}
          $('#'+op.id).find('.c-case').css({'margin-top': m+"px"});
        },
        'touchend': function(e){
          data.ini=m;
        }
      });
    };
//Exec
    Main(op);
  },
//##########
// loading          処理中表示
//
  loading: function(op){
    var me=this; op=op||{};
    if($("#x-loading").html()){$("#x-loading").css({display: "block"});}
    else{
      var w=0, t=0, l=0, x='';
      op.figure=op.figure||1; op.color=op.color||me.Manner.baseCN;
      w=op.size||80; l=Math.floor((me.pageX-w)/2); t=Math.floor((me.pageY-w)/2);
      x=me.getFile("loading"+op.figure+".svg");
      if(op.color){x=x.replace(/#000000/g, op.color);} x=x.replace(/='55/g, "='"+w);
      $("body").append(me.tag("p", {
        id: "x-loading", Display: "block",
        Width: w+"px", Position: "absolute", Top: t+"px", Left: l+"px", "Z-index": 50
      }, x));
      $('#x-keage01load').attr("width", op.size); $('#x-keage01load').attr("height", op.size);
    }
  },
//
// merge, cnx, icx, icontag
//
  merge: function(data, add){
    for(var i in add){data[i]=add[i];} return data;
  },
//
  cnx: function(ix, cname){
    ix=ix||0; cname=cname||this.Manner.baseColor;
    if(DATA.Cn[cname]==undefined){console.log('ERROR: color name:'+cname); return '#F00';}
    if(DATA.Cn[cname][ix]==undefined){console.log('ERROR: color index:'+ix); return '#F00';}
    return '#'+DATA.Cn[cname][ix];
  },
//
  icx: function(name){
    if(DATA.Fa[name]==undefined){return '&#xf059';}
    return '&#x'+DATA.Fa[name];
  },
//
  icontag: function(name, css, id){
    css=css||{}; css['font-size']=css['font-size']||'12px'; id=id||'';
    css['width']=css['width']||css['font-size']; css['height']=css['height']||css['font-size'];
    css['overflow']='hidden';
    var x=""; for(var i in css){x+=i+": "+css[i]+"; ";}
    return '<i id="'+id+'" class="c-fa" style="'+x+'" >'+this.icx(name)+'</i>';
  },
//
// base64 image fbk, fsq, fwh
  fbk: 'data:image/png;base64,'+
       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAE0lEQVR42mNgYGD4TyQeVUhPhQA0vWOdRb+VhQAAAA'+
       'BJRU5ErkJggg==',
  fsq: 'data:image/png;base64,'+
       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVR42mNgGAWjYBSMAggAAAQQAAGvRYgsAAAAAE'+
       'lFTkSuQmCC',
  fwh: 'data:image/png;base64,'+
       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAEUlEQVR42mP4TyRgGFVIX4UAI/uOgGWVNeQAAAAASU'+
       'VORK5CYII=',
  cls: {}
});
module.exports=exe;
