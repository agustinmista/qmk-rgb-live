type Getter<K,V> = (input: V) => K
type Proj<V,W> = (input: V) => W

export function id<V,W>(x: V) { return x as unknown as W }

export function groupBy<K, V>(list: Array<V>, getter: Getter<K,V>): Map<K, Array<V>> {
  return groupProjectBy<K,V,V>(list, getter, x => x)
}

export function groupProjectBy<K, V, W>(list: Array<V>, getter: Getter<K,V>, proj: Proj<V,W> = id): Map<K, Array<W>> {
  const map = new Map<K, Array<W>>()
  list.forEach((item) => {
    const key = getter(item)
    const val = proj(item)
    const arr = map.get(key)
    if (!arr) {
      map.set(key, [val])
    } else {
      arr.push(val)
    }
  });
  return map;
}