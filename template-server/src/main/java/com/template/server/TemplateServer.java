package com.template.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Cannot be final: Spring Boot requires CGLIB subclassing via @SpringBootApplication
@SuppressWarnings("PMD.ClassWithOnlyPrivateConstructorsShouldBeFinal")
public class TemplateServer {

    private TemplateServer() {}

    public static void main(final String[] args) {
        SpringApplication.run(TemplateServer.class, args);
    }
}
