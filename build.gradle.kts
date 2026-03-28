plugins {
    id("com.palantir.versions-props") version "3.15.0"
}

allprojects {
    group = "com.template"
    version = "0.0.1"

    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

tasks.register("lint") {
    dependsOn(":template-server:lint")
}

subprojects {
    plugins.withType<JavaPlugin> {
        the<JavaPluginExtension>().toolchain.languageVersion.set(JavaLanguageVersion.of(21))
    }
}
