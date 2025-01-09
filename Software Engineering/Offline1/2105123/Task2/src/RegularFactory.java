import AccountPackage.Account;
import AccountPackage.RegularAccount;
import LoanPackage.Loan;
import LoanPackage.RegularLoan;

public class RegularFactory extends BankAbstractFactory {

    @Override
    public Account createAccount() {
        return new RegularAccount();
    }

    @Override
    public Loan createLoan() {
        return new RegularLoan();
    }
    
}
