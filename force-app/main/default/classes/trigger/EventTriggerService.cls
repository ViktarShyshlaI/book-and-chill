public with sharing class EventTriggerService {
    public static void checkEventsDate(List<Event__c> newEvents) {
        Map<Id, List<ID>> mapName = new Map<Object, Object>();
        for (Event__c ev : newEvents) {
            //ev.Premises__c
        }

        List<Event__c> eventsFromDB = [SELECT Id, Name, StartDateTime__c, EndDateTime__c, Premises__c WHERE Premises__c IN :newEvents];
        
    }
}
