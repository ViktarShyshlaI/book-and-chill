import { LightningElement, track } from 'lwc';
import getListEvents from '@salesforce/apex/EventController.getListEvents';

import EVENT_OBJECT from '@salesforce/schema/Event__c';
import NAME_FIELD from '@salesforce/schema/Event__c.Name';
import TYPE_FIELD from '@salesforce/schema/Event__c.Type__c';
import PREMISELOOKUP_FIELD from '@salesforce/schema/Event__c.Premises__c';
import STARTTIME_FIELD from '@salesforce/schema/Event__c.StartDateTime__c';
import ENDTIME_FIELD from '@salesforce/schema/Event__c.EndDateTime__c';

const columns = [
    {   
        label: 'Name',
        fieldName: 'Name',
    },
    { 
        label: 'Premise', 
        fieldName: 'PremiseInfo' 
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

export default class ListEventsGuestUsers extends LightningElement {
    isData = false;
    @track records;
    columns = columns;
    error;
    
    objectApiName = EVENT_OBJECT;
    fields = [NAME_FIELD, TYPE_FIELD, PREMISELOOKUP_FIELD, STARTTIME_FIELD, ENDTIME_FIELD];

    connectedCallback() {
        this.getEvents();
    }
    
            
    getEvents() {
        getListEvents()
        .then(result => {
            console.log("result:", result);
            let tempEvntList = []; 
            result.forEach((record) => {
                let tempEvnRec = Object.assign({}, record);  
                // tempEvnRec.EventName = '/' + tempEvnRec.Id;
                tempEvnRec.PremiseInfo = tempEvnRec.Id;
                if (!tempEvnRec.Premises__c || tempEvnRec.Premises__c.length === 0 ) {
                    tempEvnRec.PremiseInfo = "";    
                }
                else {
                    
                    let country = tempEvnRec.Premises__r.Country__c ? tempEvnRec.Premises__r.Country__c : "";
                    let city = tempEvnRec.Premises__r.City__c ? ", " + tempEvnRec.Premises__r.City__c : "";
                    let street = tempEvnRec.Premises__r.Street__c ? ", " + tempEvnRec.Premises__r.Street__c : "";
                    let premisInfo = country + city + street;
                    tempEvnRec.PremiseInfo = tempEvnRec.Premises__r.Name + ' (' + premisInfo + ')';
                }
                
                console.log("tempEvnRec.PremiseInfo: ", tempEvnRec.PremiseInfo);
                if (tempEvnRec.PremiseInfo.includes("undefined")) {
                    console.log("tempEvnRec.PremiseInfo.City: ", tempEvnRec.PremiseInfo.City__c);
                    tempEvnRec.PremiseInfo.replace("undefined", "")
                }

                tempEvntList.push(tempEvnRec);
            });
            this.records = tempEvntList;
            if (this.records.length !== 0) {
                this.isData = true;
            }
        })
        .catch(error => {
            console.error("error calling apex controller:",error);
        });
    }
}