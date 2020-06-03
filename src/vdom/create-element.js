import {createComponent} from './create-component'
import {makeMap, isPrimitive} from '../util'
import VNode from './vnode'

const isReservedTag = makeMap(
  "html,body,base,head,link,meta,style,title," +
    "address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section," +
    "div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul," +
    "a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby," +
    "s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video," +
    "embed,object,param,source,canvas,script,noscript,del,ins," +
    "caption,col,colgroup,table,thead,tbody,td,th,tr," +
    "button,datalist,fieldset,form,input,label,legend,meter,optgroup,option," +
    "output,progress,select,textarea," +
    "details,dialog,menu,menuitem,summary," +
    "content,element,shadow,template,blockquote,iframe,tfoot"
)


export function createElement (context, tag, data, children) {
  if (Array.isArray(data) || isPrimitive(data)) {
    children = data
    data = undefined
  }
  if (typeof tag === 'string') {
    if (isReservedTag(tag)) {
      return new VNode(tag, data, children)
    } else {
      console.log('TODO:为组件内引入做准备')
    }
    
  } else {
    return createComponent(tag, data, context, children)
  }
}