package com.example.gatway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
public class GatwayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatwayApplication.class, args);
	}
	@Bean
	public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
		return builder.routes()
				.route("EVENT-MANAGEMENT", r -> r.path("/events/**")
						.uri("lb://EVENT-MANAGEMENT"))
<<<<<<< HEAD

=======
				.route("FEEDBACK-SERVICE", r -> r.path("/feedback/**")
						.uri("lb://FEEDBACK-SERVICE"))
>>>>>>> 9ac2a4a07a55e67de20ff61660bdb8e0ada13e6b
				.build();
	}
}
