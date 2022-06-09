import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getListEvents from '@salesforce/apex/EventController.getListEvents';
import getUserInfo from '@salesforce/apex/UserController.getUserInfo';
import getListMessages from '@salesforce/apex/MessageInfoController.getListMessages';
import getInsertedRecord from '@salesforce/apex/EventController.getInsertedRecord';
import { refreshApex } from '@salesforce/apex';

import EVENT_OBJECT from '@salesforce/schema/Event__c';
import NAME_FIELD from '@salesforce/schema/Event__c.Name';
import TYPE_FIELD from '@salesforce/schema/Event__c.Type__c';
import PREMISELOOKUP_FIELD from '@salesforce/schema/Event__c.Premises__c';
import STARTTIME_FIELD from '@salesforce/schema/Event__c.StartDateTime__c';
import ENDTIME_FIELD from '@salesforce/schema/Event__c.EndDateTime__c';
import CONFIRMEVENT_FIELD from '@salesforce/schema/Event__c.ConfirmEvent__c';

const columns = [
    {   
        label: 'Name',
        fieldName: 'EventName',
        type: 'url', // have to change "FiledType" - couse gouse user have a non works link
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
            minute: "2-digit",
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
            minute: "2-digit",
        }
    },
];

export default class ListEvents extends LightningElement {
    @track isUsersAccess = false;
    isModalOpen = false;
    // isData = false;
    // @track records;
    // columns = columns;
    insertedRecord;
    error;
    events;
    messages;
    numMessage = 0;

    data = [];
    isData = false;

    startDate = null;
    endDate = null;
    
    objectApiName = EVENT_OBJECT;
    fields = [NAME_FIELD, TYPE_FIELD, PREMISELOOKUP_FIELD, STARTTIME_FIELD, ENDTIME_FIELD, CONFIRMEVENT_FIELD];
    
    connectedCallback() {
        this.checkUser();
        // this.getEvents();         // move to checkUser() for async correct procces
    }
    
    get typeMessage() {
        console.log(this.messages[this.numMessage].Type__c);
        return this.messages[this.numMessage].Type__c;
    }

    get textMessage() {
        let ms = this.messages[this.numMessage].Message__c;
        this.numMessage ++;
        return ms;
    }

    
    async checkUser() {
        try {
            const result = await getUserInfo();
            let profileName = result.Profile.Name; 
            if (profileName == "System Administrator"  || 
               profileName == "Facilities Accountant" ||
               profileName == "Event Organizer") {    
                this.isUsersAccess = true;
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            this.makeData();
        }
    }
    
    async makeData() {        
        const events = await getListEvents();
        this.getEvents(events);

        const messages = await getListMessages();
        this.getMessages(messages);

        this.createRecord(this.events, true, false);
        this.createRecord(this.messages, false, true);

        this.sortData();
        this.isData = true;
    }

    
    sortData() {
        // console.log("BEFORE, this.data: ", this.data);   
        // this.data.sort(function(a, b){return a.StartDateTime__c - b.StartDateTime__c});
        // console.log("AFTER, this.data: ", this.data);   
        // this.isData.sort((d1, d2) => new Date(d1.StartDateTime__c).getTime() - new Date(d2.StartDateTime__c).getTime());
        // console.log("typeof !!!!  this.data: ", typeof this.data);   
    }
    

    createRecord(data, isEvent, isMessage) {
        if (!data) {
           return;
        }
        for (let i = 0; i < data.length; i++) {
            let Id = data[i].Id ? data[i].Id : " ";
            let Name = data[i].Name ? data[i].Name : " ";
            let PremisesName = data[i].Premises__r ? data[i].Premises__r.Name : " ";
            let StartDateTime__c = data[i].StartDateTime__c ? data[i].StartDateTime__c : " ";
            let EndDateTime__c = data[i].EndDateTime__c ? data[i].EndDateTime__c : " ";

            const item = {
                IsEvent : isEvent,
                IsMessage : isMessage,
                Id : Id,
                Name : Name,
                PremisesName : PremisesName,
                StartDateTime__c : StartDateTime__c,
                EndDateTime__c : EndDateTime__c
            }
            this.data.push(item);
        }
    }

    getMessages(data) {
        try {
            const options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            };
            for ( let i = 0; i < data.length; i++ ) {  
                let dataParse = data[ i ];
                if ( dataParse.StartDateTime__c ) {
                    let dt = new Date( dataParse.StartDateTime__c );
                    dataParse.StartDateTime__c = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
                }
            }
            this.messages = data;
            this.error = undefined;
        } 
        catch (error) { 
            console.error("error calling apex controller:",error);
        }
    }

    getEvents(data) {
        try {
            const options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            };
            for ( let i = 0; i < data.length; i++ ) {  
                let dataParse = data[ i ];
                if ( dataParse.StartDateTime__c ) {
                    let dt = new Date( dataParse.StartDateTime__c );
                    dataParse.StartDateTime__c = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
                }
                if ( dataParse.EndDateTime__c ) {
                    let dt = new Date( dataParse.EndDateTime__c );
                    dataParse.EndDateTime__c = new Intl.DateTimeFormat( 'en-US', options ).format( dt );
                }
            }
            this.events = data;
            this.error = undefined;
        }  
        catch (error) {
            console.error("error calling apex controller:",error);
        };


        // getListEvents()
        // .then(result => {
        //     let tempEvntList = []; 
        //     result.forEach((record) => {
        //         let tempEvnRec = Object.assign({}, record);  
        //         tempEvnRec.EventName = '/' + tempEvnRec.Id;
        //         if (!tempEvnRec.Premises__c || tempEvnRec.Premises__c.length === 0 ) {
        //             tempEvnRec.PremisesName = "";    
        //         }
        //         else {
        //             tempEvnRec.PremisesName = tempEvnRec.Premises__r.Name;
        //         }
        //         // if (this.isUsersAccess) {
        //         //     tempEvnRec.FiledType = "url";
        //         //     tempEvnRec.EventName = '/' + tempEvnRec.Id;
        //         //     console.log(tempEvnRec);
        //         // }
        //         // else {
        //         //     tempEvnRec.EventName = tempEvnRec.Name;
        //         //     tempEvnRec.FiledType = "String";
        //         // }

        //         tempEvntList.push(tempEvnRec);
        //     });
        //     this.records = tempEvntList;
        //     if (this.records.length !== 0) {
        //         this.isData = true;
        //     }
        // })
        // .catch(error => {
        //     console.error("error calling apex controller:",error);
        // });
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
}