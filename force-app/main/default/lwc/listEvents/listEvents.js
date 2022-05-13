import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getListEvents from '@salesforce/apex/EventController.getListEvents';
import getInsertedRecord from '@salesforce/apex/EventController.getInsertedRecord';
import { refreshApex } from '@salesforce/apex';

import EVENT_OBJECT from '@salesforce/schema/Event__c';
import NAME_FIELD from '@salesforce/schema/Event__c.Name';
import TYPE_FIELD from '@salesforce/schema/Event__c.Type__c';
import PREMISELOOKUP_FIELD from '@salesforce/schema/Event__c.Premises__c';
import STARTTIME_FIELD from '@salesforce/schema/Event__c.StartDateTime__c';
import ENDTIME_FIELD from '@salesforce/schema/Event__c.EndDateTime__c';

const columns = [
    {   
        label: 'Name',
        fieldName: 'EventName',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' }, 
            target: '_blank'
        }
    },
    { 
        label: 'Premise', 
        fieldName: 'PremisesName' 
    },
    { 
        label: 'Type', 
        fieldName: 'Type__c' 
    },
    { 
        label: "Start",
        fieldName: "StartDateTime__c",
        type: "date",
        typeAttributes:{
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
        }
    },
    { 
        label: "End",
        fieldName: "EndDateTime__c",
        type: "date",
        typeAttributes:{
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
        }
    },
];

export default class ListEvents extends LightningElement {
    isModalOpen = false;
    isData = false;
    @track records;
    columns = columns;
    insertedRecord;
    error;
    
    startDate = null;
    endDate = null;
    
    objectApiName = EVENT_OBJECT;
    fields = [NAME_FIELD, TYPE_FIELD, PREMISELOOKUP_FIELD, STARTTIME_FIELD, ENDTIME_FIELD];

    connectedCallback() {
        console.log("connectedCallback method");
        this.getEvents();
    }
    
            
    getEvents() {
        console.log("console method");
        getListEvents()
        .then(result => {
            console.log("result", result);
            let tempEvntList = []; 
            result.forEach((record) => {
                let tempEvnRec = Object.assign({}, record);  
                tempEvnRec.EventName = '/' + tempEvnRec.Id;
                if (!tempEvnRec.Premises__c || tempEvnRec.Premises__c.length === 0 ) {
                    tempEvnRec.PremisesName = "";    
                }
                else {
                    tempEvnRec.PremisesName = tempEvnRec.Premises__r.Name;
                }
                tempEvntList.push(tempEvnRec);
            });
            this.records = tempEvntList;
            console.log("this.records", this.records);
            if (this.records.length !== 0) {
                this.isData = true;
            }
        })
        .catch(error => {
            console.error("error calling apex controller:",error);
        });
    }


    handleStartDateFill(event) {
        if (this.endDate == null || this.endDate < event.target.value) {
            this.endDate = event.target.value;
        }
    }
    
    handleEndDateFill(event) {
        this.endDate = event.target.value;
        if (this.startDate == null || this.endDate <= this.startDate) {
            this.startDate = this.endDate;
        }
    }
    
    
    
    showToast(theTitle, theMessage, theVariant) {
        const event = new ShowToastEvent({
            title: theTitle,
            message: theMessage,
            variant: theVariant
        });
        this.dispatchEvent(event);
    }
    
    handleSuccess(event) {
        this.showToast("Event was created", 'Record ID: ' + event.detail.Name, "success");

        // const evt = new ShowToastEvent({
            //     title: 'Event was created',
            //     message: 'Record ID: ' + event.detail.Name,
            //     variant: 'success',
            // });
            // this.dispatchEvent(evt);
            // console.log('event detail: ', event.detail);
            // console.log('NAME_FIELD: ', NAME_FIELD);
            this.handleModalChange();
    }
        
    handleModalChange() {
        this.isModalOpen = !this.isModalOpen;
        // this.endDate = null;
        // this.startDate = null;
    }
    

    
    // @wire( getListEvents )  
    // wiredEvents( value ) {
        //     const { data, error } = value;
        //     if ( data ) {
            //         let tempEvntList = []; 
            //         data.forEach((record) => {
                //             let tempEvnRec = Object.assign({}, record);  
                //             tempEvnRec.EventName = '/' + tempEvnRec.Id;
    //             tempEvnRec.PremisesName =  tempEvnRec.Premises__r.Name;
    //             tempEvntList.push(tempEvnRec);
    //         });
    //         this.records = tempEvntList;
    //         if (this.records.length !== 0) {
        //             this.isData = true;
        //         }
        
        //     } else if ( error ) {
            //         this.error = error;
            //         this.records = undefined;
            //     }
            // }

    // refresh() {
    //     getListEvents()
    //     .then(result => {
    //         this.records = result;
    //     })
    // }


    // handleEventFire() {
        //     console.log("handleEventFire");
    //     this.handleModalChange();
    // }
    
    
    // handleError(event){ this.template.querySelector('lightning-messages').setError('your custom error message'); }
    
   
    
    // handleError(event) {
        //     let detail = event.detail.detail;
    //     event.detail.message = "eeee";

    //     console.log("detail: ", detail);
    //     console.log("message: ", message);
    //     //do some stuff with message to make it more readable
    //     // message = "Something went wrong!";
    //     this.showToast("ERROR", message, "error");
    // }
    
    
    // async handleSuccess(event) {
        
        //     const payload = event.detail;
        //     let createdEvent = JSON.parse(JSON.stringify(payload));  
    //     let nameRec = createdEvent.fields.Name.value;
    //     console.log(typeof nameRec);
        
    //     await getInsertedRecord({ nameNewEvent : nameRec })
    //         .then((result) => {
    //             console.log('result: ', result);
    //             this.insertedRecord = result;
    //             this.error = undefined;
    //         })
    //         .catch((error) => {
    //                 console.log('error: ', error);
    //                 this.error = error;
    //             this.insertedRecord = undefined;
    //         });

    //         this.records.push(this.insertedRecord);
    //         console.log("records: " , this.records);
           
    //     this.showToast("SUCCESS!", "New record has been created.", "success")
    //     this.handleModalChange();
    // }
    
    
}
    // wiredRecords;
    // @wire( getListEvents ) events;
    // events;

    // @wire( getListEvents )  
    // wiredAccount( { error, data } ) {
    //     if ( data ) {
    //         let rows = JSON.parse( JSON.stringify( data ) );
    //         console.log( 'Rows are ' + JSON.stringify( rows ) );
    //         const options = {
    //             year: 'numeric', month: 'numeric', day: 'numeric',
    //             hour: 'numeric', minute: 'numeric', second: 'numeric',
    //             hour12: false
    //         };
    //         for ( let i = 0; i < rows.length; i++ ) {  
    //             let dataParse = rows[ i ];
    //             if ( dataParse.StartDateTime__c ) {
    //                 let dt = new Date( dataParse.StartDateTime__c );
    //                 dataParse.StartDateTime__c = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
    //             }
    //             if ( dataParse.EndDateTime__c ) {
    //                 let dt = new Date( dataParse.EndDateTime__c );
    //                 dataParse.EndDateTime__c = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
    //             }
    //         }
    //         this.events = rows;
    //         this.error = undefined;
    //     } else if ( error ) {
    //         this.error = error;
    //         this.events = undefined;
    //     }
    // }  