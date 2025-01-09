import AccountPackage.Account;
import LoanPackage.Loan;

abstract class BankAbstractFactory {
    abstract Account createAccount();

    abstract Loan createLoan();
}
