# currencies-demo
============================
### RUN demo:
`npm start`
  
### Description
It's a little demo that shows currencies rates in data grid and it's history changes for a month ago. 
You can drag a cell of "value" column and drop it on the chart area. When you do it twice, system will ask if you want to create new chart area.
Max number of currencies are 8 for every chart area.

### Main source files
  * /index.js - Simple NodeJS server for running application and get data from open service: http://www.cbr.ru/scripts/Root.asp?PrtId=SXML; 
  * /public/app contains UI part of application using ExtJS framework;



P.S. I'm sorry for size of the repo. There are many unnecessary and extra files of raw framework and builded app that should be deleted in future commits.
