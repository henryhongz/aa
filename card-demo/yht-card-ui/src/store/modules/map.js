const map = {
  namespaced: true,

  state: {
    circleFlag: false, // 巡航标志
    scaleValue: 1, // 自适应缩放比例
    cityCode: '', // 当前城市代码
  },

  mutations: {
    SET_CIRCLE_FLAG: (state, payload) => {
      state.circleFlag = payload;
    },
    SET_SCALE_VALUE: (state, payload) => {
      state.scaleValue = payload;
    },
    SET_CITY_CODE: (state, payload) => {
      state.cityCode = payload;
    },
  },

  actions: {
    setCircleFlag: ({ commit }, payload) => {
      commit('SET_CIRCLE_FLAG', payload);
    },
    setScaleValue: ({ commit }, payload) => {
      commit('SET_SCALE_VALUE', payload);
    },
    setCityCode: ({ commit }, payload) => {
      commit('SET_CITY_CODE', payload);
    }
  }
}

export default map;
