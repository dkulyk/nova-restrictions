<template>
    <modal tabindex="-1" role="dialog" @modal-close="handleClose">
        <form
            autocomplete="off"
            @keydown="handleKeydown"
            @submit.prevent.stop="handleConfirm"
            class="bg-white rounded-lg shadow-lg overflow-hidden w-action-fields"
        >
            <div>
                <heading :level="2" class="pt-8 px-8">{{ action.name }}</heading>

                <div>
                    <div class="action">
                        <default-field> </default-field>
                        <default-field> </default-field>
                        <default-field> </default-field>
                    </div>

                    <!-- Action Fields -->
                    <div class="action" v-for="field in fields" :key="field.attribute">
                        <component
                            :is="'form-' + field.component"
                            :errors="errors"
                            :resource-name="resourceName"
                            :field="field"
                        />
                    </div>
                </div>
            </div>

            <div class="bg-30 px-6 py-3 flex">
                <div class="flex items-center ml-auto">
                    <button
                        type="button"
                        @click.prevent="handleClose"
                        class="btn text-80 font-normal h-9 px-3 mr-3 btn-link"
                    >
                        {{ __('Cancel') }}
                    </button>

                    <button
                        ref="runButton"
                        :disabled="working"
                        type="button"
                        @click="executeAction"
                        class="btn btn-default btn-primary"
                    >
                        <loader v-if="working" width="30"></loader>
                        <span v-else>{{ __('Run Action') }}</span>
                    </button>
                </div>
            </div>
        </form>
    </modal>
</template>

<script>
import { Errors } from 'form-backend-validation'
import PerformsSearches from 'laravel-nova/src/mixins/PerformsSearches'

export default {
    mixins: [PerformsSearches],
    props: {
        resourceName: {},
        action: {},
        selectedResources: {},
    },

    data: () => ({
        additionalFields: [],
        field: {
            prefixComponent: true,
            attribute: 'productToAdd',
            value: null,
            panel: null,
            sortable: false,
            nullable: false,
            textAlign: 'left',
            resourceName: 'shop-products',
            singularLabel: 'Продукт',
            belongsToRelationship: 'productToAdd',
            belongsToId: null,
            searchable: true,
        },
        errors: new Errors(),
        fields: [],
        working: false,
    }),

    watch: {},

    /**
     * Mount the component.
     */
    mounted() {
        // // // If the modal has inputs, let's highlight the first one, otherwise
        // // // let's highlight the submit button
        // if (document.querySelectorAll('.modal input').length) {
        //     document.querySelectorAll('.modal input')[0].focus()
        // } else {
        //     this.$refs.runButton.focus()
        // }
    },

    methods: {
        /**
         * Get the resources that may be related to this resource.
         */
        getAvailableResources() {
            return this.fetchAvailableResources(
                this.resourceName,
                this.field.attribute,
                this.queryParams
            ).then(({ data: { resources, softDeletes, withTrashed } }) => {
                if (this.initializingWithExistingResource || !this.isSearchable) {
                    this.withTrashed = withTrashed
                }

                // Turn off initializing the existing resource after the first time
                this.availableResources = resources
            })
        },

        fetchAvailableResources(resourceName, fieldAttribute, params) {
            return Nova.request().get(`/nova-api/shop-items/associatable/product`, params)
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
            this.$emit('confirm')
        },

        /**
         * Close the modal.
         */
        handleClose() {
            this.$emit('close')
        },

        selectResource(resource) {
            this.selectedResource = resource
            this.retrieveFields(resource.values)
        },

        retrieveFields() {
            this.execute('fields')
                .then(response => {
                    this.fields = response.data
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = new Errors(error.response.data.errors)
                    }
                })
        },

        execute(method = '') {
            return Nova.request({
                method: 'post',
                url: this.endpoint || `/nova-api/${this.resourceName}/action`,
                params: {
                    action: this.action.uriKey,
                    method: method,
                },
                data: this.actionFormData(),
            })
        },

        /**
         * Execute the selected action.
         */
        executeAction() {
            this.execute()
                .then(response => {
                    this.handleActionResponse(response.data)
                    this.working = false
                })
                .catch(error => {
                    this.working = false

                    if (error.response.status == 422) {
                        this.errors = new Errors(error.response.data.errors)
                    }
                })
        },

        /**
         * Handle the action response. Typically either a message, download or a redirect.
         */
        handleActionResponse(response) {
            if (response.message) {
                this.$toasted.show(response.message, { type: 'success' })
            } else if (response.danger) {
                this.$toasted.show(response.danger, { type: 'error' })
            } else {
                this.$toasted.show(this.__('The action ran successfully!'), { type: 'success' })
            }
            this.handleClose()
        },

        /**
         * Gather the action FormData for the given action.
         */
        actionFormData() {
            return _.tap(new FormData(), formData => {
                formData.append('resources', this.selectedResources)
                formData.append('product', this.selectedResource.value)

                _.each(this.fields, field => {
                    field.fill(formData)
                })
            })
        },
    },

    computed: {
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
        },
    },
}
</script>
