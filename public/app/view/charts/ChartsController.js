Ext.define('Currencies.view.charts.ChartsController', {
      extend : 'Ext.app.ViewController',
      alias : 'controller.line-marked',
      requires : ['Ext.chart.axis.Numeric', 'Ext.chart.axis.Time', 'Ext.chart.series.Line', 'Ext.chart.interactions.ItemHighlight', 'Ext.chart.axis.Category'],
      tooltip : null,

      onAxisStaticLabelRender : function(axis, label, layoutContext) {
        return label.toFixed(label < 10 ? 1 : 0);
      },

      onModeToggle : function(segmentedButton, button, pressed) {
        var view = this.getView(),
        charts = view.query('cartesian');

        charts.forEach(function(chart) {
              var interactions = chart.getInteractions(), panzoom = interactions[0], value = segmentedButton.getValue(), isEnabled = value === 0;
              panzoom.setZoomOnPanGesture(value === 1);
            });

      },

      onPanZoomReset : function() {
        var view = this.getView(),
        charts = view.query('cartesian');

        charts.forEach(function(chart) {
              axes = chart.getAxes();
              axes[0].setVisibleRange([0, 1]);
              axes[1].setVisibleRange([0, 1]);
              chart.redraw();
            });

      },

      onSeriesTooltipRender : function(tooltip, record, item) {
        var title = item.series.getTitle();
        var date = new Date(record.get('date'));
        tooltip.setHtml(title + ' на ' + Ext.Date.format(date, ("M d, Y")) + ': ' + record.get(item.series.getYField()));
      },

      onSeriesMouseOver : function(series, item, event) {
        var title = item.series.getTitle();
        clearTimeout(this.tooltipTimeout);
        this.tooltip && this.tooltip.hide();
        this.tooltip = Ext.create('Ext.tip.ToolTip', {
              trackMouse : true,
              offsetX : 10,
              offsetY : 10,
              renderer : Ext.emptyFn,
              constrainPosition : true,
              shrinkWrapDock : true,
              autoHide : true,
              renderer : 'onSeriesTooltipRender'
            });
        var config = this.tooltip.config;
        var xy = [event.browserEvent.clientX + config.offsetX, event.browserEvent.clientY + config.offsetY];
        Ext.callback(this.tooltip.renderer, this.tooltip.scope, [this.tooltip, item.record, item], 0, this);
        this.tooltip.show(xy);
      },

      onSeriesMouseOut : function(series, item, event) {
        var me = this;
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = Ext.defer(function() {
              me.tooltip.hide();
            }, 1);
      },

      onXLabelRender : function(axis, label, layoutContext) {
        return Ext.Date.format(new Date(label), ("M d, Y"));
      },

      onTimeChartRendered : function(chart) {
        var me = this, chartStore = Currencies.getApplication().getStore('Chart');
        chartStore.on({
              load : this.onChartsDataLoaded,
              scope : this
            });
      },

      onChartsDataLoaded : function() {
        this.addNewData();
        Currencies.getApplication().getStore('Chart').removeAll();
      },

      onAxisLabelRender : function(axis, label, layoutContext) {
        // only render integer values
        return Math.abs(layoutContext.renderer(label) % 1) < 1e-5 ? Math.round(label) : '';
      },

      addNewData : function() {
        var me = this, charts = me.getView().query('cartesian'),
        appChartStore = Currencies.getApplication().getStore('Chart');

        charts.forEach(function(chart) {
              chart.animationSuspended = true;
            });
            
        var graphList = appChartStore.data.items.length > 0 ? appChartStore.data.items[0].data.graphParamList : null;
        var parameters = [];

        charts.forEach(function(chart) {
              var store = chart.getStore();
              if (graphList != undefined && graphList != null) {
                for (var i = 0; i < graphList.length; i++) {

                  var item = graphList[i],
                  dataList = item.dataList,
                  hashKey = item.hashKey;
                  parameters.push(hashKey);

                  for (var j = 0; j < dataList.length; j++) {
                    if (dataList[j].value != null) {

                      var index = store.findExact('date', dataList[j].date), obj = (index > -1) ? store.getAt(index).data : dataList[j];

                      obj[hashKey] = Number(dataList[j].value).toFixed(2);

                      store.add(obj);
                      store.sort('date', 'asc');

                    }
                  }

                }
              }

              for (var i = 1; i < store.getCount(); i++) {
                var item = store.getAt(i);
                parameters.forEach(function(parameter) {
                      if (Ext.isEmpty(item.data[parameter]) && !Ext.isEmpty(store.getAt(i - 1).data[parameter])) {
                        item.data[parameter] = store.getAt(i - 1).data[parameter];
                      }
                    });
              }
              store.commitChanges();
            });

        charts.forEach(function(chart) {
              chart.animationSuspended = false;
              chart.performLayout();
              chart.getEl().unmask();
            });
      },

      onDropRecord : function(activeTab, selectedRecord, cartesian) {
        var cancel = false;
        var view = this.getView().items.items[0];
        var me = this;
        if (view.query('cartesian').length == 1 && view.query('cartesian')[0].series.length > 0) {
          Ext.MessageBox.show({
                title : "New parameter",
                msg : "Add this parameter to existing chart or create new one?",
                buttons : Ext.Msg.YESNOCANCEL,
                buttonText : {
                  yes : 'Add',
                  no : 'Create new',
                  cancel : 'Cancel'
                },
                fn : function(btn) {
                  if (btn == 'cancel') {
                    return;
                  } else if (btn == 'no') {
                    cartesian = Ext.create('Ext.chart.CartesianChart', view.defaults);
                    cartesian.setConfig('store', Ext.create('Ext.data.Store'));
                    view.add(cartesian);
                    var formPanelDropTarget = new Ext.dd.DropTarget(cartesian.getEl(), {
                          ddGroup : 'chartDDGroup',
                          notifyDrop : function(ddSource, event, data) {
                            var chartView = view.ownerCt.ownerCt;
                            ddSource.view.ownerCt.fireEvent("notifyDropRecord", ddSource, event, data, chartView, cartesian);
                            return true;
                          }
                        });
                  }
                  var chart = cartesian;
                  chart.getEl().mask('Please wait...');
                  var chartStore = Currencies.getApplication().getStore('Chart');

                  if (chart.series.length < 8) {
                    me.addSeries(chart, selectedRecord.data.CharCode, selectedRecord.data.$.ID);
                  } else {
                    alert('You can add only 8 lines to the chart panel.');
                  }

                  var series = [];
                  view.query('cartesian').forEach(function(c) {
                        c.series.forEach(function(serie) {
                              series.push(serie);
                            });

                      });
                  me.setStoreExtraParams(chartStore, series);
                  chartStore.load();
                }
              });

        } else {
          var chart = cartesian;
          chart.getEl().mask('Please wait...');
          var chartStore = Currencies.getApplication().getStore('Chart');

          if (chart.series.length < 8) {
            me.addSeries(chart, selectedRecord.data.CharCode, selectedRecord.data.$.ID);
          } else {
            alert('You can add only 8 lines to the chart panel.');
          }

          var series = [];
          view.query('cartesian').forEach(function(c) {
                c.series.forEach(function(serie) {
                      series.push(serie);
                    });

              });
          me.setStoreExtraParams(chartStore, series);
          chartStore.load();
        }
      },

      setStoreExtraParams : function(store, series) {
        var day = 24 * 60 * 60 * 1000, // ms
        month = 30 * 24 * 60 * 60 * 1000, // ms
        view = this.getView(), chart = view.items.items[0].items.items[0], last = chart.getStore().last(), lastDate;

        if (last != undefined && last != null) {
          lastDate = last.data.dateEnd;
        }
        store.proxy.setExtraParam("dateStart", lastDate || Ext.Date.now() - 30 * day);// yesterday
        store.proxy.setExtraParam("dateEnd", Ext.Date.now());// tomorrow

        var graphList = [];
        if (series != undefined) {
          for (var i = 0; i < series.length; i++) {
            var s = series[i];
            graphList.push({
                  'hashKey' : s.hashKey,
                });
          }
          store.proxy.setExtraParam("graphParamList", graphList);
        }
      },

      addSeries : function(chart, title, hashKey) {
        var newSeries = chart.series || [];
        newSeries.push({
              type : 'line',
              fill : true,
              title : title,
              xField : 'date',
              yField : hashKey,
              hashKey : hashKey,
              marker : true,
              style : {
                opacity : 0.30
              },
              listeners : {
                itemmouseover : 'onSeriesMouseOver',
                itemmouseout : 'onSeriesMouseOut'
              }
            });

        chart.setConfig('series', newSeries);
        chart.performLayout();
      },

      updateSprite : function(chart) {
        var series = chart.series, arr = new Array();
        for (var i = 0; i < chart.series.length; i++) {
          arr.push(chart.series[i]._title);
        }
        var spriteText = arr.join(', ');
        newSprite = [{
              type : 'text',
              text : spriteText,
              fontSize : 22,
              width : 100,
              height : 30,
              x : 40,
              y : 20
            }];
        chart.setConfig('sprites', newSprite);
      }
    });
