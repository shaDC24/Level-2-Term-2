package StoragePackage;

public class SDcard implements Storage {
    @Override
    public void hasStorageAdded() {
        System.out.println("The SD card is added to the system from SDcard class of Storage Interface.");
    }
}
