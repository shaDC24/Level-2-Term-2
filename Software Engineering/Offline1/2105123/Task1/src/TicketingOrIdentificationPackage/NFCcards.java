package TicketingOrIdentificationPackage;

public class NFCcards implements TicketingOrIdentification {
    @Override
    public void hasIdentificationAdded() {
        System.out.println(
                "NFC card Identification has added from NFC cards class of TicketingOrIdentification interface.");
    }
}