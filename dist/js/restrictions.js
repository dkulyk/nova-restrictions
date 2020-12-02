!(function (t) {
    var e = {}
    function n(o) {
        if (e[o]) return e[o].exports
        var i = (e[o] = { i: o, l: !1, exports: {} })
        return t[o].call(i.exports, i, i.exports, n), (i.l = !0), i.exports
    }
    ;(n.m = t),
        (n.c = e),
        (n.d = function (t, e, o) {
            n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o })
        }),
        (n.r = function (t) {
            'undefined' != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
                Object.defineProperty(t, '__esModule', { value: !0 })
        }),
        (n.t = function (t, e) {
            if ((1 & e && (t = n(t)), 8 & e)) return t
            if (4 & e && 'object' == typeof t && t && t.__esModule) return t
            var o = Object.create(null)
            if (
                (n.r(o),
                Object.defineProperty(o, 'default', { enumerable: !0, value: t }),
                2 & e && 'string' != typeof t)
            )
                for (var i in t)
                    n.d(
                        o,
                        i,
                        function (e) {
                            return t[e]
                        }.bind(null, i)
                    )
            return o
        }),
        (n.n = function (t) {
            var e =
                t && t.__esModule
                    ? function () {
                          return t.default
                      }
                    : function () {
                          return t
                      }
            return n.d(e, 'a', e), e
        }),
        (n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }),
        (n.p = '/'),
        n((n.s = 0))
})([
    function (t, e, n) {
        t.exports = n(1)
    },
    function (t, e, n) {
        'use strict'
        n.r(e)
        var o = (function (t, e, n, o, i, r, s, a) {
            var l,
                c = 'function' == typeof t ? t.options : t
            if (
                (e && ((c.render = e), (c.staticRenderFns = n), (c._compiled = !0)),
                o && (c.functional = !0),
                r && (c._scopeId = 'data-v-' + r),
                s
                    ? ((l = function (t) {
                          ;(t =
                              t ||
                              (this.$vnode && this.$vnode.ssrContext) ||
                              (this.parent &&
                                  this.parent.$vnode &&
                                  this.parent.$vnode.ssrContext)) ||
                              'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                              (t = __VUE_SSR_CONTEXT__),
                              i && i.call(this, t),
                              t && t._registeredComponents && t._registeredComponents.add(s)
                      }),
                      (c._ssrRegister = l))
                    : i &&
                      (l = a
                          ? function () {
                                i.call(this, this.$root.$options.shadowRoot)
                            }
                          : i),
                l)
            )
                if (c.functional) {
                    c._injectStyles = l
                    var u = c.render
                    c.render = function (t, e) {
                        return l.call(e), u(t, e)
                    }
                } else {
                    var d = c.beforeCreate
                    c.beforeCreate = d ? [].concat(d, l) : [l]
                }
            return { exports: t, options: c }
        })(
            {
                props: { resourceName: {}, action: {}, selectedResources: {} },
                data: function () {
                    return {
                        additionalFields: [],
                        working: !1,
                        restriction: null,
                        enabled: !1,
                        type: 0,
                        options: [],
                        rules: [],
                        loading: !1,
                    }
                },
                mounted: function () {
                    this.restriction = _.first(this.action.restrictions).value
                },
                watch: {
                    restriction: function (t) {
                        this.getRestriction(t)
                    },
                    enabled: function () {
                        this.update()
                    },
                    type: function () {
                        this.update()
                    },
                },
                methods: {
                    toggleEnabled: function () {
                        this.enabled = !this.enabled
                    },
                    handleKeydown: function (t) {
                        ;-1 === ['Escape', 'Enter'].indexOf(t.key) && t.stopPropagation()
                    },
                    handleConfirm: function (t) {},
                    handleClose: function () {
                        this.$emit('close')
                    },
                    selectResource: function (t) {
                        var e = this
                        return (
                            (this.options = []),
                            Nova.request({
                                method: 'post',
                                url:
                                    this.endpoint ||
                                    '/nova-api/'.concat(this.resourceName, '/action'),
                                params: { action: this.action.uriKey, method: 'attach' },
                                data: {
                                    resources: this.selectedResources,
                                    restriction: this.restriction,
                                    rule: t.value,
                                },
                            }).then(function (t) {
                                return e.fill(t.data)
                            })
                        )
                    },
                    update: function () {
                        var t = this
                        if (!this.loading)
                            return Nova.request({
                                method: 'post',
                                url:
                                    this.endpoint ||
                                    '/nova-api/'.concat(this.resourceName, '/action'),
                                params: { action: this.action.uriKey, method: 'update' },
                                data: {
                                    resources: this.selectedResources,
                                    restriction: this.restriction,
                                    enabled: this.enabled,
                                    type: this.type,
                                },
                            }).then(function (e) {
                                return t.fill(e.data)
                            })
                    },
                    detach: function (t) {
                        var e = this
                        return Nova.request({
                            method: 'post',
                            url: this.endpoint || '/nova-api/'.concat(this.resourceName, '/action'),
                            params: { action: this.action.uriKey, method: 'detach' },
                            data: {
                                resources: this.selectedResources,
                                restriction: this.restriction,
                                rule: t,
                            },
                        }).then(function (t) {
                            return e.fill(t.data)
                        })
                    },
                    getRestriction: function (t) {
                        var e = this
                        return Nova.request({
                            method: 'post',
                            url: this.endpoint || '/nova-api/'.concat(this.resourceName, '/action'),
                            params: { action: this.action.uriKey, method: 'restriction' },
                            data: { resources: this.selectedResources, restriction: t },
                        }).then(function (t) {
                            return e.fill(t.data)
                        })
                    },
                    performSearch: function (t) {
                        var e = this
                        return Nova.request({
                            method: 'post',
                            url: this.endpoint || '/nova-api/'.concat(this.resourceName, '/action'),
                            params: { action: this.action.uriKey, method: 'search' },
                            data: {
                                resources: this.selectedResources,
                                restriction: this.restriction,
                                search: t,
                            },
                        }).then(function (t) {
                            e.options = t.data
                        })
                    },
                    fill: function (t) {
                        var e = this
                        ;(this.loading = !0),
                            (this.enabled = t.enabled),
                            (this.type = t.type),
                            (this.rules = t.rules),
                            this.$nextTick(function () {
                                e.loading = !1
                            })
                    },
                },
                computed: {
                    restrictionsField: function () {
                        return { attribute: 'restriction' }
                    },
                    queryParams: function () {
                        return { params: { current: this.selectedResourceId, search: this.search } }
                    },
                },
            },
            function () {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e
                return n(
                    'modal',
                    {
                        attrs: { tabindex: '-1', role: 'dialog' },
                        on: { 'modal-close': t.handleClose },
                    },
                    [
                        n(
                            'form',
                            {
                                staticClass:
                                    'bg-white rounded-lg shadow-lg overflow-hidden w-action-fields',
                                attrs: { autocomplete: 'off' },
                                on: {
                                    keydown: t.handleKeydown,
                                    submit: function (e) {
                                        return (
                                            e.preventDefault(),
                                            e.stopPropagation(),
                                            t.handleConfirm(e)
                                        )
                                    },
                                },
                            },
                            [
                                n('div', [
                                    n('div', [
                                        n(
                                            'div',
                                            { staticClass: 'action' },
                                            [
                                                n(
                                                    'default-field',
                                                    {
                                                        attrs: {
                                                            fieldName: 'Restriction',
                                                            field: {
                                                                name: 'restriction',
                                                                helpText: '',
                                                            },
                                                            'show-help-text': !1,
                                                        },
                                                    },
                                                    [
                                                        n(
                                                            'template',
                                                            { slot: 'field' },
                                                            [
                                                                n('select-control', {
                                                                    staticClass:
                                                                        'w-full form-control form-select',
                                                                    attrs: {
                                                                        id: 'restriction',
                                                                        options:
                                                                            t.action.restrictions,
                                                                    },
                                                                    model: {
                                                                        value: t.restriction,
                                                                        callback: function (e) {
                                                                            t.restriction = e
                                                                        },
                                                                        expression: 'restriction',
                                                                    },
                                                                }),
                                                            ],
                                                            1
                                                        ),
                                                    ],
                                                    2
                                                ),
                                                t._v(' '),
                                                n(
                                                    'default-field',
                                                    {
                                                        attrs: {
                                                            fieldName: 'Enabled',
                                                            field: {
                                                                name: 'enabled',
                                                                helpText: '',
                                                            },
                                                            'show-help-text': !1,
                                                        },
                                                    },
                                                    [
                                                        n(
                                                            'template',
                                                            { slot: 'field' },
                                                            [
                                                                n('checkbox', {
                                                                    staticClass: 'py-2',
                                                                    attrs: {
                                                                        id: 'enabled',
                                                                        name: t.enabled,
                                                                        checked: t.enabled,
                                                                        options: [],
                                                                    },
                                                                    on: { input: t.toggleEnabled },
                                                                }),
                                                            ],
                                                            1
                                                        ),
                                                    ],
                                                    2
                                                ),
                                                t._v(' '),
                                                n(
                                                    'default-field',
                                                    {
                                                        attrs: {
                                                            fieldName: 'Rule',
                                                            field: { name: 'tyoe', helpText: '' },
                                                            'show-help-text': !1,
                                                        },
                                                    },
                                                    [
                                                        n(
                                                            'template',
                                                            { slot: 'field' },
                                                            [
                                                                n(
                                                                    'select-control',
                                                                    {
                                                                        staticClass:
                                                                            'w-full form-control form-select',
                                                                        attrs: {
                                                                            id: 'type',
                                                                            options: [],
                                                                        },
                                                                        model: {
                                                                            value: t.type,
                                                                            callback: function (e) {
                                                                                t.type = e
                                                                            },
                                                                            expression: 'type',
                                                                        },
                                                                    },
                                                                    [
                                                                        n(
                                                                            'option',
                                                                            {
                                                                                attrs: {
                                                                                    value: '1',
                                                                                },
                                                                            },
                                                                            [t._v('Deny only')]
                                                                        ),
                                                                        t._v(' '),
                                                                        n(
                                                                            'option',
                                                                            {
                                                                                attrs: {
                                                                                    value: '2',
                                                                                },
                                                                            },
                                                                            [t._v('Allow only')]
                                                                        ),
                                                                    ]
                                                                ),
                                                            ],
                                                            1
                                                        ),
                                                    ],
                                                    2
                                                ),
                                                t._v(' '),
                                                n(
                                                    'default-field',
                                                    {
                                                        attrs: {
                                                            fieldName:
                                                                1 === Number(t.type)
                                                                    ? 'Deny'
                                                                    : 'Allow',
                                                            field: { name: 'tyoe', helpText: '' },
                                                            'show-help-text': !1,
                                                        },
                                                    },
                                                    [
                                                        n(
                                                            'template',
                                                            { slot: 'field' },
                                                            [
                                                                n('search-input', {
                                                                    staticClass: 'mb-3',
                                                                    attrs: {
                                                                        data: t.options,
                                                                        trackBy: 'value',
                                                                        clearable: !1,
                                                                    },
                                                                    on: {
                                                                        input: t.performSearch,
                                                                        selected: t.selectResource,
                                                                    },
                                                                    scopedSlots: t._u([
                                                                        {
                                                                            key: 'option',
                                                                            fn: function (e) {
                                                                                var o = e.option
                                                                                return n(
                                                                                    'div',
                                                                                    {
                                                                                        staticClass:
                                                                                            'flex items-center',
                                                                                    },
                                                                                    [
                                                                                        t._v(
                                                                                            '\n                                    ' +
                                                                                                t._s(
                                                                                                    o.label
                                                                                                ) +
                                                                                                '\n                                '
                                                                                        ),
                                                                                    ]
                                                                                )
                                                                            },
                                                                        },
                                                                    ]),
                                                                }),
                                                                t._v(' '),
                                                                t._l(t.rules, function (e) {
                                                                    return n(
                                                                        'div',
                                                                        {
                                                                            key: e.value,
                                                                            staticClass:
                                                                                'py-2 relative',
                                                                        },
                                                                        [
                                                                            n(
                                                                                'button',
                                                                                {
                                                                                    attrs: {
                                                                                        type:
                                                                                            'button',
                                                                                    },
                                                                                    on: {
                                                                                        click: function (
                                                                                            n
                                                                                        ) {
                                                                                            return (
                                                                                                n.stopPropagation(),
                                                                                                t.detach(
                                                                                                    e.value
                                                                                                )
                                                                                            )
                                                                                        },
                                                                                    },
                                                                                },
                                                                                [
                                                                                    n('icon', {
                                                                                        attrs: {
                                                                                            type:
                                                                                                'delete',
                                                                                        },
                                                                                    }),
                                                                                ],
                                                                                1
                                                                            ),
                                                                            t._v(' '),
                                                                            n('span', [
                                                                                t._v(t._s(e.label)),
                                                                            ]),
                                                                        ]
                                                                    )
                                                                }),
                                                            ],
                                                            2
                                                        ),
                                                    ],
                                                    2
                                                ),
                                            ],
                                            1
                                        ),
                                    ]),
                                ]),
                                t._v(' '),
                                n('div', { staticClass: 'bg-30 px-6 py-3 flex' }, [
                                    n('div', { staticClass: 'flex items-center ml-auto' }, [
                                        n(
                                            'button',
                                            {
                                                ref: 'runButton',
                                                staticClass: 'btn btn-default btn-primary',
                                                attrs: { disabled: t.working, type: 'button' },
                                                on: {
                                                    click: function (e) {
                                                        return e.preventDefault(), t.handleClose(e)
                                                    },
                                                },
                                            },
                                            [
                                                t.working
                                                    ? n('loader', { attrs: { width: '30' } })
                                                    : n('span', [t._v(t._s(t.__('Done')))]),
                                            ],
                                            1
                                        ),
                                    ]),
                                ]),
                            ]
                        ),
                    ]
                )
            },
            [],
            !1,
            null,
            null,
            null
        ).exports
        Nova.booting(function (t, e, n) {
            t.component('dkulyk-action-restrictions', o)
        })
    },
])
