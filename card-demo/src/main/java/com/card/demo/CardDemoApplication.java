package com.card.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@MapperScan("com.card.demo.mapper")
public class CardDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CardDemoApplication.class, args);
		System.out.println("启动成功");
	}

}
