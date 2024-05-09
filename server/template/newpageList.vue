<template>
  <div class="page-container data-collect">
    <pageTable
      ref="tablecon"
      ellipsisAble="tooltip"
      :columnsTable="columns"
      :pageTransfer="true"
      v-autoTableHeight="{ key: 'page-list-table' }"
    >
      <pageSearchList
        ref="formValidate"
        slot="search"
        :searchList="searchList"
        :formValidate.sync="formValidate"
        :loadSearch="pageSearchLoad"
        @itemChange="itemChange"
      >
        {% if tableSetList and tableSetList.length>0 %}
        <div>
          {% for item in tableSetList %}
          <Button type="primary">{{ item }}</Button>
          {% endfor %}
        </div>
        {% endif %}
      </pageSearchList>
    </pageTable>
    <editDrawer ref="editDrawer" @success="pageSearchLoad" />
    <detailDrawer ref="detailDrawer" />
  </div>
</template>
<script>
import { operatorBtn } from '@/misc/operator-btn'
import editDrawer from './components/editDrawer.vue'
import detailDrawer from './components/detailDrawer.vue'
import { getNameForValue, getApiAsync, getApiDtAsync } from '@/utils/dict'
import moment from 'moment'

export default {
  name: 'custom-attribute',
  components: { editDrawer, detailDrawer },
  data() {
    return {
      {% for item in selectSearchList %}
        {{item.key}}_Arr:[],
      {% endfor %}
      formValidate: {
        {% for item in searchTableData %}
          {{item.key}}:  {% if item.type=='select' and item.multiple %} [] {% else %} "" {% endif %} ,
         {% endfor %}
      },
      searchList: [
        {% for item in searchTableData %}
        {
          type: "{{item.type}}",
          name: "{{item.label}}",
          key: "{{item.key}}",
          clearable: {{item.clearable}},
          {% if item.type=='date' %}
               dateType: "{{item.dateType}}",
            {% endif %}
            {% if item.type=='select' %}
              multiple: {{item.multiple}},
              filterable: {{item.filterable}},
              option: () => this.{{item.key}}_Arr,
            {% endif %}
          disabled: false,
          noDrag: false,
          checked: true,
        },
        {% endfor %}
      ],
      columns: [
        {% if isMultipleTable %}
          { type: "checkbox", width: "80", fixed: "left"},
        {% endif %}
        {% for item in columnTableData %}
        {
          field: "{{item.key}}",
          title: "{{item.title}}",
          minWidth: {{item.width}},
          {% if item.isDict %}
            slots: {
              default: ({ row }, h) => {
                const { {{item.key}} } = row
                return [h('div', getNameForValue( this.{{item.key}}_Arr, {{item.key}} ))]
              },
            },
          {% endif %}
        },
        {% endfor %}


        {% if tableItemSetList and tableItemSetList.length>0 %}

        {
          width: 180,
          title: '操作',
          fixed: 'right',
          slots: {
            default: ({ row, column }, h) => {
              let arr = []
               {% for item in tableItemSetList %}
              arr.push(
                h(
                  'a',
                  {
                    on: {
                      click: () => {

                      },
                    },
                  },
                  "{{item}}"
                )
              )
              {% endfor %}


              return [operatorBtn(arr, h)]
            },
          },
        },

        {% endif %}
      ],
     
    }
  },
  methods: {
    handleAdd() {
      this.$refs.editDrawer.openDrawer()
    },
    handleEdit(row) {
      this.$refs.editDrawer.openDrawer(row)
    },
    async editStatus(row, resolve) {
      const { enableStatus, openId } = row
      const name = enableStatus == 1 ? '停用' : '启用'
      let params = {
        openId,
        enable: enableStatus == 1 ? '2' : '1',
      }

      this.$loading.show()
      let res = await this.$api.dataCheckApi.changeStatus(params)
      this.$loading.hide()
      const { code } = res.data
      if (code == 200) {
        resolve(true)
        this.$Message.success(name + '成功')
        this.getTableList()
      } else {
        resolve(false)
        this.$Message.error(infos)
      }
      // this.$Modal.confirm({
      //   title: '确认',
      //   content: `确定${name}该指标吗？`,
      //   okText: name,
      //   type: 'warning',
      //   onOk: async () => {
      //   }
      // })
    },
    handleDelete(row) {
      let content = ''
      if (row.enableStatus == 1) {
        content = '当前指标已启用'
      } else if (row.indicatorCodeCount && row.indicatorCodeCount > 0) {
        content = '当前指标已生成了校验报告'
      } else {
        this.$Modal.confirm({
          title: `确认删除当前指标吗？`,
          content: '',
          onOk: () => {
            this.$api.dataCheckApi.delete({ openId: row.openId }).then((res) => {
              const { code, data, infos } = res.data
              if (code == 200) {
                this.$Message.success('删除成功')
                this.getTableList()
              } else {
                this.$Message.error(infos)
              }
            })
          },
        })
        return
      }
      this.$Modal.confirm({
        title: `不允许删除`,
        content: content,
        okText: '知道了',
        showCancel: false,
      })
    },
    handleDetail(row) {
      let data = {
        ...row,
      }
      this.$refs.detailDrawer.openDrawer(data)
    },
    
    pageSearchLoad() {
      this.getTableList('pagejump')
    },

    
    itemChange(key, value) {},

    getTableList(...rest) {
      var params = {
        module: "{{fileName}}Api",
        api: "list",
        params: {
          ...this.formValidate,
        },
      }
      rest.indexOf('pagejump') >= 0 && (params.pagejump = 'pagejump')
      this.$refs.tablecon.params = params
      this.$refs.tablecon.params = params
      // this.$refs.tablecon.tableData = [{ id: 1 }]
      this.$refs.tablecon.loadTable()
    },
    async getDict() {
      let codeArray = [
        {% for item in selectSearchList %}
          "{{item.key}}_Arr",
        {% endfor %}
      ]

      getApiAsync(codeArray).then(data=>{
        codeArray.forEach((item) => {
          if (data[item]) {
            this[item] = data[item]
          }
        })
      })
    },
  },
  mounted() {
    // this.getTableList('pagejump')
    // this.getDict()
  },
  destroyed() {},
}
</script>
<style lang="scss" scoped>
.page-container {
  padding: 16px;
  height: 100%;
}
</style>
