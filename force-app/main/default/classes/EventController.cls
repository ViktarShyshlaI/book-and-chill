public with sharing class EventController {
    
    @AuraEnabled(cacheable=true)
    public static List<Event__c> getListEvents() {
        return [SELECT Id, Name, Premises__r.Name, Type__c, StartDateTime__c, EndDateTime__c FROM Event__c LIMIT 50000];
    }

    @AuraEnabled
    public static Event__c getInsertedRecord(String nameNewEvent){
        Event__c ev = [SELECT Id, Name, Premises__r.Name, Type__c, StartDateTime__c, EndDateTime__c FROM Event__c WHERE Name = :nameNewEvent LIMIT 1];
        System.debug(ev);
        return ev;
    }
}