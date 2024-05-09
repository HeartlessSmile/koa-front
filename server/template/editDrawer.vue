<template>
  <Drawer :closable="true" :mask-closable="true" :title="title" :transfer="false" v-model="visible" width="80%">
    <div class="drawer-content">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <Row :gutter="20">
          <Col span="12">
            <FormItem prop="gtbtTemplateCode" label="底稿模板编号">
              <Input v-model="formValidate.gtbtTemplateCode" placeholder="请输入" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="gtbtTemplateName" label="底稿模板名称">
              <Input v-model="formValidate.gtbtTemplateName" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="applicableTaxCode" label="适用税费种">
              <Select
                v-model="formValidate.applicableTaxCode"
                placeholder="请选择"
                @on-change="applicableTaxCodeChange"
              >
                <Option v-for="(item, index) in BUSINESS_ITEM_SOURCE" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem prop="relReport" label="绑定申报表">
              <Select v-model="formValidate.relReport" placeholder="请选择" @on-change="relReportChange">
                <Option v-for="(item, index) in projectList" :key="index" :value="item.relReport"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12" v-if="showSfhzsb">
            <FormItem label="汇总申报">
              <!-- <Checkbox v-model="formValidate.sfhzsb">汇总申报</Checkbox> -->
              <RadioGroup v-model="formValidate.sfhzsb">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="12" v-if="showSfhzsb">
            <FormItem prop="zfjg" label="总分机构">
              <Select v-model="formValidate.zfjg" placeholder="请选择">
                <Option v-for="(item, index) in risk_indicator_strong_type" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="applicableTaxPerson" label="适用纳税人">
              <Select v-model="formValidate.applicableTaxPerson" placeholder="请选择">
                <Option v-for="(item, index) in risk_indicator_strong_type" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="businessScenario" label="业务场景">
              <Select v-model="formValidate.businessScenario" placeholder="请选择">
                <Option v-for="(item, index) in risk_indicator_feedback_type" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="applicableIndustry" label="适用行业">
              <Select v-model="formValidate.applicableIndustry" placeholder="请选择">
                <Option v-for="(item, index) in risk_indicator_strong_type" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="sydq" label="试用地区">
              <Select v-model="formValidate.sydq" placeholder="请选择">
                <Option v-for="(item, index) in risk_indicator_feedback_type" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="declarePeriod" label="申报周期">
              <Select v-model="formValidate.declarePeriod" placeholder="请选择">
                <Option v-for="(item, index) in risk_indicator_feedback_type" :key="index" :value="item.dictCode"></Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="模板简介" prop="mbjj">
              <Input v-model="formValidate.mbjj" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关键词">
              <Input v-model="formValidate.keyWords" placeholder="请输入"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="drawer-footer">
      <Button @click="handleCancel">取消</Button>
      <Button type="primary" :loading="loading" @click="handleSure">保存</Button>
    </div>
  </Drawer>
</template>
<script>
const defaultForm = {
  gtbtTemplateName: '',
  applicableTaxCode: '',
  relReport: '',
  applicableTaxPerson: '',
  businessScenario: '',
  applicableIndustry: '',
  sydq: '',
  declarePeriod: '',
  mbjj: ''
}

export default {
  name: 'edit-drawer',
  props: {
    BUSINESS_ITEM_SOURCE: {
      type: Array,
      default: () => []
    },
    risk_indicator_strong_type: {
      type: Array,
      default: () => []
    },
    risk_indicator_range_type: {
      type: Array,
      default: () => []
    },
    risk_indicator_feedback_type: {
      type: Array,
      default: () => []
    },
    areaList: {
      type: Array,
      default: () => []
    },
    getProjectDict: {
      type: Function,
      default: () => []
    }
  },
  components: { },
  data() {
    return {
      visible: false,
      loading: false,
      activeRow: {},
      projectList: [],
      projectSubList: [],
      formValidate: {
        ...defaultForm
      },
      ruleValidate: {
        gtbtTemplateName: [
          { required: true, message: '请输入底稿模板名称', trigger: 'blur' },
          { message: '最多允许输入100个字符', trigger: 'blur', max: 100 }
        ],
        applicableTaxCode: [{ required: true, message: '适用税费种不能为空', trigger: 'change' }],
        relReport: [{ required: true, message: '绑定申报表不能为空', trigger: 'change' }],
        applicableTaxPerson: [{ required: true, message: '适用纳税人不能为空', trigger: 'change' }],
        businessScenario: [{ required: true, message: '业务场景不能为空', trigger: 'change' }],
        applicableIndustry: [{ required: true, message: '适用行业不能为空', trigger: 'change' }],
        sydq: [{ required: true, message: '试用地区不能为空', trigger: 'change' }],
        declarePeriod: [{ required: true, message: '申报周期不能为空', trigger: 'change' }],
        mbjj: [{ required: true, message: '请输入底稿模板简介', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.activeRow && this.activeRow.id ? '编辑' : '新增'
    },
  },
  methods: {
    async applicableTaxCodeChange(value) {
      this.formValidate.relReport = ''
      this.formValidate.projectSubCode = ''
      this.projectList = []
      this.projectSubList = []
      const data = (await this.getProjectDict(value)) || []
      this.projectList = data
    },
    async relReportChange(value) {
      this.formValidate.projectSubCode = ''
      this.projectSubList = []
      this.getProjectSubList(value)
    },

    handleCancel() {
      this.visible = false
      this.activeRow = {}
    },
    handleSure() {
      this.$refs.formValidate.validate(async valid => {
        if (valid) {
          let res = null
          this.loading = true
          let params = {
            ...this.formValidate,
            taxArea: this.formValidate.taxArea.toString()
          }
          if (this.activeRow && this.activeRow.id) {
            res = await this.$api.dataCheckApi.edit(params)
          } else {
            res = await this.$api.dataCheckApi.add(params)
          }
          this.loading = false
          const { infos, code } = res.data
          if (code == 200) {
            this.$emit('success')
            this.visible = false
          } else {
            this.$Message.error(infos)
          }
        }
      })
    },
    async openDrawer(row) {
      this.visible = true
      this.activeRow = {}
      this.$refs.formValidate.resetFields()
      if (row) {
        this.activeRow = row
        this.formValidate = {
          ...row,
          applicableTaxCode: row.applicableTaxCode.toString(),
          zfjg: row.zfjg.toString(),
          applicableTaxPerson: row.applicableTaxPerson.toString(),
          businessScenario: row.businessScenario.toString(),
          taxArea: row.taxArea ? row.taxArea.split(',') : []
        }
        const data = (await this.getProjectDict(row.applicableTaxCode)) || []
        this.projectList = data
      } else {
        this.projectList = []
        this.formValidate = {
          ...defaultForm
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
