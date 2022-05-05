public with sharing class FullCalendarController {

    public FullCalendarController() {}

    @AuraEnabled
    public static List<Object> getEventsNearbyDynamic(Date startDate, Date endDate, String objectName, String titleField, String startField, String endField, String colorField, String allDayField, String additionalFilter, String recordId)  {
        Datetime lastMonth = Datetime.newInstance(startDate.year(),startDate.month(),startDate.day());
        //lastMonth = lastMonth.addMonths(-1);
        String lastMonthStr = lastMonth.formatGmt('yyyy-MM-dd\'T\'hh:mm:ss\'Z\'');
        Datetime nextMonth = Datetime.newInstance(endDate.year(),endDate.month(),endDate.day());
        //nextMonth = nextMonth.addMonths(2).addDays(-1);
        String nextMonthStr = nextMonth.formatGmt('yyyy-MM-dd\'T\'hh:mm:ss\'Z\'');
        String soqlQuery = '';
        if (additionalFilter == null) {
            additionalFilter = '';
        }
        if (recordId == null) {
            recordId = 'a015j00000GU4cxAAD';
        }
        if ((colorField != null) && (colorField != '')) {
            colorField = ','+colorField;
        } else {
            colorField = '';
        }
        if ((allDayField != null) && (allDayField != '')) {
            allDayField = ','+allDayField;
        } else {
            allDayField = '';
        }
        soqlQuery += 'SELECT Id, '+titleField+', '+startField+', '+endField + colorField + allDayField+' FROM ' + objectName;
       
        soqlQuery += ' WHERE (('+startField+' >= '+lastMonthStr+' AND '+startField+' <= '+nextMonthStr+')';
        soqlQuery += ' OR ('+endField+' >= '+lastMonthStr+' AND '+endField+' <= '+nextMonthStr+'))';
        
        if (additionalFilter != '' && recordId != '') {
            soqlQuery += ' AND ' + additionalFilter + ' = \'' + recordId + '\'';
            // soqlQuery += ' AND ' + 'Premises__r.Id' + ' = \'' + 'a015j00000GU4eAAAT' + '\'';
        }
        
        System.debug('startDate = ' + startDate.format());
        System.debug('endDate = ' + endDate.format());
        System.debug('objectName = ' + objectName);
        System.debug('titleField = ' + titleField);
        System.debug('startField = ' + startField);
        System.debug('endField = ' + endField);
        System.debug('colorField = ' + colorField);
        System.debug(soqlQuery);
        
        // System.debug('ID: ' + pexpages.currentpage().getparameters().get('id'));

        List<Object> q = Database.query(soqlQuery);
        if (q == null) {
            q = new List<Object>();
        }
        System.debug('results = ' + q.size());
        return q;
    }

}
