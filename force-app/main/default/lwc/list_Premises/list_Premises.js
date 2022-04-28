import { LightningElement, wire, track } from 'lwc';
import getListPremises from '@salesforce/apex/PremiseseController.getListPremises';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'City', fieldName: 'City__c' },
];

export default class List_Premises extends LightningElement {
    error;
    columns = columns;

    @wire(getListPremises)
    premises;
}