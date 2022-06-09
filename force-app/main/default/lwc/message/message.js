import { LightningElement, api, track } from 'lwc';
import getUserInfo from '@salesforce/apex/UserController.getUserInfo';
import Salesforce_Images from '@salesforce/resourceUrl/messageStyle';

export default class Message extends LightningElement {
    @api textMessage;
    @api typeMessage;
}