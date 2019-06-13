<template>
    <modal
            tabindex="-1"
            role="dialog"
            @modal-close="handleClose"
    >
        <form
                autocomplete="off"
                @keydown="handleKeydown"
                @submit.prevent.stop="handleConfirm"
                class="bg-white rounded-lg shadow-lg overflow-hidden w-action-fields"
        >
            <div>
                <div>
                    <div class="action">
                        <default-field
                                fieldName="Restriction"
                                :field="{name:'restriction', helpText:''}"
                                :show-help-text="false"
                        >
                            <template slot="field">
                                <select-control
                                        id="restriction"
                                        v-model="restriction"
                                        class="w-full form-control form-select"
                                        :options="action.restrictions"
                                ></select-control>
                            </template>
                        </default-field>
                        <default-field
                                fieldName="Enabled"
                                :field="{name:'enabled', helpText:''}"
                                :show-help-text="false"
                        >
                            <template slot="field">
                                <checkbox
                                        class="py-2"
                                        @input="toggleEnabled"
                                        id="enabled"
                                        :name="enabled"
                                        :checked="enabled"
                                        :options="[]"
                                />
                            </template>
                        </default-field>
                        <default-field
                                fieldName="Rule"
                                :field="{name:'tyoe', helpText:''}"
                                :show-help-text="false"
                        >
                            <template slot="field">
                                <select-control
                                        id="type"
                                        v-model="type"
                                        class="w-full form-control form-select"
                                        :options="[]"
                                >
                                    <option value="1">Deny only</option>
                                    <option value="2">Allow only</option>
                                </select-control>
                            </template>
                        </default-field>
                        <default-field
                                :fieldName="Number(type) === 1 ? 'Deny' : 'Allow'"
                                :field="{name:'tyoe', helpText:''}"
                                :show-help-text="false"
                        >
                            <template slot="field">
                                <search-input
                                        @input="performSearch"
                                        @selected="selectResource"
                                        :data="options"
                                        trackBy="value"
                                        class="mb-3"
                                        :clearable="false"
                                >
                                    <div slot="option" slot-scope="{ option }" class="flex items-center">
                                        {{ option.label }}
                                    </div>
                                </search-input>
                                <div v-for="option in rules" :key="option.value" class="py-2 relative">
                                    <button
                                            type="button"
                                            @click.stop="detach(option.value)"
                                    >
                                        <icon type="delete"></icon>
                                    </button>
                                    <span>{{ option.label }}</span>
                                </div>
                            </template>
                        </default-field>
                    </div>
                </div>
            </div>

            <div class="bg-30 px-6 py-3 flex">
                <div class="flex items-center ml-auto">
                    <button
                            ref="runButton"
                            :disabled="working"
                            type="button"
                            @click.prevent="handleClose"
                            class="btn btn-default btn-primary"
                    >
                        <loader v-if="working" width="30"></loader>
                        <span v-else>{{ __('Done') }}</span>
                    </button>
                </div>
            </div>
        </form>
    </modal>
</template>

<script>

export default {
    props: {
        resourceName: {},
        action: {},
        selectedResources: {},
    },

    data: () => ({
        additionalFields: [],
        working: false,
        restriction: null,
        enabled: false,
        type: 0,
        options: [],
        rules: [],
        loading: false,
    }),

    /**
     * Mount the component.
     */
    mounted() {
        this.restriction = _.first(this.action.restrictions).value
    },

    watch: {
        restriction(newValue) {
            this.getRestriction(newValue);
        },
        enabled() {
            this.update()
        },
        type() {
            this.update()
        }
    },

    methods: {
        toggleEnabled() {
            this.enabled = !this.enabled
        },

        /**
         * Stop propogation of input events unless it's for an escape or enter keypress
         */
        handleKeydown(e) {
            if (['Escape', 'Enter'].indexOf(e.key) !== -1) {
                return
            }

            e.stopPropagation()
        },

        /**
         * Execute the selected action.
         */
        handleConfirm(e) {
        },

        /**
         * Close the modal.
         */
        handleClose() {
            this.$emit('close')
        },

        selectResource(rule) {
            this.options = []

            return Nova.request({
                method: 'post',
                url: this.endpoint || `/nova-api/${this.resourceName}/action`,
                params: {
                    action: this.action.uriKey,
                    method: 'attach',

                },
                data: {
                    'resources': this.selectedResources,
                    restriction: this.restriction,
                    rule: rule.value,
                }
            }).then(response => this.fill(response.data))
        },

        update() {
            if (this.loading) return

            return Nova.request({
                method: 'post',
                url: this.endpoint || `/nova-api/${this.resourceName}/action`,
                params: {
                    action: this.action.uriKey,
                    method: 'update',

                },
                data: {
                    'resources': this.selectedResources,
                    restriction: this.restriction,
                    enabled: this.enabled,
                    type: this.type,
                }
            }).then(response => this.fill(response.data))
        },

        detach(value) {
            return Nova.request({
                method: 'post',
                url: this.endpoint || `/nova-api/${this.resourceName}/action`,
                params: {
                    action: this.action.uriKey,
                    method: 'detach',

                },
                data: {
                    'resources': this.selectedResources,
                    restriction: this.restriction,
                    rule: value,
                }
            }).then(response => this.fill(response.data))
        },

        getRestriction(restriction) {
            return Nova.request({
                method: 'post',
                url: this.endpoint || `/nova-api/${this.resourceName}/action`,
                params: {
                    action: this.action.uriKey,
                    method: 'restriction',

                },
                data: {
                    'resources': this.selectedResources,
                    restriction: restriction,
                }
            }).then(response => this.fill(response.data))
        },

        performSearch(value) {
            return Nova.request({
                method: 'post',
                url: this.endpoint || `/nova-api/${this.resourceName}/action`,
                params: {
                    action: this.action.uriKey,
                    method: 'search',

                },
                data: {
                    'resources': this.selectedResources,
                    restriction: this.restriction,
                    search: value
                }
            }).then(response => {
                this.options = response.data
            })
        },

        fill(data) {
            this.loading = true
            this.enabled = data.enabled
            this.type = data.type
            this.rules = data.rules
            this.$nextTick(() => {
                this.loading = false
            })
        },
    },

    computed: {

        restrictionsField() {
            return {
                attribute: 'restriction',

            }
        },

        /**
         * Get the query params for getting available resources
         */
        queryParams() {
            return {
                params: {
                    current: this.selectedResourceId,
                    search: this.search,
                },
            }
        }
    }
}
</script>
