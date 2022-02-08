"use strict";

define("nodes/components/driver-harvester/component", ["exports", "shared/mixins/node-driver", "ui/utils/debounce"], function (exports, _nodeDriver, _debounce) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var LAYOUT = "PHNlY3Rpb24gY2xhc3M9Imhvcml6b250YWwtZm9ybSI+CiAge3sjYWNjb3JkaW9uLWxpc3Qgc2hvd0V4cGFuZEFsbD1mYWxzZSBhcyB8IGFsIGV4cGFuZEZuIHx9fQogICAge3shLS0gVGhpcyBsaW5lIHNob3dzIHRoZSBkcml2ZXIgdGl0bGUgd2hpY2ggeW91IGRvbid0IGhhdmUgdG8gY2hhbmdlIGl0IC0tfX0KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIgbWItMjAiPjxzcGFuPnt7ZHJpdmVyT3B0aW9uc1RpdGxlfX08L3NwYW4+PC9kaXY+CgogICAge3sjYWNjb3JkaW9uLWxpc3QtaXRlbQogICAgICB0aXRsZT0odCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIuYWNjZXNzLnRpdGxlIikKICAgICAgZGV0YWlsPSh0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5hY2Nlc3MuZGV0YWlsIikKICAgICAgZXhwYW5kQWxsPWV4cGFuZEFsbAogICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgZXhwYW5kT25Jbml0PXRydWUKICAgIH19CiAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tMTIiPgogICAgICAgICAgPGRpdiBjbGFzcz0icmFkaW8iPgogICAgICAgICAgICA8bGFiZWw+CiAgICAgICAgICAgICAge3tyYWRpby1idXR0b24gc2VsZWN0aW9uPWlzSW50ZXJuYWxNb2RlIHZhbHVlPXRydWV9fQogICAgICAgICAgICAgIHt7dCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIuaW50ZXJuYWwifX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgIDwvZGl2PgoKICAgICAgICAgIDxkaXYgY2xhc3M9InJhZGlvIj4KICAgICAgICAgICAgPGxhYmVsPgogICAgICAgICAgICAgIHt7cmFkaW8tYnV0dG9uIHNlbGVjdGlvbj1pc0ludGVybmFsTW9kZSB2YWx1ZT1mYWxzZX19CiAgICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5leHRlcm5hbCJ9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgIDwvZGl2PgoKICAgICAge3sjdW5sZXNzIGlzSW50ZXJuYWxNb2RlfX0KICAgICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgIm5vZGVEcml2ZXIuaGFydmVzdGVyLmhvc3QubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgIGNsYXNzTmFtZXM9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICBpZD0ic2VydmVyLXVybCIKICAgICAgICAgICAgICB2YWx1ZT1jb25maWcuaG9zdAogICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSh0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5ob3N0LnBsYWNlaG9sZGVyIikKICAgICAgICAgICAgfX0KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAgICB7e3QgIm5vZGVEcml2ZXIuaGFydmVzdGVyLnBvcnQubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAge3tpbnB1dC1pbnRlZ2VyCiAgICAgICAgICAgICAgbWluPTEKICAgICAgICAgICAgICBtYXg9NjU1MzUKICAgICAgICAgICAgICBjbGFzcz0iZm9ybS1jb250cm9sIgogICAgICAgICAgICAgIHZhbHVlPWNvbmZpZy5wb3J0CiAgICAgICAgICAgIH19CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgICAge3svdW5sZXNzfX0KCiAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgIHt7dCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIudXNlcm5hbWUubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICB7e2lucHV0CiAgICAgICAgICAgIHR5cGU9InRleHQiCiAgICAgICAgICAgIHZhbHVlPWNvbmZpZy51c2VybmFtZQogICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICB9fQogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5wYXNzd29yZC5sYWJlbCJ9fXt7ZmllbGQtcmVxdWlyZWR9fQogICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgIHt7aW5wdXQKICAgICAgICAgICAgdHlwZT0icGFzc3dvcmQiCiAgICAgICAgICAgIHZhbHVlPWNvbmZpZy5wYXNzd29yZAogICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICB9fQogICAgICAgIDwvZGl2PgogICAgICA8L2Rpdj4KCiAgICB7ey9hY2NvcmRpb24tbGlzdC1pdGVtfX0KCiAgICB7eyNhY2NvcmRpb24tbGlzdC1pdGVtCiAgICAgIHRpdGxlPSh0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5pbnN0YW5jZS50aXRsZSIpCiAgICAgIGRldGFpbD0odCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIuaW5zdGFuY2UuZGV0YWlsIikKICAgICAgZXhwYW5kQWxsPWV4cGFuZEFsbAogICAgICBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikKICAgICAgZXhwYW5kT25Jbml0PXRydWUKICAgIH19CiAgICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sIHNwYW4tNiI+CiAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgIHt7dCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIuY3B1Q291bnQubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJpbnB1dC1ncm91cCI+CiAgICAgICAgICAgIHt7aW5wdXQtaW50ZWdlcgogICAgICAgICAgICAgIG1pbj0xCiAgICAgICAgICAgICAgbWF4PTMyCiAgICAgICAgICAgICAgdmFsdWU9Y29uZmlnLmNwdUNvdW50CiAgICAgICAgICAgICAgY2xhc3NOYW1lcz0iZm9ybS1jb250cm9sIgogICAgICAgICAgICB9fQogICAgICAgICAgICA8ZGl2IGNsYXNzPSJpbnB1dC1ncm91cC1hZGRvbiBiZy1kZWZhdWx0Ij4KICAgICAgICAgICAgICB7e3QgIm5vZGVEcml2ZXIuaGFydmVzdGVyLmNwdUNvdW50LnVuaXQiIGNvcmVzPWNvbmZpZy5jcHVDb3VudH19CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CgogICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICB7e3QgIm5vZGVEcml2ZXIuaGFydmVzdGVyLm1lbW9yeVNpemUubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgIDwvbGFiZWw+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJpbnB1dC1ncm91cCI+CiAgICAgICAgICAgIHt7aW5wdXQtaW50ZWdlcgogICAgICAgICAgICAgIG1pbj0xCiAgICAgICAgICAgICAgdmFsdWU9Y29uZmlnLm1lbW9yeVNpemUKICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgIH19CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImlucHV0LWdyb3VwLWFkZG9uIGJnLWRlZmF1bHQiPgogICAgICAgICAgICAgIHt7dCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIubWVtb3J5U2l6ZS51bml0In19CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgIDwvZGl2PgoKICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5kaXNrU2l6ZS5sYWJlbCJ9fXt7ZmllbGQtcmVxdWlyZWR9fQogICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgIDxkaXYgY2xhc3M9ImlucHV0LWdyb3VwIj4KICAgICAgICAgICAge3tpbnB1dC1pbnRlZ2VyCiAgICAgICAgICAgICAgbWluPTEKICAgICAgICAgICAgICB2YWx1ZT1jb25maWcuZGlza1NpemUKICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgIH19CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImlucHV0LWdyb3VwLWFkZG9uIGJnLWRlZmF1bHQiPgogICAgICAgICAgICAgIHt7dCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIuZGlza1NpemUudW5pdCJ9fQogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5kaXNrQnVzLmxhYmVsIn19e3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgPE5ld1NlbGVjdAogICAgICAgICAgICBAY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgQHVzZUNvbnRlbnRGb3JEZWZhdWx0VmFsdWU9e3t0cnVlfX0KICAgICAgICAgICAgQGNvbnRlbnQ9e3tidXNDb250ZW50fX0KICAgICAgICAgICAgQHZhbHVlPXt7Y29uZmlnLmRpc2tCdXN9fQogICAgICAgICAgLz4KICAgICAgICA8L2Rpdj4KICAgICAgPC9kaXY+CgogICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgIHt7I2lmIGlzSW50ZXJuYWxNb2RlfX0KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5pbWFnZU5hbWUubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAgPFNlYXJjaGFibGVTZWxlY3QKICAgICAgICAgICAgICBAY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICBAY29udGVudD17e2ltYWdlQ29udGVudH19CiAgICAgICAgICAgICAgQHZhbHVlPXt7Y29uZmlnLmltYWdlTmFtZX19CiAgICAgICAgICAgIC8+CiAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSJhY2MtbGFiZWwiPgogICAgICAgICAgICAgIHt7dCAibm9kZURyaXZlci5oYXJ2ZXN0ZXIubmV0d29ya05hbWUubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAgPFNlYXJjaGFibGVTZWxlY3QKICAgICAgICAgICAgICBAY2xhc3M9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgICBAY29udGVudD17e25ldHdvcmtDb250ZW50fX0KICAgICAgICAgICAgICBAdmFsdWU9e3tjb25maWcubmV0d29ya05hbWV9fQogICAgICAgICAgICAvPgogICAgICAgICAgPC9kaXY+CgogICAgICAge3tlbHNlfX0KICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5pbWFnZU5hbWUubGFiZWwifX17e2ZpZWxkLXJlcXVpcmVkfX0KICAgICAgICAgICAgPC9sYWJlbD4KICAgICAgICAgICAge3tpbnB1dAogICAgICAgICAgICAgIHR5cGU9InRleHQiCiAgICAgICAgICAgICAgdmFsdWU9Y29uZmlnLmltYWdlTmFtZQogICAgICAgICAgICAgIGNsYXNzTmFtZXM9ImZvcm0tY29udHJvbCIKICAgICAgICAgICAgfX0KICAgICAgICAgIDwvZGl2PgoKICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbCBzcGFuLTYiPgogICAgICAgICAgICA8bGFiZWwgY2xhc3M9ImFjYy1sYWJlbCI+CiAgICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5uZXR3b3JrTmFtZS5sYWJlbCJ9fXt7ZmllbGQtcmVxdWlyZWR9fQogICAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAgICB7e2lucHV0CiAgICAgICAgICAgICAgdHlwZT0idGV4dCIKICAgICAgICAgICAgICB2YWx1ZT1jb25maWcubmV0d29ya05hbWUKICAgICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICAgIH19CiAgICAgICAgICA8L2Rpdj4KICAgICAgICB7ey9pZn19CiAgICAgIDwvZGl2PgoKICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi02Ij4KICAgICAgICAgIDxsYWJlbCBjbGFzcz0iYWNjLWxhYmVsIj4KICAgICAgICAgICAge3t0ICJub2RlRHJpdmVyLmhhcnZlc3Rlci5zc2hVc2VyLmxhYmVsIn19e3tmaWVsZC1yZXF1aXJlZH19CiAgICAgICAgICA8L2xhYmVsPgogICAgICAgICAge3tpbnB1dAogICAgICAgICAgICB0eXBlPSJ0ZXh0IgogICAgICAgICAgICB2YWx1ZT1jb25maWcuc3NoVXNlcgogICAgICAgICAgICBjbGFzc05hbWVzPSJmb3JtLWNvbnRyb2wiCiAgICAgICAgICB9fQogICAgICAgIDwvZGl2PgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICA8ZGl2IGNsYXNzPSJjb2wgc3Bhbi0xMiI+CiAgICAgICAgICB7e2Zvcm0tbGFiZWxzLWFubm90YXRpb25zCiAgICAgICAgICAgIG1vZGVsPW1ldGFkYXRhCiAgICAgICAgICAgIGV4cGFuZEFsbD1leHBhbmRBbGwKICAgICAgICAgICAgZXhwYW5kPShhY3Rpb24gZXhwYW5kRm4pCiAgICAgICAgICB9fQogICAgICAgIDwvZGl2PgogICAgICA8L2Rpdj4KICAgIHt7L2FjY29yZGlvbi1saXN0LWl0ZW19fQogICAgCiAge3svYWNjb3JkaW9uLWxpc3R9fQoKICA8ZGl2IGNsYXNzPSJvdmVyLWhyIj4KICAgIDxzcGFuPgogICAgICB7e3RlbXBsYXRlT3B0aW9uc1RpdGxlfX0KICAgIDwvc3Bhbj4KICA8L2Rpdj4KCiAge3tmb3JtLW5hbWUtZGVzY3JpcHRpb24KICAgIG1vZGVsPW1vZGVsCiAgICBuYW1lUmVxdWlyZWQ9dHJ1ZQogICAgcm93Q2xhc3M9InJvdyBtYi0xMCIKICB9fQoKICB7e2Zvcm0tdXNlci1sYWJlbHMKICAgIGluaXRpYWxMYWJlbHM9bGFiZWxSZXNvdXJjZS5sYWJlbHMKICAgIHNldExhYmVscz0oYWN0aW9uICJzZXRMYWJlbHMiKQogICAgZXhwYW5kPShhY3Rpb24gZXhwYW5kRm4pCiAgfX0KCiAge3tmb3JtLW5vZGUtdGFpbnRzCiAgICBtb2RlbD1tb2RlbAogICAgZXhwYW5kPShhY3Rpb24gZXhwYW5kRm4pCiAgfX0KCiAge3tmb3JtLWVuZ2luZS1vcHRzCiAgICBtYWNoaW5lPW1vZGVsCiAgICBzaG93RW5naW5lVXJsPXNob3dFbmdpbmVVcmwKICB9fQoKICB7e3RvcC1lcnJvcnMgZXJyb3JzPWVycm9yc319CgogIHt7c2F2ZS1jYW5jZWwgc2F2ZT0oYWN0aW9uICJzYXZlIikgY2FuY2VsPShhY3Rpb24gImNhbmNlbCIpIGVkaXRpbmc9ZWRpdGluZyB9fQo8L3NlY3Rpb24+";
  var computed = Ember.computed;
  var observer = Ember.observer;
  var get = Ember.get;
  var set = Ember.set;
  var setProperties = Ember.setProperties;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var EmberPromise = Ember.RSVP.Promise;
  var all = Ember.RSVP.all;
  var next = Ember.run.next;
  var languages = {
    'en-us': {
      "nodeDriver": {
        "harvester": {
          "cloudconfig": {
            "label": "Cloud Config YAML"
          },
          "imageName": {
            "label": "Image"
          },
          "diskBus": {
            "label": "Bus"
          },
          "access": {
            "title": "1. Account Access",
            "detail": "Configure where to find the Harvester server"
          },
          "instance": {
            "title": "2. Instance Options",
            "detail": "Choose the size and OS of the virtual machine"
          },
          "host": {
            "label": "Host",
            "placeholder": "IP/domain"
          },
          "port": {
            "label": "Port"
          },
          "username": {
            "label": "Username"
          },
          "internal": "Internal Harvester",
          "external": "External Harvester",
          "sshUser": {
            "label": "SSH User"
          },
          "networkName": {
            "label": "Network Name"
          },
          "password": {
            "label": "Password"
          },
          "cpuCount": {
            "label": "CPUs",
            "unit": "{cores, plural, =1 {Core} other {Cores}}"
          },
          "memorySize": {
            "label": "Memory",
            "unit": "GiB"
          },
          "diskSize": {
            "label": "Disk",
            "unit": "GiB"
          },
          "cloudConfig": {
            "label": "Cloud config"
          },
          "cloudinit": {
            "label": "Cloud Init"
          }
        }
      }
    },
    'zh-hans': {
      "nodeDriver": {
        "harvester": {
          "cloudconfig": {
            "label": "Cloud Config YAML"
          },
          "imageName": {
            "label": "镜像"
          },
          "diskBus": {
            "label": "磁盘 Bus"
          },
          "access": {
            "title": "1. 帐户访问",
            "detail": "配置在哪里查找 Harvester 服务器"
          },
          "instance": {
            "title": "2. 实例配置",
            "detail": "选择虚拟机的大小和操作系统"
          },
          "host": {
            "label": "主机",
            "placeholder": "IP/Domain"
          },
          "port": {
            "label": "端口"
          },
          "username": {
            "label": "用户名"
          },
          "internal": "内部 Harvester",
          "external": "外部 Harvester",
          "sshUser": {
            "label": "SSH 用户名"
          },
          "networkName": {
            "label": "网络"
          },
          "password": {
            "label": "密码"
          },
          "cpuCount": {
            "label": "CPUs",
            "unit": "{cores, plural, =1 {Core} other {Cores}}"
          },
          "memorySize": {
            "label": "内存",
            "unit": "GiB"
          },
          "diskSize": {
            "label": "磁盘",
            "unit": "GiB"
          },
          "cloudConfig": {
            "label": "Cloud config"
          },
          "cloudinit": {
            "label": "Cloud Init"
          }
        }
      }
    }
  };
  var BUS_OPTION = [{
    label: 'VirtIO',
    value: 'virtio'
  }, {
    label: 'SATA',
    value: 'sata'
  }, {
    label: 'SCSI',
    value: 'scsi'
  }];
  exports.default = Ember.Component.extend(_nodeDriver.default, {
    driverName: 'harvester',
    config: alias('model.harvesterConfig'),
    app: service(),
    busContent: BUS_OPTION,
    configField: 'harvesterConfig',
    lanChanged: null,
    refresh: false,
    imageContent: [],
    networkContent: [],
    controller: null,
    signal: '',
    isInternalMode: true,
    init: function init() {
      var decodedLayout = window.atob(LAYOUT);
      var template = Ember.HTMLBars.compile(decodedLayout, {
        moduleName: 'nodes/components/driver-harvester/template'
      });
      set(this, 'layout', template);

      this._super.apply(this, arguments);

      var lang = get(this, 'session.language');
      get(this, 'intl.locale');
      this.loadLanguage(lang);
      var controller = new AbortController();
      set(this, 'controller', controller);
      this.fetchImage();

      if (get(this, 'config').clusterType === 'internal') {
        set(this, 'isInternalMode', true);
      } else {
        set(this, 'isInternalMode', false);
      }
    },
    changeMode: observer('isInternalMode', function () {
      if (get(this, 'isInternalMode')) {
        set(this, 'config.host', '');
        set(this, 'config.port', '');
        set(this, 'config.clusterType', 'internal');
      } else {
        set(this, 'config.imageName', '');
        set(this, 'config.networkName', '');
        set(this, 'config.clusterType', 'external');
      }
    }),
    observeMetadata: observer("metadata.{labels,annotations}", function () {
      var metadata = this.get("metadata");
      set(this, "config.annotations", JSON.stringify(metadata.annotations));
      set(this, "config.labels", JSON.stringify(metadata.labels));
    }),
    metadata: {
      labels: {},
      annotations: {}
    },
    fetchImage: (0, _debounce.throttledObserver)('config.host', 'config.port', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var _this = this;

      var controller, signal, cur, pathname, pos, localhostPath, imageContent, networkContent;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              controller = get(this, 'controller');
              signal = get(this, 'signal');
              cur = window.document.location.href;
              pathname = window.document.location.pathname;
              pos = cur.indexOf(pathname);
              localhostPath = cur.substring(0, pos);
              signal = controller.signal;
              set(this, 'signal', signal);
              imageContent = get(this, 'imageContent');

              if (!imageContent.length) {
                get(this, 'globalStore').rawRequest({
                  url: "".concat(localhostPath, "/v1/harvesterhci.io.virtualmachineimages")
                }).then(function (resp) {
                  var data = resp.body.data || [];
                  var arr = data.filter(function (O) {
                    return !O.spec.displayName.endsWith('.iso');
                  }).map(function (O) {
                    var value = O.metadata.name;
                    var label = "".concat(O.spec.displayName, " (").concat(value, ")");
                    return {
                      label: label,
                      value: value
                    };
                  });

                  if (arr.length) {
                    set(_this, 'imageContent', arr);
                  } else {
                    set(_this, 'imageContent', []);
                  }
                }).catch(function (err) {
                  set(_this, 'imageContent', []);
                });
              }

              networkContent = get(this, 'networkContent');

              if (!networkContent.length) {
                get(this, 'globalStore').rawRequest({
                  url: "".concat(localhostPath, "/v1/k8s.cni.cncf.io.networkattachmentdefinition")
                }).then(function (resp) {
                  var data = resp.body.data || [];
                  var arr = data.map(function (O) {
                    var id = '';

                    try {
                      var config = JSON.parse(O.spec.config);
                      id = config.vlan;
                    } catch (err) {
                      console.log(err);
                    }

                    var value = O.metadata.name;
                    var label = "".concat(value, " (vlanId=").concat(id, ")");
                    return {
                      label: label,
                      value: value
                    };
                  });

                  if (arr.length) {
                    set(_this, 'networkContent', arr);
                  } else {
                    set(_this, 'networkContent', []);
                  }
                }).catch(function (err) {
                  set(_this, 'networkContent', []);
                });
              }

              controller.abort();

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }))),
    bootstrap: function bootstrap() {
      var config = get(this, 'globalStore').createRecord({
        type: 'harvesterConfig',
        host: '',
        port: '',
        username: '',
        password: '',
        cpuCount: 2,
        memorySize: 4,
        diskSize: 40,
        diskBus: 'virtio',
        imageName: '',
        sshUser: '',
        networkName: '',
        clusterType: 'internal',
        cloudConfig: '#cloud-config\n\n'
      });
      set(this, 'model.harvesterConfig', config);
    },
    validate: function validate() {
      this._super();

      var errors = get(this, 'errors') || [];
      var intl = get(this, 'intl');

      if (!get(this, 'model.name')) {
        errors.push(intl.t("nodeDriver.nameError"));
      }

      if (!get(this, 'config.host') && !get(this, 'isInternalMode')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.host.label")
        }));
      }

      if (!get(this, 'config.port') && !get(this, 'isInternalMode')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.port.label")
        }));
      }

      if (!get(this, 'config.username')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.username.label")
        }));
      }

      if (!get(this, 'config.password')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.password.label")
        }));
      }

      if (!get(this, 'config.diskBus')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.diskBus.label")
        }));
      }

      if (!get(this, 'config.imageName')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.imageName.label")
        }));
      }

      if (!get(this, 'config.networkName')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.networkName.label")
        }));
      }

      if (!get(this, 'config.sshUser')) {
        errors.push(intl.t('generic.required', {
          key: intl.t("nodeDriver.harvester.sshUser.label")
        }));
      }

      if (get(errors, 'length')) {
        set(this, 'errors', errors);
        return false;
      } else {
        set(this, 'errors', null);
        return true;
      }
    },
    loadLanguage: function loadLanguage(lang) {
      var _this2 = this;

      var translation = languages[lang] || languages['en-us'];
      var intl = get(this, 'intl');

      if (intl.addTranslation) {
        intl.addTranslation(lang, 'nodeDriver.harvester', translation.nodeDriver.harvester);
      } else {
        intl.addTranslations(lang, translation);
      }

      intl.translationsFor(lang);
      set(this, 'refresh', false);
      next(function () {
        set(_this2, 'refresh', true);
        set(_this2, 'lanChanged', +new Date());
      });
    },
    languageDidChanged: observer('intl.locale', function () {
      var lang = get(this, 'intl.locale');

      if (lang) {
        this.loadLanguage(lang[0]);
      }
    })
  });
});;
"use strict";

define("ui/components/driver-harvester/component", ["exports", "nodes/components/driver-harvester/component"], function (exports, _component) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});