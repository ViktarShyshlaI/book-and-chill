import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import EVENT_OBJECT from '@salesforce/schema/Event__c';
import NAME_FIELD from '@salesforce/schema/Event__c.Name';
import PREMISELOOKUP_FIELD from '@salesforce/schema/Event__c.Premises__c';
import STARTTIME_FIELD from '@salesforce/schema/Event__c.StartDateTime__c';
import ENDTIME_FIELD from '@salesforce/schema/Event__c.EndDateTime__c';
  
export default class NewEvent extends LightningElement {
        
    eventObject = EVENT_OBJECT;
    fields = [NAME_FIELD, PREMISELOOKUP_FIELD, STARTTIME_FIELD, ENDTIME_FIELD];
    
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Event was created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
        
    handleChnage() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
}