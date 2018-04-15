import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from '@admin/store/modules/sidebar'
import route from '@admin/store/modules/route'
import user from '@admin/store/modules/user'
import questionnaire from '@admin/store/modules/questionnaire'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
    sidebar,
    route,
    user,
    questionnaire,
  }
})
