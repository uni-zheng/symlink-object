import { link, symlinkObject, unlink } from '../src/symlink-object'

describe('symlink-object', () => {
  describe('link', () => {
    it('link', () => {
      const config = symlinkObject({
        string: '1',
        boolean: true,
        number: 1,
        null: null,
        undefined: undefined,
        object: {
          foo: 1,
        },
        array: [1, 2],
        function: function noop() {},

        stringLink: link('string'),
        booleanLink: link('boolean'),
        numberLink: link('number'),
        nullLink: link('null'),
        undefinedLink: link('undefined'),
        objectLink: link('object'),
        arrayLink: link('array'),
        functionLink: link('function'),
      })

      expect(config.stringLink).toBe(config.string)
      expect(config.booleanLink).toBe(config.boolean)
      expect(config.numberLink).toBe(config.number)
      expect(config.nullLink).toBe(config.null)
      expect(config.undefinedLink).toBe(config.undefined)
      expect(config.objectLink).toStrictEqual(config.object)
      expect(config.arrayLink).toStrictEqual(config.array)
      expect(config.functionLink).toBe(config.function)
    })

    it('link object', () => {
      const config = symlinkObject({
        object: {
          string: '1',
          boolean: true,
          number: 1,
          null: null,
          undefined: undefined,
          function: function noop() {},
        },

        stringLink: link('object/string'),
        booleanLink: link('object/boolean'),
        numberLink: link('object/number'),
        nullLink: link('object/null'),
        undefinedLink: link('object/undefined'),
        functionLink: link('object/function'),
        unsetLink: link('object/unsetProp/unsetProp'),
      })

      expect(config.stringLink).toBe(config.object.string)
      expect(config.booleanLink).toBe(config.object.boolean)
      expect(config.numberLink).toBe(config.object.number)
      expect(config.nullLink).toBe(config.object.null)
      expect(config.undefinedLink).toBe(config.object.undefined)
      expect(config.functionLink).toBe(config.object.function)
      expect(config.unsetLink).toBe(undefined)
    })

    it('link array', () => {
      const config = symlinkObject({
        array: ['1', true, 1, null, undefined, function noop() {}],

        stringLink: link('array/0'),
        booleanLink: link('array/1'),
        numberLink: link('array/2'),
        nullLink: link('array/3'),
        undefinedLink: link('array/4'),
        objectLink: link('array/5'),
        arrayLink: link('array/6'),
        functionLink: link('array/7'),
      })

      expect(config.stringLink).toBe(config.array[0])
      expect(config.booleanLink).toBe(config.array[1])
      expect(config.numberLink).toBe(config.array[2])
      expect(config.nullLink).toBe(config.array[3])
      expect(config.undefinedLink).toBe(config.array[4])
      expect(config.objectLink).toStrictEqual(config.array[5])
      expect(config.functionLink).toBe(config.array[6])
    })

    it('link default value', () => {
      const config = symlinkObject({
        realValue: undefined,
        link: link('realValue', 'default value'),
      })

      expect(config.link).toBe('default value')
    })

    it('nest link default value', () => {
      const config = symlinkObject({
        realValue: undefined,
        linkA: link('realValue', 'linkA default value'),
        linkB: link('linkA', 'linkB default value'),
      })

      expect(config.linkB).toBe('linkA default value')
    })

    it('nested link ', () => {
      const config = symlinkObject({
        realValue: 1,
        object: {
          linkA: link('realValue'),
        },
        linkB: link('object/linkA'),
        linkC: link('linkB'),
      })

      expect(config.linkC).toBe(config.realValue)
    })

    it('link multi', () => {
      const config = symlinkObject({
        realValueA: undefined,
        realValueB: 2,
        link: link(['realValueA', 'realValueB']),
      })

      expect(config.link).toBe(config.realValueB)
    })

    it('nest link multi', () => {
      const config = symlinkObject({
        realValue: 1,
        object: {
          linkA: link('realValue'),
        },
        linkB: link('object/linkA'),
        link: link(['linkB']),
      })

      expect(config.link).toBe(config.realValue)
    })

    it('update realValue', () => {
      const config = symlinkObject({
        realValue: 1,
        link: link('realValue'),
      })

      expect(config.link).toBe(config.realValue)

      config.realValue = 2

      expect(config.link).toBe(2)
    })

    it('update realValue with interal', () => {
      const config = symlinkObject({
        realValue: 1,
        link: link('realValue'),
      })

      expect(config.link).toBe(config.realValue)

      config.realValue = 2

      expect(config.link).toBe(2)
    })

    it('update realValue with object', () => {
      const config = symlinkObject({
        realValue: 1,
        object: null,
        link: link('object/linkToRealValue'),
      })

      expect(config.link).toBe(undefined)

      config.object = {
        linkToRealValue: link('realValue'),
      }

      expect(config.link).toBe(1)
    })

    it('update realValue with link', () => {
      const config = symlinkObject({
        realValue: 1,
        object: null,
        link: link('object'),
      })

      expect(config.link).toBe(null)

      config.object = link('realValue')

      expect(config.link).toBe(1)
    })

    it('update link with link', () => {
      const config = symlinkObject({
        realValueA: 1,
        realValueB: 2,
        link: link('realValueA'),
      })

      config.link = link('realValueB')

      expect(config.link).toBe(2)
    })

    it('update link with interal', () => {
      const config = symlinkObject({
        realValue: undefined,
        link: link('realValue', 1),
      })

      config.link = 2

      expect(config.link).toBe(2)
    })
  })

  describe('unlink', () => {
    it('unlink with interal', () => {
      const config = symlinkObject({
        realValue: 1,
        link: link('realValue', 2),
      })

      config.link = 3

      expect(config.link).toBe(1)

      config.link = unlink(2)

      expect(config.link).toBe(2)
    })
  })
})
