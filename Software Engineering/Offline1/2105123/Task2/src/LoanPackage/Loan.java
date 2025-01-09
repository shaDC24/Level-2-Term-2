package LoanPackage;

public abstract class Loan {
    protected double interestRate;

    public abstract void getInterestRate();

    public void calculateLoanPayment(double loanAmount, int years) {
        getInterestRate();
        double EMI;
        int n;
        n = years * 12;
        System.out.println("Interest rate is : " + interestRate);
        interestRate = interestRate / 1200.0;
        EMI = ((interestRate * Math.pow(1 + interestRate, n)) / ((Math.pow(1 + interestRate, n)) - 1)) * loanAmount;
        System.out.println("Your monthly EMI is " + EMI + " for interest rate " + interestRate + " for the amount "
                + loanAmount + " you have received.");
    }

}
