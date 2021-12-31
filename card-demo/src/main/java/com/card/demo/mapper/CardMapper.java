package com.card.demo.mapper;

import java.util.List;
import java.util.Map;

import com.card.demo.domain.DataInterface;
import com.card.demo.domain.ModelMenu;
import com.card.demo.domain.ModelPage;
import com.card.demo.domain.ModelPageCard;
import com.card.demo.domain.ModelProject;
import com.card.demo.domain.PageCard;



public interface CardMapper {
	
	public List<ModelMenu> getModelMenuList();
	
	public List<ModelMenu> getModelMenuList(ModelMenu modelMenu);
	
	public List<ModelMenu> getModelMenuListByField(ModelMenu modelMenu);
	
	public List<ModelMenu> getModelMenuListByTag(Map<String,Object> map);
	
	public int insertModelMenu(ModelMenu modelMenu);
	
	public int updateModelMenu(ModelMenu modelMenu);
	
	public int deleteModelMenuById(String id);
	
	public List<ModelPage> getModelPageList(ModelPage modelMenu);

	public int insertModelPage(ModelPage modelMenu);

	public int updateModelPage(ModelPage modelMenu);
	
	public int updatePageByProjectId(ModelPage modelMenu);

	public int deleteModelPageById(String id);
	
	
	public List<ModelProject> getModelProjectList(ModelProject modelMenu);

	public int insertModelProject(ModelProject modelMenu);

	public int updateModelProject(ModelProject modelMenu);

	public int deleteModelProjectById(String id);
	
	public List<DataInterface> DataInterfaceListByName(String name);
	
	public int insertModelPageCard(ModelPageCard modelPageCard);
	
	public int updateModelPageCard(ModelPageCard modelPageCard);
	
	public List<PageCard> getModelPageCardList(String id);
	
	public int deleteModelPageCardByPageId(String id);
	
	
	
}
