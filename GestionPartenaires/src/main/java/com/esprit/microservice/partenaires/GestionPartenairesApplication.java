package com.esprit.microservice.partenaires;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        exclude = {
                org.springframework.boot.actuate.autoconfigure.metrics.SystemMetricsAutoConfiguration.class,
                org.springframework.boot.actuate.autoconfigure.metrics.JvmMetricsAutoConfiguration.class
        }
)public class GestionPartenairesApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPartenairesApplication.class, args);
    }

}
