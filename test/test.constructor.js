var test = require('tape');
var Bee = require('../');

function testConstructor(Bee, name) {
  test('构造函数: ' + (name || Bee.name), function(t) {
    t.equal(typeof Bee, 'function');
    t.test('静态属性/方法', function (t) {
      t.equal(typeof Bee.extend, 'function');
      t.equal(typeof Bee.tag, 'function');
      t.equal(Bee.tag, Bee.component, 'tag 是 component 的别名');
      t.equal(typeof Bee.directive, 'function');
      t.equal(typeof Bee.extend, 'function');
      t.equal(typeof Bee.extend, 'function');
      t.equal(typeof Bee.extend, 'function');
      t.equal(typeof Bee.directives, 'object');
      t.equal(typeof Bee.components, 'object');
      t.equal(typeof Bee.filters, 'object');
      t.end()
    })

    t.test('原型属性/方法', function (t) {
      t.equal(typeof Bee.prototype.$set, 'function');
      t.equal(typeof Bee.prototype.$get, 'function');
      t.equal(typeof Bee.prototype.$replace, 'function');
      t.equal(typeof Bee.prototype.$watch, 'function');
      t.equal(typeof Bee.prototype.$unwatch, 'function');
      t.end()
    })
  })
}

testConstructor(Bee);

test(function(t) {
  t.test('默认选项', function(t) {
    var bee = new Bee;
    t.equal(Object.keys(bee.$data).length, 0)
    t.equal(bee.$parent, null)
    t.equal(bee.$root, bee)

    t.end()
  })

  t.test('Bee.mount', function(t) {
    var el = Bee.doc.createElement('div');
    el.innerHTML = '{{name}}';
    var bee = Bee.mount(el, {$data: {name: 'bee'}});

    t.equal(bee.$el.innerHTML, bee.$data.name);
    t.equal(bee.$data.name, bee.name);

    bee.$set('name', 'bee');
    t.equal(bee.$data.name, 'bee');
    t.equal(bee.$el.innerHTML, bee.$data.name);
    t.equal(bee.$data.name, bee.name);

    t.end()
  })

  t.test('Bee.extend', function(t) {
    var proto = {pro: Math.random()},
      staticProp = {sta: Math.random(), filters: {b: function(){}}};

    var Ant = Bee.extend(proto, staticProp)
    t.equal(Ant.sta, staticProp.sta);
    t.equal(Ant.prototype.pro, proto.pro);
    t.equal(Ant.extend, Bee.extend);
    t.equal(Ant.tag, Bee.tag);
    t.equal(Ant.directive, Bee.directive);
    t.equal(Ant.filters.b, staticProp.filters.b)

    t.notOk(Bee.sta)
    t.notOk(Bee.prototype.pro)
    t.notOk(Bee.filters.b)

    var Cicada = Ant.extend({}, {filters: {c: function() {}}})
    t.ok(Cicada.filters.c)
    t.equal(Cicada.filters.b, Ant.filters.b)

    t.notOk(Ant.filters.c)

    testConstructor(Ant, 'Ant');

    t.comment('更新父构造函数 directive, components, filters 会同步更新子构造函数')

    var newFilter = function() {}

    Ant.filter('b', newFilter)

    t.equal(Ant.filters.b, newFilter, 'filter update')
    t.equal(Cicada.filters.b, newFilter, 'filter update')
    t.notEqual(newFilter, staticProp.filters.b)

    t.comment('反之不行')

    Cicada.filter('b', staticProp.filters.b)

    t.equal(Cicada.filters.b, staticProp.filters.b, 'filter update')
    t.equal(Ant.filters.b, newFilter, 'filter update')
    t.notEqual(newFilter, staticProp.filters.b)

    t.end()
  })

  t.end();
});

test('构造函数参数', function(t) {
  var data = {a: 'a'};
  var bee = new Bee({
    $data: data
  });

  t.equal(bee.$data, data)
  t.equal(bee.a, data.a)

  var el = Bee.doc.createElement('div');
  var bee = new Bee('<div>{{name}}</div>', { $el: el, $data: { name: 'Bee' } })

  t.equal(bee.$el, el, '.$el')

  t.end()
})
