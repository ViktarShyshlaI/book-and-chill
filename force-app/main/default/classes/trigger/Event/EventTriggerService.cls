public with sharing class EventTriggerService {
    public static void checkEventsDate(List<Event__c> newEvents) {
        // Map<Id, List<ID>> eventsRelatedPremiseByIdNewEvent = new Map<Id, List<ID>>();
        List<Id> idsPremiseIncomeEvents = new List<Id>();
        try {
            for (Event__c ev : newEvents) {
                if (ev.StartDateTime__c < datetime.now() || ev.EndDateTime__c < datetime.now()) {
                    ev.addError('ERROR! Cannot create event in past!');
                }
                idsPremiseIncomeEvents.add(ev.Premises__c);
            }

            // List<Event__c> eventsFromDB = [SELECT Id, Name, StartDateTime__c, EndDateTime__c, Premises__c FROM Event__c WHERE Premises__c IN :idsPremiseIncomeEvents];
            String soqlQuery = '';
            soqlQuery += 'SELECT Id, Name, StartDateTime__c, EndDateTime__c, Premises__c FROM Event__c';
            
            if (idsPremiseIncomeEvents.size() != 0) {
                soqlQuery += ' WHERE Premises__c IN :idsPremiseIncomeEvents AND Id != :newEvents';
            }
            
            List<Event__c> q = (List<Event__c>) Database.query(soqlQuery);
            
            for(Integer i = 0; i != newEvents.size(); i++) {
                Event__c insertedEvent = newEvents[i];
                
                for (Event__c item : q) {  
                    if( (insertedEvent.StartDateTime__c > item.StartDateTime__c && insertedEvent.StartDateTime__c < item.EndDateTime__c) 
                    || (insertedEvent.EndDateTime__c > item.StartDateTime__c && insertedEvent.EndDateTime__c < item.EndDateTime__c) 
                    || (item.StartDateTime__c > insertedEvent.StartDateTime__c && item.StartDateTime__c < insertedEvent.EndDateTime__c)
                    || (item.EndDateTime__c > insertedEvent.StartDateTime__c && item.EndDateTime__c < insertedEvent.EndDateTime__c) ) {
                        insertedEvent.addError('!!!IMPORTANT. The dates is booked. Choose different dates.');
                    }
                }
            }
        } catch (Exception ex) {
            ex.getMessage();
        }
    }
    

    // List<Event__c> eventsFromDB = [SELECT Id, Name, StartDateTime__c, EndDateTime__c, Premises__c FROM Event__c WHERE Name LIKE 'test'];
    // delete eventsFromDB;

}
