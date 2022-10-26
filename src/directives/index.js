// 负责管理所有的自定义指令
export const imagerror = {
  // 指令对象
  // 会在当前dom元素插入到节点后执行
  inserted(dom, options) {
    // options是指令中变量的解释
    // 其中一个属性叫value
    // dom表示当前指令作用的dom对象
    // dom认为此时就是图片
    // 当图片有地址，但是地址没有加载成功的时候，出现报错并触发图片的onerror事件
    dom.onerror = function() {
      // 当图片出现异常时，会将指令设置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这儿不能写死
    }
  }
}
