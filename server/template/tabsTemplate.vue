<template>
  <Tabs :animated="false" class="mx-3">
    {% for item in tabs %}
    <TabPane label="{{item.name}}" value="{{item.value}}"> <{{ item.value }} /> </TabPane>
    {% endfor %}
  </Tabs>
</template>

<script>
  {% for item in tabs %}
  import {{ item.value }} from "./{{item.value}}";{% endfor %}

  export default {
    name: "{{ fileName }}",
  components: {
    {% for item in tabs %} {{ item.value }}, {% endfor %}
  },
  data() {
    return {};
  },
  mounted() {
    // // 字典
    // getCommonDict(
    //   {
    //     codeArray: "COLLECT_STATUS,SOURCE_TYPE,COLLECT_TYPE,GTBT_TAX_TYPE",
    //   },
    //   (data) => {
    //     this.COLLECT_STATUS = data.COLLECT_STATUS;
    //     this.SOURCE_TYPE = data.SOURCE_TYPE;
    //     this.COLLECT_TYPE = data.COLLECT_TYPE;
    //     this.GTBT_TAX_TYPE = data.GTBT_TAX_TYPE;
    //   }
    // );
    // // 集团
    // this.$api.taxfilecollection.findOrgGroup().then((res) => {
    //   const { data, result } = res.data;
    //   if (result == "success") {
    //     this.ORGS = data;
    //   }
    // });
  },
};
</script>

<style></style>
