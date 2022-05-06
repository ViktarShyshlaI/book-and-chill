import { LightningElement, wire, track } from 'lwc';
import getListPremises from '@salesforce/apex/PremiseseController.getListPremises';

const columns = [
    { label: 'Name', fieldName: 'PremisName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'} },
    { label: 'City', fieldName: 'City__c' },
];

export default class ListPremises extends LightningElement {
    error;
    columns = columns;
    premisData = [];

    @wire(getListPremises)
    premises({ error, data }) {

        if (data) {
            let tempConList = []; 
            
            data.forEach((record) => {
                let tempConRec = Object.assign({}, record);  
                tempConRec.PremisName = '/' + tempConRec.Id;
                tempConList.push(tempConRec);
                
            });
            
            this.premisData = tempConList;
            this.error = undefined;
            
        } else if (error) {
            this.error = result.error;
        }
    }
}