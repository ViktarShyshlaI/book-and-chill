public with sharing class EventTriggerService {
    public static void checkEventsDate(List<Event__c> newEvents) {
        // Map<Id, List<ID>> eventsRelatedPremiseByIdNewEvent = new Map<Id, List<ID>>();
        List<Id> premisesIds = new List<Id>();
        try {
            for (Event__c ev : newEvents) {
                premisesIds.add(ev.Premises__c);
            }
            List<Event__c> eventsFromDB = [SELECT Id, Name, StartDateTime__c, EndDateTime__c, Premises__c FROM Event__c WHERE Premises__c IN :premisesIds];
            
            for(Integer i = 0; i != newEvents.size(); i++) {
                Event__c insertedEvent = newEvents[i];

                for (Event__c item : eventsFromDB) {  
                    if( (insertedEvent.StartDateTime__c > item.StartDateTime__c && insertedEvent.StartDateTime__c < item.EndDateTime__c) 
                     || (insertedEvent.EndDateTime__c > item.StartDateTime__c && insertedEvent.EndDateTime__c < item.EndDateTime__c) 
                     || (item.StartDateTime__c > insertedEvent.StartDateTime__c && item.StartDateTime__c < insertedEvent.EndDateTime__c)
                     || (item.EndDateTime__c > insertedEvent.StartDateTime__c && item.EndDateTime__c < insertedEvent.EndDateTime__c) ) {
                        // insertedEvent.addError(new CalloutException(0, 'You can\'t insert this record.'));
                        insertedEvent.addError('!!!IMPORTANT. The dates is booked. Choose different dates.');
                    }
                }
            }
        } catch (Exception ex) {
            ex.getMessage();
        }
    }
}
