Ext.define('Currencies.view.currencies.CurrenciesGrid', {
      extend : 'Ext.grid.Panel',
      xtype : 'currenciesgrid',
      rowLines : true,
      emptyText: 'Data is loading...',
      viewConfig : {
        plugins : {
          ptype : 'gridviewdragdrop',
          dragText : 'Drag and drop',
          ddGroup : 'chartDDGroup',
          enableDrop : false
        }
      },
      initComponent : function() {
        var me = this;
        Ext.apply(this, {
              store : Currencies.getApplication().getStore('CurrenciesData'),
              columns : [{
                    text : 'Currency',
                    sortable : false,
                    dataIndex : 'CharCode',
                    flex : 1
                  }, {
                    text : 'Value',
                    sortable : false,
                    dataIndex : 'Value',
                    align : 'right',
                    flex : 1
                  }],
              listeners : {
                notifyDropRecord : function(ddSource, event, data, chartView, cartesian) {
                  if (ddSource.view.lastFocused.column.text == "CharCode") {
                    return true;
                  }
                  var selectedRecord = ddSource.dragData.records[0];
                  var target = chartView.items.items[0].items.items[0];
                  target.fireEvent("dropRecord", target, selectedRecord, cartesian);
                }
              }
            });
          var errorPanel = Ext.create('Ext.panel.Panel', {
              bodyStyle: 'background-color: #878ea2',
              html: 'error'
          });
          this.store.addListener('proxyexception', function(error){
              errorPanel.setConfig('html', '<div style="color: darkred; font-style: italic; font-weight: bold;">Error status: ' + error + '</div>');
              errorPanel.show();
              me.ownerCt.header.insert(1, errorPanel);
          });
          this.store.addListener('successload', function(){
              errorPanel.hide();
          });
        this.callParent();
      }
    });