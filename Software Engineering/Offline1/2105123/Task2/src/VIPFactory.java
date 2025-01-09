import AccountPackage.Account;
import AccountPackage.VIPAccount;
import LoanPackage.Loan;
import LoanPackage.VIPLoan;

public class VIPFactory extends BankAbstractFactory {

    @Override
    public Account createAccount() {
     return new VIPAccount();
    }

    @Override
    public Loan createLoan() {
        return new VIPLoan();
    }
    
}
