package com.card.demo.service;

import java.util.List;

import com.card.demo.domain.DataInterface;
import com.card.demo.domain.ModelMenu;
import com.card.demo.domain.ModelPage;
import com.card.demo.domain.ModelProject;

public interface IcardService {
	public List<ModelMenu> getHome();

	public List<ModelMenu> ModelMenuList(ModelMenu modelMenu);
	public List<ModelMenu> ModelMenuListByField(ModelMenu modelMenu);
	public List<ModelMenu> ModelMenuListByTag(String tags,String pid);

	public int insertModelMenu(ModelMenu modelMenu);

	public int updateModelMenu(ModelMenu modelMenu);

	public int deleteModelMenuById(String id);

	public List<ModelPage> ModelPageList(ModelPage modelMenu);

	public int insertModelPage(ModelPage modelMenu);

	public int updateModelPage(ModelPage modelMenu);

	public int deleteModelPageById(String id);
	
	public List<ModelProject> ModelProjectList(ModelProject modelMenu);

	public int insertModelProject(ModelProject modelMenu);

	public int updateModelProject(ModelProject modelMenu);

	public int deleteModelProjectById(String id);
	
	public List<DataInterface> DataInterfaceListByName(String name);
	
}
