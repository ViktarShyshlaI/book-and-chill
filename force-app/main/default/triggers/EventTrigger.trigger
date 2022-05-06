trigger EventTrigger on Event__c (before insert, before update) {

    TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
    triggerManager.addHandler(new AccountTriggerHandler(), new List<TriggerTemplate.TriggerAction>{
        TriggerTemplate.TriggerAction.beforeinsert, TriggerTemplate.TriggerAction.beforeupdate
    });

    triggerManager.runHandlers();

}