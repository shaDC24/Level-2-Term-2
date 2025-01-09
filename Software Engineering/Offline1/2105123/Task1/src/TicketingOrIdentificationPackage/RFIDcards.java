package TicketingOrIdentificationPackage;

public class RFIDcards implements TicketingOrIdentification {
    @Override
    public void hasIdentificationAdded() {
        System.out.println(
                "RFID card Identification has added from RFID cards class of TicketingOrIdentification interface.");
    }
}
