<style scoped>
.parm_check_element {
  width: 400px;
  margin-left: 10px;
}

.left20 {
  margin-left: 20px
}
</style>

<template>
  <div>
    <Card>
      <Row>
        <Col span="4">
        <Input search v-model="getParams.search" placeholder="业务类型名" @on-search="handleGetList" />
        </Col>

        <Col span="10">
        <center>
          <Button type="primary" icon="md-add" @click="createModal = true">创建</Button>
        </center>
        </Col>
      </Row>
      </br>
      <Row>
        <Col span="24">
        <Table :columns="columnsDataList" :data="dataList" size="small"></Table>
        </Col>
      </Row>
      </br>
      <Page :total=total show-sizer :current=getParams.page @on-change="pageChange" @on-page-size-change="sizeChange">
      </Page>

    </Card>
    <copyright> </copyright>

    <Spin size="large" fix v-if="spinShow"></Spin>

    <Modal v-model="createModal" width="500" title="创建业务类型" @on-ok="handleCreate" @on-cancel="cancel">
      <div>
        <Row>
          <Col span="22">
          <Form ref="createForm" :model="createForm" :rules="ruleForm" :label-width="100">
            <FormItem label="选择产品类型：">
              <Select v-model="createForm.idc">
                <Option v-for="item in idcList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="业务类型" prop="name">
              <Input v-model="createForm.name" placeholder="新业务"></Input>
            </FormItem>

            <FormItem label="选择地域：">
              <Select v-model="createForm.region">
                <Option v-for="item in regionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>

            <FormItem label="备注：" prop="remark">
              <Input v-model="createForm.remark" placeholder="备注"></Input>
            </FormItem>
          </Form>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="updateModal" width="500" title="修改业务类型" @on-ok="handleUpdate" @on-cancel="cancel">
      <div>
        <Row>
          <Col span="22">
          <Form ref="updateForm" :model="updateForm" :rules="ruleForm" :label-width="100">
            <FormItem label="产品类型：">
              <Select v-model="updateForm.idc">
                <Option v-for="item in idcList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="业务类型：" prop="name">
              <Input v-model="updateForm.name" placeholder="业务类型"></Input>
            </FormItem>

            <FormItem label="选择地域：">
              <Select v-model="updateForm.region">
                <Option v-for="item in regionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="备注：">
              <Input v-model="updateForm.remark"></Input>
            </FormItem>
          </Form>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="deleteModal" width="450" title="删除业务类型" @on-ok="handleDelete" @on-cancel="cancel">
      <div>
        <p>确认删除业务类型 {{ deleteData.name }} ?</p>
      </div>
    </Modal>

  </div>
</template>
<script>
import { Button, Message } from 'iview'
import copyright from '@/view/components/public/copyright.vue'
import { GetRackList, CreateRack, UpdateRack, DeleteRack } from '@/api/category/racks'
import { GetIdcList } from '@/api/category/idcs'
import { alertWarning } from '@/libs/view/common'
import { GetRegionList } from '@/api/category/regions'

export default {

  components: { copyright },

  data () {
    return {
      spinShow: false,
      deleteModal: false,
      createModal: false,
      updateModal: false,
      idc: '',
      region: '',
      search: '',
      idcList: [],
      dataList: [],
      regionList: [],
      deleteData: {
        id: '',
        name: ''
      },
      createForm: {
        idc: '',
        name: '',
        number: '',
        region: '',
        remark: ''
      },
      updateForm: {
        id: '',
        name: '',
        idc: '',
        number: '',
        region: '',
        remark: ''
      },
      ruleForm: {
        name: [{ required: true, message: '业务类型名不能为空', trigger: 'blur' }],
        // region: [{ required: true, message: '业务类型区域不能为空', trigger: 'blur' }]
      },
      columnsDataList: [
        {
          title: 'ID',
          width: 80,
          key: 'id',
          render: (h, params) => {
            return h('router-link', { props: { to: '/category/rack/' + params.row.id } }, params.row.id)
          }
        },
        {
          title: '业务类型',
          key: 'name'
        },
        {
          title: '所属产品',
          key: 'idc_name'
        },
        {
          title: '服务器数',
          width: 100,
          render: (h, params) => {
            let row = params.row
            return h('div', [h('span', { props: {} }, row.servers.length)])
          }
        },
        {
          title: '区域',
          key: 'region_name',
          width: 80
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(Button, {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    const row = params.row
                    this.updateModal = true
                    this.updateForm.id = row.id
                    this.updateForm.name = row.name
                    this.updateForm.idc = row.idc
                    this.updateForm.number = row.number
                    this.updateForm.region = row.region
                    this.updateForm.remark = row.remark
                  }
                }
              }, '修改'),
              h(Button, {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteModal = true
                    this.deleteData.id = params.row.id
                    this.deleteData.name = params.row.name
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      total: 1,
      getParams: {
        page: 1,
        pagesize: 10,
        search: ''
      },
      getMaxParams: {
        page: 1,
        pagesize: 1000,
        search: ''
      }
    }
  },
  created () {
    this.handleGetList()
    this.handleGetListIdcs()
    this.handleGetListRegion()
  },
  methods: {
    handleGetList () {
      GetRackList(this.getParams)
        .then(
          res => {
            this.dataList = res.data.results
            this.total = res.data.count
          }
        )
    },
    handleGetListIdcs () {
      GetIdcList(this.getMaxParams)
        .then(
          res => {
            this.idcList = res.data.results
          }
        )
    },
    handleGetListRegion () {
      GetRegionList(this.getMaxParams)
        .then(
          res => {
            this.regionList = res.data.results
          }
        )
    },
    pageChange (page) {
      this.getParams.page = page
      this.handleGetList()
    },
    sizeChange (size) {
      this.getParams.pagesize = size
      this.handleGetList()
    },
    handleCreate () {
      this.$refs.createForm.validate((valid) => {
        if (!valid) {
          return
        }
        let data = this.createForm
        CreateRack(data)
          .then(
            res => {
              this.handleGetList()
              alertWarning('create', this.$Notice, data.name)
            }
          )
      })
    },
    handleUpdate () {
      this.$refs.updateForm.validate((valid) => {
        if (!valid) {
          return
        }
        let id = this.updateForm.id
        let data = this.updateForm
        UpdateRack(id, data)
          .then(
            res => {
              this.handleGetList()
              alertWarning('update', this.$Notice, id)
            }
          )
      })
    },
    handleDelete () {
      let id = this.deleteData.id
      DeleteRack(id)
        .then(res => {
          this.handleGetList()
          alertWarning('delete', this.$Notice, id)
        })
    },
    cancel () {
      Message.info('操作取消')
    }
  }
}
</script>
