var INFOJ={}, REC={}, SCREEN={}, USER={}, FIELD=[], STATUS={}, ELEMENT={}; M=[];
//
var DATA={
  extend: function(obj, noover){
    var k; for(k in obj){if(this[k]){
      if(noover){console.log(k, 'メソッド重複');}else{this[k]=obj[k];}}else{this[k]=obj[k];}
    }
  }
};
//
(function(){
  var order={"meta": [], "css": [], "js": []};
  var head=document.getElementsByTagName("head")[0];
  var meta=document.getElementsByTagName("meta");
//
  var option=function(meta){
    var out={"style": {}, "script": {}, "use": {}}, k;
    for(var i in meta){
      if(meta[i].getAttribute){k=meta[i].getAttribute('name');}else{k='';}
      switch(k){
      case "style": case "script": case "use":
        var a=meta[i].getAttribute('content').split(',');
        for(var j in a){out[k][a[j]]=true;}
        break;
      default: break;
      }
    }
    return out;
  };
//
  var tag=function(name, attr, parent){
    var e=document.createElement(name); for(var i in attr){e.setAttribute(i, attr[i]);}
    parent.appendChild(e);
  };
//
  var op=option(meta);
//  if(op.style.self==undefined){op.style.self=true;}
//  if(op.style.inline==undefined){op.style.inline=true;}
//  if(op.script.self==undefined){op.script.self=true;}
//  if(op.script.inline==undefined){op.script.inline=true;}
//  if(op.use.colors==undefined){op.colors=true;}
//  if(op.use.fontA==undefined){op.fontA=true;}
//  if(op.use.fontG==undefined){op.fontG=false;}
//  if(op.use.gmap==undefined){op.gmap=false;}
//
  var always=true;
  if(op.style.self){order.meta.push({type: "style", data: " 'self'"});}
  if(op.style.inline){order.meta.push({type: "style", data: " 'unsafe-inline'"});}
  if(always){order.meta.push({type: "script", data: " 'unsafe-eval'"});}
  if(op.script.self){order.meta.push({type: "script", data: " 'self'"});}
  if(op.script.inline){order.meta.push({type: "script", data: " 'unsafe-inline'"});}
  if(always){order.css.push("library/base.css");}
  if(always){order.js.push("cordova.js");}
  if(always){order.js.push("library/jquery-2.1.1.js");}
  if(always){order.js.push("library/stratified.js");}
  if(op.use.fontA){order.js.push("library/font-awesome.js");}
  if(op.use.colors){order.js.push("library/colors.js");}
  if(op.use.fontG){
    order.meta.push({
      type: "style", data: " http://fonts.googleapis.com https://fonts.googleapis.com"
    });
    order.css.push("https://fonts.googleapis.com/icon?family=Material+Icons");
  }
  if(op.use.gmap){
     order.meta.push({type: "script", data: " http://maps.gstatic.com"});
     order.meta.push({type: "script", data: " http://maps.googleapis.com"});
     order.meta.push({type: "script", data: " http://mt0.googleapis.com"});
  }
//
//
//
  var style="", script="", i=0;
  for(i in order.meta){
    if(order.meta[i].type=="script"){script+=order.meta[i].data;}
    else{style+=order.meta[i].data;}
  }
  tag("meta", {
    "http-equiv": "Content-Security-Policy",
    "content": "default-src *; style-src "+style+"; script-src "+script+";"
  }, head);
//
  for(i in order.css){
    tag('link', {"type": "text/css", "rel": "stylesheet", "href": order.css[i]}, head);
  }
//
  for(i in order.js){
    tag('script', {"type": "text/javascript", "src": order.js[i]}, head);
  }
//  
})();
