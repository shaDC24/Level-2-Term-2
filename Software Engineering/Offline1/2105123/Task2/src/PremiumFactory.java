import AccountPackage.Account;
import AccountPackage.PremiumAccount;
import LoanPackage.Loan;
import LoanPackage.PremiumLoan;

public class PremiumFactory extends BankAbstractFactory {

    @Override
    public Account createAccount() {
        return new PremiumAccount();
    }

    @Override
    public Loan createLoan() {
        return new PremiumLoan();
    }

}
