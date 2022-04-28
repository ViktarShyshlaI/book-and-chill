import { LightningElement, api, wire } from 'lwc';
import getListEvents from '@salesforce/apex/EventController.getListEvents';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Premise', fieldName: 'PremisesName', type: 'url' },
    { label: 'Start', fieldName: 'StartDateTime__c' },
    { label: 'End', fieldName: 'EndDateTime__c' },
];

export default class ListEvents extends LightningElement {
    isModalOpen = false;
    records;
    wiredRecords;
    error;
    columns = columns;
    draftValues = [];

    @wire( getListEvents )  
    wiredAccount( value ) {

        this.wiredRecords = value;
        const { data, error } = value;

        if ( data ) {
            
            let tempRecords = JSON.parse( JSON.stringify( data ) );
            tempRecords = tempRecords.map( row => {
                return { ...row, PremisesName: row.Premises__r.Name};
            })
            this.records = tempRecords;
            this.error = undefined;
            console.log(tempRecords.map( row => {
                return { ...row, PremisesName: row.Premises__r}}));

        } else if ( error ) {

            this.error = error;
            this.records = undefined;

        }

    }


    handleModalChange() {
        this.isModalOpen = !this.isModalOpen;
    }

    handleEventFire() {
        this.handleModalChange();
    }
}