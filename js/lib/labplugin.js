var xdswidgets = require('./index');
var base = require('@jupyter-widgets/base');

console.log('xdswidgets/js/lib/labplugin.js')

module.exports = {
  id: 'xdswidgets',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      console.log('xdswidgets activate')
      widgets.registerWidget({
          name: 'xdswidgets',
          version: xdswidgets.version,
          exports: xdswidgets
      });
  },
  autoStart: true
};

