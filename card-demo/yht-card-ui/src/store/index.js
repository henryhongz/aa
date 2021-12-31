import Vue from 'vue'
import Vuex from 'vuex'
import { createCard, getCardList, deleteCard } from "@/api/card";
import { getProjectList } from '@/api/project'
import { getCompanyAttributes, getApiList } from "@/api/remote";
import { Message } from 'element-ui';
import update from './modules/update'
import home from './modules/home'
import park from './modules/park'
import map from './modules/map'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    update,
    map,
    home,
    park
  },
  state: {
    projects: [],
    cards: [],
    pages: [],
    apis: [],
    attributes: null,
    fullscreenFlag: false,
    readOnly: false
  },
  getters: {
    // 根据页面id获取页面基本信息
    getPage: (state) => (id) => {
      return state.pages.find(item => item.id === id + '');
    },
    // 根据项目id获取页面基本信息
    getProject: (state) => (id) => {
      return state.projects.find(item => item.id + '' === id) || {};
    },
    // 根据页面id获取页面卡片布局
    mergeLayout: (state) => (positionList) => {
      return positionList.map(item => {
        const card = state.cards.find(card => card.i === item.i);
        if (!card) return;
        return {
          ...card,
          x: item.x,
          y: item.y
        }
      }).filter(item => {
        return item;
      })
    },
    // 企业主要属性
    necessaryAttributes: (state) => {
      if (!state.attributes) return []
      return state.attributes.filter(item => item.fieldCategory === 1);
    },
    // 企业次要属性
    unnecessaryAttributes: (state) => {
      if (!state.attributes) return []
      return state.attributes.filter(item => [2, 3].indexOf(item.fieldCategory) !== -1);
    },
    // 返回列表类型的接口
    listApi: (state) => {
      return state.apis.filter(item => item.dataType === 'list' || item.dataType === 'chart');
    },
    // 返回用于图表的接口
    chartApi: (state) => {
      return state.apis.filter(item => item.dataType === 'chart' || item.dataType === 'list');
    },
    // 返回数值类型的接口
    numberApi: (state) => {
      return state.apis.filter(item => item.dataType === 'number');
    },
    // 返回对象类型的接口
    objectApi: (state) => {
      return state.apis.filter(item => item.dataType === 'object');
    },
  },
  mutations: {
    // 更新卡片列表
    updateCards (state, list) {
      state.cards = list.map(item => {
        let options = '';
        try {
          options = JSON.parse(item.options);
        } catch (e) {
          options = item.options;
        }
        return {
          i: parseInt(item.id),
          w: parseInt(item.width),
          h: parseInt(item.length),
          title: item.title,
          options: options,
          type: item.type,
          style: JSON.parse(item.style) || { total: {}, title: {}, content: {}, showTitle: true },
          tag: item.tag ? item.tag.split(',') : [],
          link: item.link,
          dataType: item.dataType,
          difId: item.difId,
          dataInterface: item.dataInterface,
          readonly: item.readonly,
          param: item.param
        }
      })
    },
    // 更新页面列表
    updatePages (state, list) {
      let pages = []
      list.forEach(item => {
        pages = pages.concat(item.pageList)
      })
      state.pages = pages.map(item => {
        return {
          ...item,
          layout: JSON.parse(item.pageText)
        }
      });
    },
    // 修改全屏状态
    changeFullscreenFlag (state, bool) {
      // 只读状态下不能退出全屏
      if (state.readOnly && !bool) return;
      state.fullscreenFlag = bool;
    },
    // 更新项目列表
    updateProjects (state, projects) {
      state.projects = projects
    },
    // 更新项目属性
    updateAttributes (state, attrs) {
      state.attributes = attrs
    },
    // 更新接口信息
    updateApis (state, attrs) {
      state.apis = attrs
    },
    // 修改只读状态
    changeReadOnlyFlag (state, bool) {
      state.readOnly = bool;
    }
  },
  actions: {
    // 更新卡片列表
    updateCards ({ commit }) {
      return new Promise(resolve => {
        getCardList().then(d => {
          commit('updateCards', d.data);
          resolve();
        })
      })
    },
    // 创建新卡片
    createCard ({ dispatch }, card) {
      let options = card.options;
      if (card.type !== 'text') {
        options = JSON.stringify(card.options);
      }
      return new Promise(resolve => {
        createCard({
          width: card.w,
          length: card.h,
          title: card.title,
          type: card.type,
          options: options,
          style: JSON.stringify(card.style),
          dataType: card.dataType,
          difId: card.difId,
          readonly: card.difId ? 'w' : 'r',
          param: card.param
        }).then(d => {
          Message({
            message: d.msg,
            type: 'success'
          });
          dispatch('updateCards').then(() => {
            resolve({...card, i: d.data});
          })
        })
      })
    },
    // 删除卡片
    deleteCard ({ dispatch }, id) {
      deleteCard(id).then(d => {
        Message.success(d.msg);
        dispatch('updateCards');
      })
    },
    // // 更新页面列表
    // // eslint-disable-next-line no-unused-vars
    // updatePages ({ commit }) {
    //   return getPageList().then(d => {
    //     // commit('updatePages', d.data);
    //     return Promise.resolve(d.data);
    //   })
    // },
    // 更新项目列表
    updateProjects ({ commit }) {
      return getProjectList().then(d => {
        commit('updateProjects', d.data)
        commit('updatePages', d.data)
        return Promise.resolve(d.data)
      })
    },
    // 获取企业所有属性
    getCompanyAttributes ({ commit }) {
      getCompanyAttributes().then(res => {
        commit('updateAttributes', res.rows)
      })
    },
    // 获取所有接口信息
    getApiList ({ commit }) {
      getApiList().then(res => {
        commit('updateApis', res.data)
      })
    }
  }
})
