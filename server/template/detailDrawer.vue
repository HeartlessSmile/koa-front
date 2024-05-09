<template>
  <Drawer :closable="true" :mask-closable="true" title="查看" :transfer="false" v-model="visible" width="80%">
    <Row :gutter="20">
      <Col span="12">
        <FormItemText class="mb-24" label="指标编码">{{ activeRow.indicatorCode }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="指标名称">{{ activeRow.indicatorName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="项目类型">{{ activeRow.projectTypeName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="项目名称">{{ activeRow.projectName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="子项名称">{{ activeRow.projectSubName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="强弱类型">{{ activeRow.strongTypeName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="适用范围">{{ activeRow.rangeTypeName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="反馈类型">{{ activeRow.feedbackTypeName }}</FormItemText>
      </Col>
      <Col span="12">
        <FormItemText class="mb-24" label="指标描述">{{ activeRow.indicatorDesc }}</FormItemText>
      </Col>
    </Row>
  </Drawer>
</template>
<script>
import FormItemText from '@/components/component/FormItemText.vue'
export default {
  name: 'detail-drawer',
  components: { FormItemText },
  data() {
    return {
      visible: false,
      loading: false,
      activeRow: {}
    }
  },

  methods: {
    openDrawer(row) {
      this.visible = true
      this.activeRow = row
    }
  }
}
</script>
