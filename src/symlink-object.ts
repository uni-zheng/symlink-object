function symlinkObject<Obj extends object>(object: Obj, root = object): Obj {
  return new Proxy(object, {
    get: function (target, prop) {
      if (target[prop]?.constructor === Link) {
        return getProp(root, target[prop].link, target[prop].defaultValue)
      }

      if (target[prop] !== null && typeof target[prop] === 'object') {
        return symlinkObject(target[prop], root)
      }

      return target[prop]
    },

    set: function (target, prop, value) {
      if (value?.constructor === Link) {
        target[prop] = value

        return value
      }

      if (value?.constructor === Unlink) {
        target[prop] = value.realValue

        return value
      }

      if (value !== null && typeof value === 'object') {
        const linkedObject = symlinkObject(value, root)

        target[prop] = linkedObject

        return linkedObject
      }

      if (target[prop]?.constructor === Link) {
        target[prop].setDefaultValue(value)

        return value
      }

      target[prop] = value

      return value
    },
  })
}

function pickValue(value, defaultValue) {
  if (defaultValue !== undefined) {
    if (value === null || value === undefined) {
      return defaultValue
    }
    else {
      return value
    }
  }
  else {
    return value
  }

}

function getProp(object, link: string | string[], defaultValue?) {
  if (typeof link === 'string') {
    const propList = link.split('/')

    let temp = object
    let index = 0

    while (index < propList.length) {
      if (temp !== null && typeof temp === 'object') {
        temp = temp[propList[index]]

        if (temp?.constructor === Link) {
          temp = getProp(object, temp.link, temp.defaultValue)
        }
      }
      else {
        temp = undefined
      }

      index++
    }

    return pickValue(temp, defaultValue)
  }

  // if link is array
  let returnValue
  let i = 0
  while (i < link.length) {
    returnValue = getProp(object, link[i], defaultValue)

    if (returnValue !== null && returnValue !== undefined) {
      break
    }

    i++
  }

  return returnValue
}

class Link {
  link
  defaultValue

  constructor(link, defaultValue) {
    this.link = link
    this.setDefaultValue(defaultValue)
  }

  setDefaultValue(defaultValue) {
    this.defaultValue = defaultValue
  }
}

class Unlink {
  realValue

  constructor(value) {
    this.realValue = value
  }
}

function link(link, defaultValue?) {
  return new Link(link, defaultValue)
}

function unlink(value) {
  return new Unlink(value)
}

symlinkObject.link = link
symlinkObject.unlink = unlink

export { symlinkObject, link, unlink }
