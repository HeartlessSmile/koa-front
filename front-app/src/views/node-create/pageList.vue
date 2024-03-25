<template>
  <el-card class="box-card" header="表格搜索项">
    <el-table :data="searchTableData" stripe style="width: 100%" :editable="true" border>
      <el-table-column label="数据类型" width="140" align="center">
        <template #default="scope">
          <el-select v-model="scope.row.type" class="m-2">
            <el-option label="下拉框" value="select" />
            <el-option label="搜索框" value="input" />
            <el-option label="日期" value="date" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="key名称" align="center" width="200">
        <template #default="scope">
          <el-input type="text" v-model.trim="scope.row.key" class="ipt" />
        </template>
      </el-table-column>
      <el-table-column label="label名称" width="200" align="center">
        <template #default="scope">
          <el-input type="text" v-model.trim="scope.row.label" class="ipt" />
        </template>
      </el-table-column>
      <el-table-column label="placeholder" width="200" align="center">
        <template #default="scope">
          <el-input type="text" v-model.trim="scope.row.placeholder" class="ipt" />
        </template>
      </el-table-column>

      <el-table-column label="额外配置区" align="center" minWidth="100">
        <template #default="scope">
          <template v-if="scope.row.type == 'select'">
            <el-checkbox v-model="scope.row.label_hh" label="label_hh" />
            <el-checkbox v-model="scope.row.clearable" label="clearable" />
            <el-checkbox v-model="scope.row.filterable" label="filterable" />
            <el-checkbox v-model="scope.row.multiple" label="multiple" />
          </template>
          <template v-if="scope.row.type == 'date'">
            <el-radio-group v-model="scope.row.dateType">
              <el-radio
                :label="item"
                v-for="item in ['date', 'daterange', 'datetime', 'datetimerange', 'year', 'month', 'monthrange']"
                :key="item"
                >{{ item }}</el-radio
              >
            </el-radio-group>
            <br />
            <el-checkbox v-model="scope.row.label_hh" label="label_hh" />
            <el-checkbox v-model="scope.row.clearable" label="clearable" />
          </template>
          <template v-if="scope.row.type == 'input'">
            <el-checkbox v-model="scope.row.label_hh" label="label_hh" />
            <el-checkbox v-model="scope.row.clearable" label="clearable" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button @click="handelClick(scope.$index, scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 8px 0">
      <el-button type="primary" @click="addSearchItem('input')">添加input</el-button>
      <el-button type="primary" @click="addSearchItem('select')">添加select</el-button>
      <el-button type="primary" @click="addSearchItem('date')">添加date</el-button>
      <el-button type="danger" @click="clear('search')">清空</el-button>
    </div>
    <div style="width: 100%">
      <el-input
        type="textarea"
        style="width: 70%; margin-top: 16px; margin-right: 16px"
        v-model="moreSearchText"
      ></el-input>
      <el-button @click="addSearchMore">多个添加,隔开</el-button>
    </div>
  </el-card>

  <!-- <div>
    <p style="text-align: center; margin: 8px; color: red">操作工作栏</p>
  </div> -->

  <el-card class="box-card" header="表格列表项" style="margin-top: 16px">
    <el-table :data="columnTableData" stripe style="width: 100%" :editable="true" border>
      <!-- <el-table-column label="" width="140" align="center">
          <template #default="scope"> </template>
        </el-table-column> -->
      <el-table-column label="title" align="center" minWidth="200">
        <template #default="scope">
          <el-input type="text" v-model.trim="scope.row.title" class="ipt" />
        </template>
      </el-table-column>
      <el-table-column label="key" minWidth="200" align="center">
        <template #default="scope">
          <el-input type="text" v-model.trim="scope.row.key" class="ipt" />
        </template>
      </el-table-column>
      <el-table-column label="width" width="150" align="center">
        <template #default="scope">
          <el-input type="text" v-model.trim="scope.row.width" class="ipt" />
        </template>
      </el-table-column>
      <el-table-column label="是否是字典" width="150" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.isDict" />
        </template>
      </el-table-column>
      <el-table-column label="是否是render" width="150" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.isRender" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button @click="addTableItem(scope.$index, scope.row)" type="primary">添加</el-button>
          <el-button @click="delTableItem(scope.$index, scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-checkbox v-model="isMultipleTable" label="是否是多选表格" />
      <el-button type="primary" style="margin-left: 8px" @click="addTableItem">添加</el-button>
      <el-button type="danger" @click="clear('column')">清空</el-button>
    </div>
    <el-input type="textarea" style="width: 70%; margin: 16px 16px 0 0" v-model="moreText"></el-input>
    <el-button @click="addColumnMore">多个添加,隔开</el-button>
  </el-card>

  <el-card class="box-card" header="表格工具栏" style="margin-top: 16px">
    <div class="flex gap-2">
      <el-tag v-for="tag in tableSetList" :key="tag" closable :disable-transitions="false" @close="TableSetClose(tag)">
        {{ tag }}
      </el-tag>
      <el-input
        v-if="TableSetVisible"
        ref="TableSetInputRef"
        v-model="tableSetValue"
        class="w-20"
        size="small"
        @keyup.enter="handleAddTableSet"
        @blur="handleAddTableSet"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showTableSetInput"> + 新建 </el-button>
    </div>
  </el-card>
  <el-card class="box-card" header="表格操作栏" style="margin-top: 16px">
    <div class="flex gap-2">
      <el-tag
        v-for="tag in tableItemSetList"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="TableItemSetClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="TableItemSetVisible"
        ref="TableItemSetInputRef"
        v-model="tableItemSetValue"
        class="w-20"
        size="small"
        @keyup.enter="handleAddTableItemSet"
        @blur="handleAddTableItemSet"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showTableItemSetInput"> + 新建 </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
const tableSetValue = ref('')
const TableSetVisible = ref(false)
const TableSetInputRef = ref(null)
const tableSetList = ref([])

const tableItemSetValue = ref('')
const TableItemSetVisible = ref(false)
const TableItemSetInputRef = ref(null)
const tableItemSetList = ref([])
let columnItem = {
  title: '',
  key: '',
  width: 150,
  isDict: false,
  isRender: false,
  ellipsis: true,
  tooltip: true,
  resizable: true,
}
const moreText = ref(' ')
const moreSearchText = ref('')
const isMultipleTable = ref(false)

const searchTableData = ref([
  {
    type: 'select',
    key: '',
    label: '',
    placeholder: '',
    label_hh: false,
    clearable: true,
    filterable: true,
    multiple: false,
    dateType: 'date',
  },
])
const columnTableData = ref([])

const TableSetClose = (tag) => {
  tableSetList.value.splice(tableSetList.value.indexOf(tag), 1)
}
const showTableSetInput = () => {
  TableSetVisible.value = true
  nextTick(() => {
    TableSetInputRef.value.input.focus()
  })
}
const handleAddTableSet = () => {
  if (tableSetValue.value) {
    tableSetList.value.push(tableSetValue.value)
  }
  TableSetVisible.value = false
  tableSetValue.value = ''
}

const TableItemSetClose = (tag) => {
  tableItemSetList.value.splice(tableItemSetList.value.indexOf(tag), 1)
}

const showTableItemSetInput = () => {
  TableItemSetVisible.value = true
  nextTick(() => {
    TableItemSetInputRef.value.input.focus()
  })
}
const handleAddTableItemSet = () => {
  if (tableItemSetValue.value) {
    tableItemSetList.value.push(tableItemSetValue.value)
  }
  TableItemSetVisible.value = false
  tableItemSetValue.value = ''
}

const handleCloseSearch = (tag) => {
  searchTableData.value.splice(searchTableData.value.indexOf(tag), 1)
}

const addSearchItem = (type) => {
  searchTableData.value.push({
    type,
    key: '',
    label: '',
    placeholder: '',
    label_hh: false,
    clearable: true,
    filterable: true,
    multiple: false,
    dateType: 'date',
  })
}
const delSearchItem = (index, row) => {
  searchTableData.value.splice(index, 1)
}
const addSearchMore = () => {
  let str = moreSearchText.value
    .split('\n')
    .filter((el) => el)
    .toString()
    .split('\t')
    .filter((el) => el)
    .toString()
  const text = str.replaceAll('，', ',')
  moreSearchText.value = text
  if (text) {
    let arr = text.split(',').filter((el) => el)
    arr = arr.map((el) => {
      return {
        type: 'input',
        key: '',
        label: el.trim(),
        placeholder: '',
        label_hh: false,
        clearable: true,
        filterable: true,
        multiple: false,
        dateType: 'date',
      }
    })
    searchTableData.value.push(...arr)
  }
}

const addColumnMore = () => {
  let str = moreText.value
    .split('\n')
    .filter((el) => el)
    .toString()
    .split('\t')
    .filter((el) => el)
    .toString()

  const text = str.replaceAll('，', ',')
  moreText.value = text
  if (text) {
    let arr = text.split(',').filter((el) => el)
    arr = arr.map((el) => {
      return { ...columnItem, title: el.trim() }
    })
    columnTableData.value.push(...arr)
  }
}

const delTableItem = (index, row) => {
  columnTableData.value.splice(index, 1)
}

const handelClick = (index, row) => {
  searchTableData.value.splice(index, 1)
}
const addTableItem = (index, row) => {
  if (!index) {
    columnTableData.value.push({ ...columnItem })
  } else {
    columnTableData.value.splice(index + 1, 0, { ...columnItem })
  }
}
const clear = (type) => {
  if (type === 'search') {
    searchTableData.value = []
  } else {
    columnTableData.value = []
  }
}

defineExpose({
  isMultipleTable: isMultipleTable,
  searchTableData: searchTableData,
  columnTableData: columnTableData,
  tableSetList: tableSetList,
  tableItemSetList: tableItemSetList,
})

onMounted(() => {})
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  gap: 10px;
}
.w-20 {
  width: 20em;
}
</style>
