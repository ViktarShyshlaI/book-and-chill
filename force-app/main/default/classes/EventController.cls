public with sharing class EventController {
    
    public List<Event__c> listEvents {get; set;}
    
    public EventController() {
        List<Event__c> eventsFromDB = getListEvents();
        listEvents.addAll(eventsFromDB);
    }
    
    @AuraEnabled
    public static List<Event__c> getListEvents() {

        Datetime today = Datetime.now();
        Datetime nextThirtyDays = today.addDays(30);
        String soqlQuery = '';
        soqlQuery += 'SELECT Id, Name, Premises__c,'
                                + ' Premises__r.Name,'
                                + ' Premises__r.City__c,' 
                                + ' Premises__r.Country__c,' 
                                + ' Premises__r.Street__c,'
                                + ' Type__c, StartDateTime__c, EndDateTime__c'
                                + ' FROM Event__c' 
                                + ' WHERE StartDateTime__c > YESTERDAY'
                                + ' AND StartDateTime__c <= NEXT_N_DAYS:30'
                                + ' AND ConfirmEvent__c = true'
                                + ' ORDER BY StartDateTime__c';
        System.debug(soqlQuery);

        List<Event__c> q = (List<Event__c>)Database.query(soqlQuery);

        return q;
    }

    @AuraEnabled
    public static Event__c getInsertedRecord(String nameNewEvent){
        Event__c ev = [SELECT Id, Name, Premises__c, Premises__r.Name, Type__c, StartDateTime__c, EndDateTime__c FROM Event__c WHERE Name = :nameNewEvent LIMIT 1];
        System.debug(ev);
        return ev;
    }
}