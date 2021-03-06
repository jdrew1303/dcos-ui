jest.dontMock('../SystemLogUtil');

const SystemLogUtil = require('../SystemLogUtil');

describe('SystemLogUtil', function () {

  describe('#getUrl', function () {

    it('should include range element first in the url', function () {
      var result = SystemLogUtil.getUrl('foo', {cursor: 'cursor'});

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/stream/?cursor=cursor'
      );
    });

    it('should encode value of range element', function () {
      var result = SystemLogUtil.getUrl('foo', {limit: 'lim&it'});

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/stream/?limit=lim%26it'
      );
    });

    it('should concatenate range elements nicely together', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        limit: 'lim&it'
      });

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/stream/?cursor=cursor&limit=lim%26it'
        );
    });

    it('should include filter after range element in the url', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        filter: {param1: 'param1'}
      });

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/stream/?cursor=cursor&filter=param1:param1'
      );
    });

    it('should encode filter element', function () {
      var result = SystemLogUtil.getUrl(
        'foo',
        {filter: {'param/1': 'param/1'}}
      );

      expect(result).toEqual(
          '/system/v1/agent/foo/logs/v1/stream/?filter=param%2F1:param%2F1'
        );
    });

    it('should concatenate range elements nicely together', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        limit: 'lim&it',
        postfix: 'postfix',
        filter: {'param/1': 'param/1', 'param\\2': 'param\\2'}
      });

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/stream/?cursor=cursor&limit=lim%26it&postfix=postfix&filter=param%2F1:param%2F1&filter=param%5C2:param%5C2'
      );
    });

    it('ignores anything that is not a param or filter', function () {
      var result = SystemLogUtil.getUrl('foo', {
        bar: 'bar'
      });

      expect(result.includes('bar')).toBe(false);
    });

    it('should use stream by default', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        filter: {'param/1': 'param/1'}
      });

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/stream/?cursor=cursor&filter=param%2F1:param%2F1'
      );
    });

    it('should use range', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        filter: {'param/1': 'param/1'}
      }, false);

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/range/?cursor=cursor&filter=param%2F1:param%2F1'
      );
    });

    it('should add framework id in the URL', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        frameworkID: 'bar'
      }, false);

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/range/framework/bar?cursor=cursor'
      );
    });

    it('should add executor id in the URL', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        executorID: 'bar'
      }, false);

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/range/executor/bar?cursor=cursor'
      );
    });

    it('should add container id in the URL', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        containerID: 'bar'
      }, false);

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/range/container/bar?cursor=cursor'
      );
    });

    it('should add all ids in the URL', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        frameworkID: 'bar',
        executorID: 'baz',
        containerID: 'quis'
      }, false);

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/range/' +
        'framework/bar/executor/baz/container/quis?cursor=cursor'
      );
    });

    it('should add aditional endpoint to the URL', function () {
      var result = SystemLogUtil.getUrl('foo', {
        cursor: 'cursor',
        frameworkID: 'bar',
        executorID: 'baz',
        containerID: 'quis'
      }, false, '/download');

      expect(result).toEqual(
        '/system/v1/agent/foo/logs/v1/range/' +
        'framework/bar/executor/baz/container/quis/download?cursor=cursor'
      );
    });

  });

});
