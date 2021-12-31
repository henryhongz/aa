package com.card.demo.controller;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
@RequestMapping("/boot")
public class HelloController {

	@RequestMapping("/hello")
	public String hello() {
		return "hello";
	}
}
