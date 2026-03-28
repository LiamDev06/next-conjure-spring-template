plugins {
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    id("java")
    id("io.freefair.lombok") version "9.2.0"
    id("com.diffplug.spotless") version "8.4.0"
    checkstyle
    pmd
}

spotless {
    java {
        palantirJavaFormat("2.90.0")
        removeUnusedImports()
        trimTrailingWhitespace()
        endWithNewline()
    }
}

checkstyle {
    toolVersion = "13.3.0"
    configFile = rootProject.file("config/checkstyle/checkstyle.xml")
}

pmd {
    toolVersion = "7.23.0"
    isConsoleOutput = true
    ruleSetFiles = files(rootProject.file("config/pmd/pmd-ruleset.xml"))
    ruleSets = emptyList()
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.register("lint") {
    dependsOn("spotlessCheck", "checkstyleMain", "pmdMain")
}

dependencies {
    compileOnly("org.checkerframework:checker-qual:3.54.0")
    implementation(project(":template-api:template-api-jersey"))
    implementation(project(":template-api:template-api-objects"))

    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-jersey")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.flywaydb:flyway-database-postgresql")

    runtimeOnly("org.postgresql:postgresql")

    implementation("me.paulschwarz:springboot4-dotenv:5.1.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testRuntimeOnly("com.h2database:h2")
}
