package com.card.demo.controller;



import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.card.demo.domain.AjaxResult;

import com.card.demo.domain.ModelMenu;
import com.card.demo.domain.ModelPage;
import com.card.demo.domain.ModelProject;
import com.card.demo.service.IcardService;

import net.coobird.thumbnailator.Thumbnails;




/**
 * 首页数据
 *
 * @author ctimer
 * @date 2021-06-12
 */
@RestController
@RequestMapping("/home")
public class CardController {
	

    @Autowired
    private IcardService ioutService;

    /**
     * 显示所有卡片列表
     * @return
     */
    @GetMapping(value = "/index")
    public AjaxResult getHome()
    {return AjaxResult.success(ioutService.getHome());}

    /**
     * 根据type和title获取卡片
     * @param modelMenu
     * @return
     */
    @GetMapping(value = "/getList")
    public AjaxResult getModelMenuList(ModelMenu modelMenu) {
    	return AjaxResult.success(ioutService.ModelMenuList(modelMenu));
    }
    
    /**
     * 获取卡片
     * @param modelMenu
     * @return
     */
    @GetMapping(value = "/getListByField")
    public AjaxResult getModelMenuListByField(ModelMenu modelMenu) {
    	return AjaxResult.success(ioutService.ModelMenuListByField(modelMenu));
    }

    @CrossOrigin
    @GetMapping(value = "/getListByTag")
    public AjaxResult getModelMenuListByTag(String tags,String pid) {
    	return AjaxResult.success(ioutService.ModelMenuListByTag(tags,pid));
    }
    
    @GetMapping(value = "/getDataInterfaceL")
    public AjaxResult getDataInterfaceListByName(String name) {
    	return AjaxResult.success(ioutService.DataInterfaceListByName(name));
    }

    /**
     * 添加卡片
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/add")
    public AjaxResult addModelMenu(@RequestBody ModelMenu modelMenu) {
    	return AjaxResult.success(ioutService.insertModelMenu(modelMenu));
    }

    /**
     * 修改卡片
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/update")
    public AjaxResult updateModelMenu(@RequestBody ModelMenu modelMenu) {
    	return AjaxResult.success(ioutService.updateModelMenu(modelMenu));
    }


    /**
     * 修改多个卡片
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/updateAll")
    public AjaxResult updateModelMenus(@RequestBody String JsonArray) {
    	JSONArray array = JSONArray.parseArray(JsonArray);
    	int a = 0;
    	for(int i=0;i<array.size();i++) {
    		JSONObject object = JSONObject.parseObject(array.get(i).toString());
    		ModelMenu modelMenu = (ModelMenu) JSONObject.parseObject(object.toString(), ModelMenu.class);
    		ioutService.updateModelMenu(modelMenu);
    		a++;
    	}
    	return AjaxResult.success(a);
    }

    /**
     * 删除卡片
     * @param id
     * @return
     */
    @GetMapping(value = "/delete")
    public AjaxResult remove(String id)
    {
        return AjaxResult.success(ioutService.deleteModelMenuById(id));
    }


    /**
     * 根据title获取页面
     * @param modelMenu
     * @return
     */
    @CrossOrigin
    @GetMapping(value = "/getPages")
    public AjaxResult getModelPageList(ModelPage modelMenu) {
    	
    	
    	return AjaxResult.success(ioutService.ModelPageList(modelMenu));
    }

    /**
     * 添加保存页面
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/addPage")
    public AjaxResult addModelPage(@RequestBody ModelPage modelMenu) {
    	return AjaxResult.success(ioutService.insertModelPage(modelMenu));
    }

    /**
     * 修改页面
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/updatePage")
    public AjaxResult updateModelPage(@RequestBody ModelPage modelMenu) {
    	return AjaxResult.success(ioutService.updateModelPage(modelMenu));
    }

    /**
     * 删除页面
     * @param id
     * @return
     */
    @GetMapping(value = "/deletePage")
    public AjaxResult removeModelPage(String id)
    {
        return AjaxResult.success(ioutService.deleteModelPageById(id));
    }
    
    
    /**
     * 根据ProjectName获取项目
     * @param modelMenu
     * @return
     */
    @CrossOrigin
    @GetMapping(value = "/getProjects")
    public AjaxResult getModelProjectList(ModelProject modelMenu) {
    	List<ModelProject> projectList = ioutService.ModelProjectList(modelMenu);    	
    	return AjaxResult.success(projectList);
    }

    /**
     * 添加保存项目
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/addProject")
    public AjaxResult addModelProject(@RequestBody ModelProject modelMenu) {
    	return AjaxResult.success(ioutService.insertModelProject(modelMenu));
    }

    /**
     * 修改项目
     * @param modelMenu
     * @return
     */
    @PostMapping(value = "/updateProject")
    public AjaxResult updateModelProject(@RequestBody ModelProject modelMenu) {
    	return AjaxResult.success(ioutService.updateModelProject(modelMenu));
    }

    /**
     * 删除项目
     * @param id
     * @return
     */
    @GetMapping(value = "/deleteProject")
    public AjaxResult removeModelProject(String id)
    {
        return AjaxResult.success(ioutService.deleteModelProjectById(id));
    }
    

//    @ResponseBody
//    @RequestMapping("/uploadImg")
//    public String uploadPicture(@RequestParam(value="file",required=false)MultipartFile file,
//    HttpServletRequest request){
//
//        File targetFile=null;
//        String msg="";//返回存储路径
//        int code=1;
//        String fileName=file.getOriginalFilename();//获取文件名加后缀
// //       System.out.println("type::" + suffixName);
//        System.out.println("filename::" + fileName);
//        if(fileName!=null&&fileName!=""){
//        	String returnUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() +"/upload/imgs/";//存储路径
////        	String returnUrl = "F:\\myproject\\cardproject\\card-demo\\upload\\imgs\\";
//        	String path = request.getSession().getServletContext().getRealPath("upload/imgs");; //文件存储位置
//            String fileF = fileName.substring(fileName.lastIndexOf("."), fileName.length());//文件后缀
//            fileName=new Date().getTime()+"_"+new Random().nextInt(1000)+fileF;//新的文件名
//
//            //先判断文件是否存在
//            String fileAdd = DateUtils.formatDateToString(new Date(),"yyyyMMdd");
//            File file1 =new File(returnUrl+""+fileAdd);
//            //如果文件夹不存在则创建
//            if(!file1 .exists()  && !file1 .isDirectory()){
//                file1 .mkdir();
//            }
//            targetFile = new File(file1, fileName);
////          targetFile = new File(path, fileName);
//            try {
//                file.transferTo(targetFile);
//                System.out.println("执行成功");
////                FileUtils.copyInputStreamToFile(file.getInputStream(), targetFile);
////                targetFile.deleteOnExit();
////              msg=returnUrl+fileName;
//                msg=returnUrl+fileAdd+"/"+fileName;
//                code=0;
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//        return JSON.toJSONString(ResponseResult.result(code, msg));
//    }

  //文件上传管理（异步）
    @PostMapping("/uploadFile")
    @ResponseBody
    public Map ajaxUploadFile(MultipartFile[] files){
        Map<String,Object> map=new HashMap<>();
        for(MultipartFile file : files) {       	       
            //获取文件名以及后缀名
            String fileName=file.getOriginalFilename();

            //获取jar包所在目录
//            ApplicationHome h = new ApplicationHome(getClass());
//            File jarF = h.getSource();
            //在jar包所在目录下生成一个upload文件夹用来存储上传的图片
//           String dirPath = System.getProperty("user.dir")+"/src/main/resources/static/image/";
            String testPath = System.getProperty("user.dir") + "/upload";
            File targetFile=null;
            try{
            	fileName = new Date().getTime()+"_"+new Random().nextInt(1000)+fileName;
            	String path  = ResourceUtils.getURL("classpath:").getPath();
            	System.out.println(testPath);
//             	if(path.contains("file:")) {
//             		path = path.substring(6);
//             	}
//             	String dirPath = path.substring(0,path.indexOf("target"))+"yht-card-ui/public/upload";
//                 System.out.println(dirPath);

                File filePath=new File(testPath);
                if(!filePath.exists()){
                    filePath.mkdirs();
                }
                targetFile = new File(filePath, fileName);
                //将文件写入磁盘
//                file.transferTo(new File(dirPath+fileName));
                FileUtils.copyInputStreamToFile(file.getInputStream(), targetFile);
                targetFile.deleteOnExit();
                //文件上传成功返回状态信息
                map.put("msg","上传成功！");
                map.put("url","/upload/"+fileName);
                if(fileName.contains(".jpg")) {
                	Thumbnails.of("/home/card-project/upload/"+fileName).scale(1f).outputQuality(0.25f).toFile("/home/card-project/upload/"+fileName);
                }               
            }catch (Exception e){
                e.printStackTrace();
                //上传失败，返回失败信息
                map.put("msg","上传失败！");
            }
        }
        //携带上传状态信息回调到文件上传页面
        return map;
    }

}
