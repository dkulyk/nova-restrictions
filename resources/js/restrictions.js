import RestrictionAction from './components/Restrictions.vue'

Nova.booting((Vue, router, store) => {
    Vue.component('dkulyk-action-restrictions', RestrictionAction);
})