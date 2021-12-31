package com.card.demo.domain;

import java.util.Date;
import java.util.List;

public class ModelProject {
	int id;
	String projectName;
	Date createTime;
	List<ModelPage> pageList;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public List<ModelPage> getPageList() {
		return pageList;
	}
	public void setPageList(List<ModelPage> pageList) {
		this.pageList = pageList;
	}

	
	
}
