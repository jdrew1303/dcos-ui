const Batch = require('../../../../../../../src/js/structs/Batch');
const ReducerUtil = require('../../../../../../../src/js/utils/ReducerUtil');
const Transaction = require('../../../../../../../src/js/structs/Transaction');
const {SET} = require('../../../../../../../src/js/constants/TransactionTypes');

let reducers = ReducerUtil.combineReducers({
  foo(state, action) {
    let joinedPath = action.path.join('.');
    if (this.data == null) {
      this.data = {};
    }
    if (this.type == null) {
      this.type = 'a';
    }

    if (joinedPath === 'type') {
      this.type = action.value;
    }

    if (joinedPath === 'value') {
      this.data = action.value;
    }

    if (this.type === 'a') {
      return this.data;
    }

    return null;
  },
  bar: ReducerUtil.combineReducers({
    foo(state, action) {
      let joinedPath = action.path.join('.');
      if (this.data == null) {
        this.data = {};
      }
      if (this.type == null) {
        this.type = 'a';
      }

      if (joinedPath === 'type') {
        this.type = action.value;
      }

      if (joinedPath === 'value') {
        this.data = action.value;
      }

      if (this.type === 'b') {
        return this.data;
      }

      return null;
    }
  })
});
describe('nested Example', function () {
  it('set on root', function () {
    let batch = new Batch();
    batch.add(new Transaction(['value'], 'bar'));

    const state = batch.reduce(reducers, {});
    expect(state).toEqual({foo: 'bar', bar: {foo: null}});
  });

  it('set deep', function () {
    let batch = new Batch();
    batch.add(new Transaction(['value'], 'bar'));
    batch.add(new Transaction(['type'], 'b'));

    const state = batch.reduce(reducers, {});
    expect(state).toEqual({foo: null, bar: {foo: 'bar'}});
  });

  it('set first deep then root again', function () {
    let batch = new Batch();
    batch.add(new Transaction(['value'], 'bar'));
    batch.add(new Transaction(['type'], 'b'));
    batch.add(new Transaction(['type'], 'a'));

    const state = batch.reduce(reducers, {});
    expect(state).toEqual({foo: 'bar', bar: {foo: null}});
  });

  it('set first deep then change the value and switch to root again', function () {
    let batch = new Batch();
    batch.add(new Transaction(['value'], 'bar'));
    batch.add(new Transaction(['type'], 'b'));
    batch.add(new Transaction(['value'], 'foobar'));
    batch.add(new Transaction(['type'], 'a'));

    const state = batch.reduce(reducers, {});
    expect(state).toEqual({foo: 'foobar', bar: {foo: null}});
  });
});
