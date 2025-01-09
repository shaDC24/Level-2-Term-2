package WebServerPackage;

public class WebServerFactory {
    public static WebServer getWebServer(WebFrameworkType webServerType) {
        if (webServerType == null) {
            return null;
        }
        switch (webServerType) {
            case DJANGO:
                return new Django();
            case NODEJS:
                return new NodeJs();
            case RUBY:
                return new Ruby();
            default:
                return null;
        }
    }
}
