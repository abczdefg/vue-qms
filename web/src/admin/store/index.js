import Vue from 'vue'
import Vuex from 'vuex'
import state from '@admin/store/state'
import mutations from '@admin/store/mutations'
import actions from '@admin/store/action'

Vue.use(Vuex)

export default new Vuex.Store({
	state,
	actions,
	mutations
})
