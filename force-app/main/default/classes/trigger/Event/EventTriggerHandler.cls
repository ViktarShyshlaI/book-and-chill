public with sharing class EventTriggerHandler implements TriggerTemplate.Handler {

    private List<Event__c> newValues;
    private Map<Id, Event__c> oldValues;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues) {
        this.newValues = (List<Event__c>)newValues;
        this.oldValues = (Map<Id, Event__c>)oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action) {
        if (action == TriggerTemplate.TriggerAction.beforeinsert
            || action == TriggerTemplate.TriggerAction.beforeupdate) {
            EventTriggerService.checkEventsDate(newValues);
        }
        // else if (action == TriggerTemplate.TriggerAction.beforeupdate) {  
        //     EventTriggerService.updateTestPostfix(newValues, oldValues);
        // }
    }
}
