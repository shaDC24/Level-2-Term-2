import java.util.Arrays;
import java.util.List;

import BuilderPatternPackage.IBuilder;
import BuilderPatternPackage.SystemProduct;
import BuilderPatternPackage.SystemProductBuilder;
import BuilderPatternPackage.SystemProductDirector;
import InternetConnectionPackage.InternetConnectionType;
import WebServerPackage.WebFrameworkType;
import companyPackages.PackageType;

public class Main {

        public static void main(String[] args) {
                System.out.println("***Welcome To Ticketing Management System***");

                PackageType selectedPackage = InputUtils.selectOption(
                                Arrays.asList(PackageType.values()), "Available Packages:");
                SystemProductDirector systemProductDirector = new SystemProductDirector();
                IBuilder systemProductBuilder = new SystemProductBuilder();


               List<InternetConnectionType>internetOptions;
                if (selectedPackage == PackageType.BASIC || selectedPackage == PackageType.STANDARD) {
                        internetOptions = Arrays.asList(InternetConnectionType.WIFI, InternetConnectionType.GSM_MODULE);
                    } else {
                        internetOptions = Arrays.asList(InternetConnectionType.WIFI, InternetConnectionType.GSM_MODULE,
                                InternetConnectionType.ETHERNET);
                    }
            
                    InternetConnectionType selectedInternet = InputUtils.selectOption(internetOptions,
                            "Available Internet Connections:");



               /*InternetConnectionType selectedInternet = InputUtils.selectOption(
                                Arrays.asList(InternetConnectionType.values()),
                                "Available Internet Connections:");*/


                WebFrameworkType selectedWebFrame = InputUtils.selectOption(
                                Arrays.asList(WebFrameworkType.values()), "Available Web Frameworks:");

                System.out.println("You have selected the " + selectedPackage + " package.");
                System.out.println("You have selected the " + selectedInternet + " internet connection.");
                System.out.println("You have selected the " + selectedWebFrame + " web framework.");
                System.out.println();
                System.out.println("...........................Your System is About to build.....................");
                System.out.println();

                systemProductDirector.constructSystem(systemProductBuilder, selectedPackage,
                                selectedInternet,
                                selectedWebFrame);
                SystemProduct systemProduct = systemProductBuilder.buildSystemProduct();
                System.out.println();
                System.out.println("...................................................Your System has built...........................................................");
                System.out.println();
                System.out.println(systemProduct);
        }
}
