package LoanPackage;

public class VIPLoan extends Loan {

    @Override
    public void getInterestRate() {
        interestRate = 10.0;
    }
}
