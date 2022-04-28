public with sharing class PremiseseController {
    
    @AuraEnabled(cacheable=true)
    public static List<Premises__c> getListPremises() {
        return [SELECT Name, City__c FROM Premises__c LIMIT 50000];
    }
}