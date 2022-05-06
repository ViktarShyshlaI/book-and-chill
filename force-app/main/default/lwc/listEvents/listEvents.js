import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getListEvents from '@salesforce/apex/EventController.getListEvents';
import getInsertedRecord from '@salesforce/apex/EventController.getInsertedRecord';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {   
        label: 'Name',
        fieldName: 'EvntName',
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
    records;
    columns = columns;
    insertedRecord;
    error;

    startDate = null;
    endDate = null;

    handleStartDateFill(event) {
        if (this.endDate == null || this.endDate < event.target.value) {
            this.endDate = event.target.value;
        }
    }
    
    handleEndDateFill(event) {
        this.endDate = event.target.value;
        if (this.startDate == null || this.startDate > event.target.value) {
            this.startDate = this.endDate;
        }
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


    @wire( getListEvents )  
    wiredEvents( value ) {
        const { data, error } = value;
        if ( data ) {
            let tempEvntList = []; 
            data.forEach((record) => {
                let tempEvnRec = Object.assign({}, record);  
                tempEvnRec.EvntName = '/' + tempEvnRec.Id;
                tempEvnRec.PremisesName =  tempEvnRec.Premises__r.Name;
                tempEvntList.push(tempEvnRec);
            });
            this.records = tempEvntList;
        } else if ( error ) {
            this.error = error;
            this.records = undefined;
        }
    }

    refresh() {
        getListEvents()
        .then(result => {
            this.records = result;
        })

    }
    
    async handleSuccess(event) {

        // const payload = event.detail;
        // let createdEvent = JSON.parse(JSON.stringify(payload));  
        // let nameRec = createdEvent.fields.Name.value;
        // console.log(typeof nameRec);

        // await getInsertedRecord({ nameNewEvent : nameRec })
        //     .then((result) => {
        //         console.log('result: ', result);
        //         this.insertedRecord = result;
        //         this.error = undefined;
        //     })
        //     .catch((error) => {
        //         console.log('error: ', error);
        //         this.error = error;
        //         this.insertedRecord = undefined;
        //     });

        //     this.records.push(this.insertedRecord);
        //     console.log("records: " , this.records);
                        
        this.dispatchEvent(new ShowToastEvent({
                title: "SUCCESS!",
                message: "New record has been created.",
                variant: "success",
        }));    
        this.handleModalChange();
    }

    handleModalChange() {
        this.isModalOpen = !this.isModalOpen;
        this.endDate = null;
        this.startDate = null;
    }

    handleEventFire() {

        this.handleModalChange();
    }
}