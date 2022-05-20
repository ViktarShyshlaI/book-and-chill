public with sharing class PremisesTriggerHandler implements TriggerTemplate.Handler {

    private List<sObject> newValues;
    private Map<Id, sObject> oldValues;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues) {
        this.newValues = (List<sObject>)newValues;
        this.oldValues = (Map<Id, sObject>)oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action) {
        if (action == TriggerTemplate.TriggerAction.beforedelete) {
            PremisesTriggerService.checkIsEventPremise(oldValues);
        }
    }
}
