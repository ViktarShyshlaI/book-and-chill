public with sharing class MessageInfoController {

    @AuraEnabled
    public static List<Message__c> getListMessages() {
        List<Message__c> getListMessages = [SELECT Id, Name, Message__c, Type__c, StartDateTime__c, EndDateTime__c 
                                            FROM Message__c
                                            WHERE EndDateTime__c > YESTERDAY
                                            AND StartDateTime__c <= NEXT_N_DAYS:30];
        return getListMessages;
    }

}
