/**
 *
 * 功能
 *
 *
 * 1 场景多次依赖
 * effect(()=>{     parent = null  activeEffect=e1
 *
 *  data.name = 1
 *
 *  effect(()=>{      parent = e1   activeEffect=e2
 *    data.age = 2
 *  })
 *
 *  data.c = 3  parent = null activeEffect=e1
 *
 * })
 *
 * 2 data.name = Math.random()
 *
 * effect正在执行需要屏蔽掉，不然会一直执行下去
 */

export let activeEffect = undefined;

class ReactiveEffect {
  // effect默认激活状态
  // public active typescript表示在实例上新增了active属性
  public active = true;

  public parent = null;

  public deps = [];

  constructor(public fn) {
    // public fn 用户传递的参数也会在this上 => this.fn = fn
  }
  run() {
    // 非激活状态，执行函数
    if (!this.active) return this.fn();

    // 激活状态，收集属性
    try {
      this.parent = activeEffect;

      activeEffect = this;
      return this.fn();
    } catch (error) {
    } finally {
      activeEffect = this.parent;
      this.parent = null;
    }
  }
}

// 根据状态变化重新执行
export function effect(fn) {
  // 创建响应式的effect
  const _effect = new ReactiveEffect(fn);
  // 默认先执行一次
  _effect.run();
}

/**
 * 一个effect对应多个属性
 * 一个属性对应多个effect
 * 多对多
 *
 * 收集对象
 * weakMap  = { 对象: Map: {name: Set } }
 * @param target { name:'jw' }
 * @param type 标记
 * @param key name
 */
const targetMap = new WeakMap();
export function track(target, type, key) {
  // 属性不在effect中取值，不进行依赖
  if (!activeEffect) return;

  // ==>  { "{ name:'jw' }" : new Map() }
  let depsMap = targetMap.get(target); // new Map()
  if (!depsMap) {
    const _key = target;
    const _value = new Map();
    depsMap = _value;
    targetMap.set(_key, _value);
  }

  // ==>  {name: new Set()}
  let dep = depsMap.get(key); // new Set()
  if (!dep) {
    const _key = key;
    const _value = new Set();
    dep = _value;
    depsMap.set(_key, _value);
  }

  // 是否应该收集
  // data.name 多次书写
  // name 是不是为空 放进去当前激活实例
  // 实例中deps 存储 Set对象-> {name:xxx}
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    // 让effect记录对应的dep，清理时会用到
    activeEffect.deps.push(dep);
  }

  console.log(target, type, key);
}

/**
 *
 * @param target
 * @param type 标签
 * @param key
 * @param value
 * @param oldValue
 */
export function trigger(target, type, key, value, oldValue) {
  console.log(target, type, key, value, oldValue);

  // 设置的对象 data.name = 1 此前并没有写到effect函数中那么不管他
  const depsMap = targetMap.get(target);

  if (!depsMap) return;

  // 对应属性的effect
  const effects = depsMap.get(key);
  effects &&
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effect.run();
      }
    });
}
