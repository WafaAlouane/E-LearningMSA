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
				.route("FEEDBACK-SERVICE", r -> r.path("/feedback/**")
						.uri("lb://FEEDBACK-SERVICE"))
				.build();
	}
}
