package org.course.microservice_course_aziz;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication(
//        exclude = {
//                org.springframework.boot.actuate.autoconfigure.metrics.SystemMetricsAutoConfiguration.class,
//                org.springframework.boot.actuate.autoconfigure.metrics.JvmMetricsAutoConfiguration.class
//        }
)

public class MicroServiceCourseAzizApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCourseAzizApplication.class, args);
    }

}
