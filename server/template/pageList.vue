<template>
  <PageSearchTable
    ref="PageSearchTable"
    :columnsTable="columnsTable"
    :searchList="searchList"
    :formValidate.sync="formValidate"
    :beforeHandelSearchField="beforeHandelSearchField"
  >
    {% if tableSetList and tableSetList.length>0 %}
    <div class="button-con" slot="tool">
      {% for item in tableSetList %}
      <a class="btn btn-outline-info" @click="openConfirmModal">{{ item }}</a>
      {% endfor %}
    </div>
    {% endif %}
    <!-- 删除 -->
    <confirm-delete :deleteData="deleteData" ref="confirmDelModal">
      <div>是否确定删除</div>
    </confirm-delete>
    <message-desc ref="errorMsg">
      <template #smsDescribe>
        <div v-html="errorinfos"></div>
      </template>
    </message-desc>
  </PageSearchTable>
</template>
<script>
import confirmDelete from "@/components/common-component/modal/confirm-delete";
import PageSearchTable from "@/components/common-component/PageSearchTable/index";
import { getApiAsync, dataTransferText, getApiDtAsync } from "@/misc/baseDict";
import { operatorBtn } from "@/misc/operator-btn";
import MessageDesc from "@/components/common-component/modal/error-desc";
import { CusInfoTooltip, formatMoney } from "@/misc/root-common";
import { curMonth } from "@/misc/base";

export default {
  name: "{{fileName}}",
  components: {
    PageSearchTable,
    confirmDelete,
    MessageDesc,
  },
  computed: {},
  data() {
    return {
      errorinfos: "",
      selectdata: [],
      {% for item in selectSearchList %}
        {{item.key}}_Arr:[],
      {% endfor %}
      formValidate: {
        {% for item in searchTableData %}
          {{item.key}}:  {% if item.type=='select' and item.multiple %} [] {% else %} "" {% endif %} ,
         {% endfor %}
      },
      condition: [
         {% for item in searchTableData %}
          { f: "{{item.key}}", t: "s", op: {% if item.type=='input' %} "like" {% else %} "eq" {% endif %} },
         {% endfor %}
      ],
      searchList: [
        {% for item in searchTableData %}
          {
            type: "{{item.type}}",
            key: "{{item.key}}",
            label: "{{item.label}}",
            placeholder: "{{item.placeholder}}",
            label_hh: {{item.label_hh}},
            clearable: {{item.clearable}},
            {% if item.type=='date' %}
               dateType: "{{item.dateType}}",
            {% endif %}
            {% if item.type=='select' %}
              multiple: {{item.multiple}},
              filterable: {{item.filterable}},
              option: () => this.{{item.key}}_Arr,
            {% endif %}

          },
        {% endfor %}
      ],
      columnsTable: [
        {% if isMultipleTable %}
          { type: "selection", width: "60", fixed: "left", align: "center" },
        {% endif %}

        {% for item in columnTableData %}
          {
            title: "{{item.title}}",
            key: "{{item.key}}",
            minWidth: {{item.width}},
            ellipsis: true,
            tooltip: true,
            resizable: true,
            {% if item.isDict %}
              render: (h, p) => {
                let data = dataTransferText(
                  this.{{item.key}}_Arr,
                  p.row.{{item.key}},
                  "{{item.key}}"
                );
                return h("span", data);
              },
            {% elif item.isRender %}
              render: (h, p) => {
                let word = p.row.{{item.key}};
                return h("span", word);
              },
            {% endif %}
          },
        {% endfor %}



        {% if tableItemSetList and tableItemSetList.length>0 %}
        {
          title: "操作",
          fixed: "right",
          width: 180,
          render: (h, params) => {
            let arr = [];
            let str =
             {% for item in tableItemSetList %}
            arr.push(
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.editInfo(params.row);
                    },
                  },
                },
               "{{item}}"
              )
            );
            {% endfor %}

            return operatorBtn(arr, h);
          },
        },
        {% endif %}
      ],
    };
  },
  methods: {
    showErrorModal(row, type) {
    },
    init() {
      const params = {
        module: "{{fileName}}Api",
        api: "list",
        condition: this.condition,
        params: {},
      };
      this.$refs.PageSearchTable.params = params;
      this.$refs.PageSearchTable.dataTableShow();
    },
    beforeHandelSearchField(params) {

      {% for item in selectSearchList %}
        {% if item.multiple %}
          params.{{item.key}} = params.{{item.key}}.toString();
        {% endif %}

      {% endfor %}

      return params;
    },
    editInfo(row) {
      console.log(row);
      this.selectdata = [row];
      this.$refs.confirmDelModal.deleteconfirm = true;
    },
    openConfirmModal() {
      let selectdata = this.$refs.PageSearchTable.getSelectData();
      if (selectdata.length == 0) {
        this.$Message.warning("请选择一条数据");
        return false;
      }
      this.selectdata = selectdata;
      this.$refs.confirmDelModal.deleteconfirm = true;
    },
    deleteData() {
      let ids = this.selectdata.map((el) => el.id).toString();
      this.$refs.confirmDelModal.loadingsd = true;
      this.$api.declareReceiptApi
        .distribute({ ids })
        .then((res) => {
          const { result, infos, code, data } = res.data;
          this.$refs.confirmDelModal.deleteconfirm = false;
          this.$refs.confirmDelModal.loadingsd = false;
          if (code == "200") {
            this.$Message.success(infos);
              this.init();
            }else {
            this.$Message.error(infos);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSuccess() {
      this.$refs.PageSearchTable.dataTableShow("pagejump");
    },
    getDict() {
      let params = [
        {% for item in selectSearchList %}
          "{{item.key}}_Arr",
        {% endfor %}
      ]


      getApiAsync(params.toString()).then((res) => {

        {% for item in selectSearchList %}
          this.{{item.key}}_Arr = res[params[{{loop.index0}}]]
        {% endfor %}

      });
      // getApiDtAsync("tax_area").then((res) => {
      //   this.tax_area_Arr = res;
      // });
    },
  },
  mounted() {
    this.init();
    this.getDict();
  },
};
</script>
<style lang="scss" scoped></style>
