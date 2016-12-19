Ext.define('Currencies.store.CurrenciesData', {
      extend : 'Ext.data.Store',
      proxy : {
        type : 'rest',
        url : AppConfig.server_url + AppConfig.mtm_service_url,
        reader : {
          type : 'json',
          rootProperty : 'ValCurs.Valute'
        },
          listeners: {
              exception: function(proxy , request , operation){
                  var store = Currencies.getApplication().getStore('CurrenciesData');
                  var errorMessage = request.status + " " + request.statusText;
                  switch (request.status){
                      case 0: {
                          errorMessage = 'Connection Error';
                          break;
                      }
                  }
                  store.fireEvent('proxyexception', errorMessage);
              }
          }
      },
    listeners: {
        load: function(store, successfull){
            if(successfull){
                store.fireEvent('successload');
            }
        }
    }
    });