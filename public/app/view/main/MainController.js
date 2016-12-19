Ext.define('Currencies.view.main.MainController', {
      extend : 'Ext.app.ViewController',

      requires : ['Ext.dd.DropTarget'],

      alias : 'controller.main',

      onAfterRender : function(cnt) {

        var currenciesGridStore = Currencies.getApplication().getStore('CurrenciesData');
        currenciesGridStore.load();

        var chartView = this.lookupReference('monitoringCharts');
        
        var divs = chartView.query('cartesian');

        Ext.each(divs, function(el) {
              if (!Ext.isEmpty(el.getEl())) {
                var formPanelDropTarget = new Ext.dd.DropTarget(el.getEl(), {
                      ddGroup : 'chartDDGroup',
                      notifyDrop : function(ddSource, event, data) {
                        ddSource.view.ownerCt.fireEvent("notifyDropRecord", ddSource, event, data, chartView, el);
                        return true;
                      }
                    });
              }
            });
      }
    });
