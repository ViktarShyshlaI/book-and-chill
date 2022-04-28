public with sharing class EventController {
    
    @AuraEnabled(cacheable=true)
    public static List<Event__c> getListEvents() {
        return [SELECT Name, Premises__r.Name, Premises__c,  StartDateTime__c, EndDateTime__c FROM Event__c LIMIT 50000];
    }
}