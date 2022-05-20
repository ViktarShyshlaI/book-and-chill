public with sharing class EventController {
    
    public List<Event__c> listEvents {get; set;}
    
    public EventController() {
        List<Event__c> eventsFromDB = getListEvents();
        listEvents.addAll(eventsFromDB);
    }
    
    @AuraEnabled
    public static List<Event__c> getListEvents() {
        return [SELECT Id, Name, Premises__c, 
                                 Premises__r.Name, 
                                 Premises__r.City__c, 
                                 Premises__r.Country__c, 
                                 Premises__r.Street__c, 
                        Type__c, StartDateTime__c, EndDateTime__c 
                FROM Event__c ORDER BY StartDateTime__c];
    }

    @AuraEnabled
    public static Event__c getInsertedRecord(String nameNewEvent){
        Event__c ev = [SELECT Id, Name, Premises__c, Premises__r.Name, Type__c, StartDateTime__c, EndDateTime__c FROM Event__c WHERE Name = :nameNewEvent LIMIT 1];
        System.debug(ev);
        return ev;
    }
}