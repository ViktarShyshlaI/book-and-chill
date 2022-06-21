import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getListEvents from '@salesforce/apex/EventController.getListEvents';

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
    
    get startDate() {
        return 
    }

    async handleSuccess(event) {
        const events = await getListEvents();
        this.showToast("Event was created", 'Record ID: ' + event.detail.Name, "success");
        this.handleCloseModal();
    }
        
    handleError() {
        this.fields.STARTTIME_FIELD = Date.now();
        this.fields.ENDTIME_FIELD = Date.now();
        console.log("handleError method");
        console.log(typeof this.fields.STARTTIME_FIELD);
        this.handleCloseModal();
    }

    handleCloseModal() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
    
    showToast(theTitle, theMessage, theVariant) {
        const event = new ShowToastEvent({
            title: theTitle,
            message: theMessage,
            variant: theVariant
        });
        this.dispatchEvent(event);
    }


    // handleStartDateFill(event) {
    //     let dt = event.target.value;
    //     console.log(dt);
    //     var today = new Date();
    //     var dd = String(today.getDate()).padStart(2, '0');
    //     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //     var yyyy = today.getFullYear();

    //     today = mm + '/' + dd + '/' + yyyy;
    //     console.log(today);

    //     var currentdate = new Date(); 
    //     var datetime = "Last Sync: " + currentdate.getDate() + "/"
    //             + (currentdate.getMonth()+1)  + "/" 
    //             + currentdate.getFullYear() + " @ "  
    //             + currentdate.getHours() + ":"  
    //             + currentdate.getMinutes() + ":" 
    //             + currentdate.getSeconds();
    //     console.log(datetime);
    // }

    // handleChnage() {
        // const selectedEvent = new CustomEvent("closemodal", {
        //     detail: this.progressValue
        //   });
      
        //   // Dispatches the event.
        //   this.dispatchEvent(selectedEvent);
        
        // this.dispatchEvent(new CustomEvent('closemodal'));
    // }
}