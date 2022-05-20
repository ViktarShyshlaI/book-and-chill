public with sharing class PremisesTriggerService {
    public static void checkIsEventPremise(Map<Id, sObject> premises) {
        List<Premises__c> listPremises = premises.values();
        List<Event__c> eventsByPremise = [SELECT Name FROM Event__c WHERE Premises__c IN :listPremises];

        if (eventsByPremise.size() != 0) {
            premises.values()[0].addError('!!!IMPORTANT. You can\'t delete this Premis. It have future event');
        }
    }
}