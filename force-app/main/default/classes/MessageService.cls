
public with sharing class MessageService {
    public static void sendTextEmails(EmailTemplate emailTemplate, List<Id> targetObjectIds) {
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        for (Id id : targetObjectIds) {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.saveAsActivity = false;
            mail.setTargetObjectId(id);
            mail.setTemplateId(emailTemplate.Id);
            mail.setUseSignature(false);
            mail.setSaveAsActivity(false);
            emails.add(mail);
        }

        try {
            Messaging.sendEmail(emails);   
        }
        catch (Exception ex) {
            ex.getMessage();
            System.debug(ex.getMessage());
            System.debug('Emails weren`t sends');
        }
    }

    public static void sendTextEmails(String subject, String body, List<Id> targetObjectIds) {
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        for (Id id : targetObjectIds) {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.saveAsActivity = false;
            mail.setTargetObjectId(id);
            mail.setSubject(subject);
            mail.plainTextBody = body;
            mail.setUseSignature(false);
            mail.setSaveAsActivity(false);
            emails.add(mail);
        }

        try {
            Messaging.sendEmail(emails);   
        }
        catch (Exception ex) {
            ex.getMessage();
            System.debug(ex.getMessage());
            System.debug('Emails weren`t sends');
        }
    }
}