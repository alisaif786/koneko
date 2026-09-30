package com.koneko.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KonekoBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(KonekoBackendApplication.class, args);
	}

}