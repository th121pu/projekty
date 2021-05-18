plugins {
    java
    application
    pmd
}

group = "sk.tuke.kpi.oop"
version = "1.0"

val gamelibVersion = "2.5.1"

repositories {
    mavenCentral()
    maven(url=uri("https://repo.kpi.fei.tuke.sk/repository/maven-public"))
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
}

application {
    mainClassName = "sk.tuke.kpi.oop.game.Main"
}

dependencies {
    implementation("sk.tuke.kpi.gamelib:gamelib-framework:$gamelibVersion")
}

tasks {
    withType<JavaCompile> {
        options.compilerArgs.addAll(listOf("-parameters", "-Xlint:unchecked,rawtypes", "-Werror"))
    }
}

configure<PmdExtension> {
    toolVersion = "6.18.0"
    isConsoleOutput = true
    ruleSets = emptyList()
    ruleSetFiles = files("src/main/resources/pmd-ruleset.xml")
}
