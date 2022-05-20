public with sharing class UpdateTypeAccountsController
{
    public Boolean mainBoxValue {get; set;}
    public List<AccountWrapper> listAccountWrapper {get; set;}

    public UpdateTypeAccountsController()
    {
        listAccountWrapper = new List<AccountWrapper>();
        List<Account> accounts = getAccounts();
        for (Account acc : accounts)
        {
            listAccountWrapper.add(new AccountWrapper(false, acc));
        }
    }
    
    public void toggleIsSelects()
    {
        for (AccountWrapper wrapObj : listAccountWrapper)
        {
            wrapObj.isSelect = mainBoxValue;
        }
    }
    
    public void updateAccounts() 
    {
        Map<Boolean, List<Account>> mapSelectedAccounts = getSelectedAccounts();
        Boolean hasError = new List<Boolean> (mapSelectedAccounts.keySet()) [0];
        List<Account> selectedAccounts = mapSelectedAccounts.get(hasError);   
        if (!hasError && selectedAccounts.size() > 0) 
        {   
            for (Account acc : selectedAccounts)
            {
                acc.Type = Constants.ACCOUNT_TYPE_DEPRECATED;
            }
            update selectedAccounts;
            reRenderAccounts(selectedAccounts);
            ApexPages.addMessage(new ApexPages.message(ApexPages.severity.CONFIRM, 'Records updated successfully'));
        }
        else
        {
            ApexPages.addMessage(new ApexPages.message(ApexPages.severity.ERROR, 'Please choose non test/deprecated account(s) OR records were not selected'));
        }
    } 

    private Map<Boolean, List<Account>> getSelectedAccounts() {
        List<Account> selectedAccounts = new List<Account>();
        Boolean hasError = false;
        for (AccountWrapper wrapObj : listAccountWrapper)
        {
            if (wrapObj.isSelect == true)
            {
                if (wrapObj.account.Test_Record__c == false && wrapObj.account.Type != Constants.ACCOUNT_TYPE_DEPRECATED) 
                {
                    selectedAccounts.add(wrapObj.account);
                }
                else 
                {
                    hasError = true;
                    break;
                }
            }
        }
        Map<Boolean, List<Account>> mapAccounts = new Map<Boolean, List<Account>>();
        mapAccounts.put(hasError, selectedAccounts);
        return mapAccounts;
    }

    private void reRenderAccounts(List<Account> selectedAccounts)
    {
        for (AccountWrapper wrapObj : listAccountWrapper)
        {
            for (Account acc : selectedAccounts)
            {
                if (acc.Id == wrapObj.account.Id)
                {
                    wrapObj.isSelect = false;
                    wrapObj.account.Type = Constants.ACCOUNT_TYPE_DEPRECATED;
                }
            }
        }
    }

    private List<Account> getAccounts()
    {
        List<Account> accounts = [SELECT Name, Type, Test_Record__c FROM Account];
        return accounts;
    }

    public class AccountWrapper
    {
        public Boolean isSelect {get; set;}
        public Account account {get; set;}
        
        public AccountWrapper(Boolean isSelect, Account account)
        {
            this.isSelect = isSelect;
            this.account = account;
        }
    }
}