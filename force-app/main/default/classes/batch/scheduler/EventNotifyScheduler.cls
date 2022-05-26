public with sharing class EventNotifyScheduler implements Schedulable {
    
    public void execute(SchedulableContext sc) {
        EventNotifyBatch enb = new EventNotifyBatch();
        Database.executeBatch(enb);
    }
}
