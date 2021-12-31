package com.card.demo.domain;

import java.util.Date;

public class ModelPage {

	private String id;
	private String title;
	private String pageText;
	private Date createTime;
	private String background;
	private String image;
	private String projectId;
	private String backgroundImage;
	private Integer isIndex;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getPageText() {
		return pageText;
	}
	public void setPageText(String pageText) {
		this.pageText = pageText;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getBackground() {
		return background;
	}
	public void setBackground(String background) {
		this.background = background;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getBackgroundImage() {
		return backgroundImage;
	}
	public void setBackgroundImage(String backgroundImage) {
		this.backgroundImage = backgroundImage;
	}
	public Integer getIsIndex() {
		return isIndex;
	}
	public void setIsIndex(Integer isIndex) {
		this.isIndex = isIndex;
	}
	
	
}
