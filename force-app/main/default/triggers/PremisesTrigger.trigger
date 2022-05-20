trigger PremisesTrigger on Premises__c (before delete) {
    TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
    triggerManager.addHandler(new PremisesTriggerHandler(), new List<TriggerTemplate.TriggerAction>{
        TriggerTemplate.TriggerAction.beforedelete
    });

    triggerManager.runHandlers();
}