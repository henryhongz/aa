package com.card.demo.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.card.demo.domain.DataInterface;
import com.card.demo.domain.ModelMenu;
import com.card.demo.domain.ModelPage;
import com.card.demo.domain.ModelPageCard;
import com.card.demo.domain.ModelProject;
import com.card.demo.domain.PageCard;
import com.card.demo.mapper.CardMapper;
import com.card.demo.service.IcardService;



@Service
public class IcardServiceImpl implements IcardService{
	private static final Logger log = LoggerFactory.getLogger(IcardServiceImpl.class);
	@Autowired
	CardMapper outMapper;

	@Override
	public List<ModelMenu> getHome() {
		log.info("查询开始");
		List<ModelMenu> mList = outMapper.getModelMenuList();
		log.info("查询结束");
		return mList;
	}

	@Override
	public int insertModelMenu(ModelMenu modelMenu) {
		log.info("添加卡片");
		modelMenu.setCreateTime(new Date());
		int i = outMapper.insertModelMenu(modelMenu);
		int id = Integer.parseInt(modelMenu.getId());
		return id;
	}

	@Override
	public int updateModelMenu(ModelMenu modelMenu) {
		log.info("修改卡片");
		return outMapper.updateModelMenu(modelMenu);
	}

	@Override
	public int deleteModelMenuById(String id) {
		log.info("删除卡片");
		return outMapper.deleteModelMenuById(id);
	}

	@Override
	public List<ModelMenu> ModelMenuList(ModelMenu modelMenu) {
		List<ModelMenu> mList = outMapper.getModelMenuList(modelMenu);
		log.info("查询结束");
		return mList;
	}

	@Override
	public List<ModelPage> ModelPageList(ModelPage modelMenu) {
		List<ModelPage> mList = outMapper.getModelPageList(modelMenu);
		for(ModelPage page : mList) {
			List<PageCard> pc = outMapper.getModelPageCardList(page.getId());
			String text = JSONArray.toJSONString(pc);
			page.setPageText(text);
		}
		log.info("查询结束");
		return mList;
	}

	@Override
	public int insertModelPage(ModelPage modelMenu) {
		log.info("添加页面");
		modelMenu.setCreateTime(new Date());
		int i = outMapper.insertModelPage(modelMenu);
		int id = Integer.parseInt(modelMenu.getId());
		String text = modelMenu.getPageText();
		if(text!=null && !"".equals(text)) {
			JSONArray array = JSONArray.parseArray(text);
			for(int a=0;a<array.size();a++) {
				JSONObject json = array.getJSONObject(a);
				ModelPageCard pageCard = new ModelPageCard();
				pageCard.setPageId(id);
				pageCard.setCardId(json.getIntValue("i"));
				pageCard.setLocalX(json.getIntValue("x"));
				pageCard.setLocalY(json.getIntValue("y"));
				outMapper.insertModelPageCard(pageCard);
			}
		}
		return id;
	}

	@Override
	public int updateModelPage(ModelPage modelMenu) {
		log.info("修改页面");
		String text = modelMenu.getPageText();
		if(text!=null && !"".equals(text)) {
			JSONArray array = JSONArray.parseArray(text);
			outMapper.deleteModelPageCardByPageId(modelMenu.getId());
			for(int a=0;a<array.size();a++) {
				JSONObject json = array.getJSONObject(a);
				ModelPageCard pageCard = new ModelPageCard();
				pageCard.setPageId(Integer.parseInt(modelMenu.getId()));
				pageCard.setCardId(json.getIntValue("i"));
				pageCard.setLocalX(json.getIntValue("x"));
				pageCard.setLocalY(json.getIntValue("y"));
				outMapper.insertModelPageCard(pageCard);
			}
		}
		Integer index = modelMenu.getIsIndex();
		if(index !=null && index==1) {
			ModelPage page = new ModelPage();
			page.setProjectId(modelMenu.getProjectId());
			page.setIsIndex(0);
			outMapper.updatePageByProjectId(page);
		}
		return outMapper.updateModelPage(modelMenu);
	}

	@Override
	public int deleteModelPageById(String id) {
		log.info("删除页面");
		return outMapper.deleteModelPageById(id);
	}

	@Override
	public List<ModelMenu> ModelMenuListByTag(String tags,String pid) {
		String[] str = tags.split(",");	
		Map<String,Object> map = new HashMap<String, Object>();
		String taginfo = "";
		if(str.length>0) {
			taginfo = " and m.tag like '%"+str[0]+"%' ";
		}
		for(int i=1;i<str.length;i++) {
			taginfo = taginfo+" and m.tag like '%"+str[i]+"%' ";
		}
		map.put("projectId", pid);
		map.put("tags", taginfo);
		List<ModelMenu> mList = outMapper.getModelMenuListByTag(map);
		log.info("查询结束");
		return mList;
	}
	
	@Override
	public List<ModelProject> ModelProjectList(ModelProject modelMenu) {
		List<ModelProject> mList = outMapper.getModelProjectList(modelMenu);
		for(ModelProject project : mList) {
    		ModelPage modelPage = new ModelPage();
    		modelPage.setProjectId(project.getId()+"");
    		List<ModelPage> pageList = ModelPageList(modelPage);   		
    		project.setPageList(pageList);
    	}
		log.info("查询结束");
		return mList;
	}

	@Override
	public int insertModelProject(ModelProject modelMenu) {
		log.info("添加项目");
		modelMenu.setCreateTime(new Date());
		int i = outMapper.insertModelProject(modelMenu);
		int id = modelMenu.getId();
		return id;
	}

	@Override
	public int updateModelProject(ModelProject modelMenu) {
		log.info("修改项目");
		return outMapper.updateModelProject(modelMenu);
	}

	@Override
	public int deleteModelProjectById(String id) {
		log.info("删除项目");
		return outMapper.deleteModelProjectById(id);
	}

	@Override
	public List<DataInterface> DataInterfaceListByName(String name) {
		return outMapper.DataInterfaceListByName(name);
	}

	@Override
	public List<ModelMenu> ModelMenuListByField(ModelMenu modelMenu) {
		List<ModelMenu> mList = outMapper.getModelMenuListByField(modelMenu);
		log.info("查询结束");
		return mList;
	}

	
    
}
