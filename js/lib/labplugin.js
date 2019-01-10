var xdswidgets = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'xdswidgets',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'xdswidgets',
          version: xdswidgets.version,
          exports: xdswidgets
      });
  },
  autoStart: true
};

