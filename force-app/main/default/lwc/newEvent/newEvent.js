import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import EVENT_OBJECT from '@salesforce/schema/Event__c';
import NAME_FIELD from '@salesforce/schema/Event__c.Name';
import TYPE_FIELD from '@salesforce/schema/Event__c.Type__c';
import PREMISELOOKUP_FIELD from '@salesforce/schema/Event__c.Premises__c';
import STARTTIME_FIELD from '@salesforce/schema/Event__c.StartDateTime__c';
import ENDTIME_FIELD from '@salesforce/schema/Event__c.EndDateTime__c';
  
export default class NewEvent extends LightningElement {
    @api recordId;

    objectApiName = EVENT_OBJECT;
    fields = [NAME_FIELD, TYPE_FIELD, PREMISELOOKUP_FIELD, STARTTIME_FIELD, ENDTIME_FIELD];
    
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Event was created',
            message: 'Record ID: ' + event.detail.Name,
            variant: 'success',
        });
        this.dispatchEvent(evt);
        console.log('event detail: ', event.detail);
        console.log('NAME_FIELD: ', NAME_FIELD);
        this.handleChnage();
    }
        
    handleError() {
        this.fields.STARTTIME_FIELD = Date.now();
        this.fields.ENDTIME_FIELD = Date.now();
        console.log("handleError method");
        console.log(typeof this.fields.STARTTIME_FIELD);
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    handleChnage() {
        // const selectedEvent = new CustomEvent("closemodal", {
        //     detail: this.progressValue
        //   });
      
        //   // Dispatches the event.
        //   this.dispatchEvent(selectedEvent);
        
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
}