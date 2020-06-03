const callbacks = [];
let pending = false;
export function nextTick (cb, ctx) {
  callbacks.push(function () {
    if (cb) {
      cb.call(ctx)
    } else {
      Promise.resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    Promise.resolve().then(() => {
      pending = false
      const copies = callbacks.slice(0);
      callbacks.length = 0
      for (let i = 0; i < copies.length; i++) {
        copies[i]()
      }
    })
  }
}