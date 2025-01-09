package companyPackages;

public class PackageFactory {
    public static TicketPackage getPackage(PackageType packageType) {
        if (packageType == null) {
            return null;
        }
        switch (packageType) {
            case BASIC:
                return new BasicPackage();
            case STANDARD:
                return new StandardPackage();
            case ADVANCED:
                return new AdvancedPackage();
            case PREMIUM:
                return new PremiumPackage();
            default:
                return null;
        }
    }
}
