public with sharing class FullCalendarService {

    @AuraEnabled
    public static List<Event__c> fetchAllEvents(){
        List<Event__c> eventList = new List<Event__c>();
        eventList = [SELECT Id, Name, Premises__c, 
                        Premises__r.Name, Type__c, 
                        StartDateTime__c, EndDateTime__c, 
                        IsAllDayEvent__c FROM Event__c LIMIT 100];
        return eventList;
    }
}