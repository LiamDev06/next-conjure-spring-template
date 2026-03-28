pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }

    plugins {
        id("org.springframework.boot") version "4.0.5"
        id("io.spring.dependency-management") version "1.1.7"
    }
}

rootProject.name = "template"

include("template-server")
include("template-api")
include("template-api:template-api-typescript")
include("template-api:template-api-objects")
include("template-api:template-api-jersey")
