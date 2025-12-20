/**
 * 大小写转换工具：snake_case <-> camelCase
 */

const camelRegex = /_([a-zA-Z0-9])/g
const snakeRegex = /([A-Z])/g

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const result: Record<string, any> = {}
    Object.keys(obj).forEach((key) => {
      const newKey = key.replace(camelRegex, (_, c) => c.toUpperCase())
      result[newKey] = toCamelCase(obj[key])
    })
    return result
  }
  return obj
}

export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const result: Record<string, any> = {}
    Object.keys(obj).forEach((key) => {
      const newKey = key.replace(snakeRegex, '_$1').toLowerCase()
      result[newKey] = toSnakeCase(obj[key])
    })
    return result
  }
  return obj
}

