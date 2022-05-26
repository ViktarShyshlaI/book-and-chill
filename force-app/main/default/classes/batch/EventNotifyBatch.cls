public with sharing class EventNotifyBatch implements Database.Batchable<sObject>, Database.Stateful {

    private Integer countNonConfirmEvents = 0;
    List<String> eventsName = new List<String>();


    public Database.QueryLocator start(Database.BatchableContext bc) {
        return DataBase.getQueryLocator([SELECT Name, ConfirmEvent__c 
                                         FROM Event__c 
                                            WHERE ConfirmEvent__c = false 
                                            AND EndDateTime__c > TODAY
                                            AND StartDateTime__c <= NEXT_N_DAYS:35]);
    }

    public void execute(Database.BatchableContext bc, List<Event__c> scope) {
        for (Event__c ev : scope) {
            if (!ev.ConfirmEvent__c) {
                countNonConfirmEvents += 1;
                eventsName.add(ev.Name);   
            }
        }
    }

    public void finish(Database.BatchableContext bc) {
        List<Id> usersIds = getUsersToSendEmails();
        if (this.countNonConfirmEvents != 0 && !usersIds.isEmpty()) {
            String subject = 'Reminder!';
            String body = 'You have non confirmed events: ' + this.countNonConfirmEvents + '\n ' + this.eventsName;
            MessageService.sendTextEmails(subject, body, usersIds);
        }
    }

    private List<Id> getUsersToSendEmails() {
        List<Id> usersIds = new List<Id>();
        List<User> usrers = [SELECT Id, Name, Email FROM User WHERE Profile.Name = 'Event Organizer' AND IsActive = true];
        for (User u : usrers) {
            usersIds.add(u.Id);
        }
        return usersIds;
    }
}

// EventNotifyBatch adb = new EventNotifyBatch();
// Database.executeBatch(adb);

// datetime myDateTime = datetime.now();
// System.debug(myDateTime.addDays(30));
// System.debug(myDateTime.addDays(35));

// List<Event__c> listName = [SELECT Id FROM Event__c WHERE EndDateTime__c < TODAY];
// System.debug(listName.size());
// delete listName;

// EventNotifyScheduler ev = new EventNotifyScheduler();
// String sch = '0 20 13 1/1 * ? *';
// String jobID = System.schedule('Remind Opp Owners', sch, ev);