import React, { Fragment } from 'react';
import axios from 'axios';
import { connect } from 'dva';
import {
  Table,
  Button,
  Form,
  Card,
  Alert,
} from 'antd';
import styles from './style.less';
import QueriedEdit from './QueriedEdit'

const userId = localStorage.getItem("userId");

class Queried extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // 所属学院下拉框
      categoryDown: [],
      // 文件类型下拉框
      fileTypeDown: [],
      selectedRows: [],
      selectedRowKeys: [],
      updateVisible: false,  // 控制编辑按钮弹框是否显示
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true
      },
    }
  }

  // 页面初次加载之前自动调用
  componentWillMount() {
    // 获取我的资源列表
    this.queryList();
    // 获取两个下拉框中的值
    this.queryCombox();
  }

  // 获取两个下拉框中的值
  queryCombox = () => {
    let option = {
      url: '/api/code/query',
      method: 'POST',
      params: { code: 'category' },
    }
    axios(option).then(res => {
      this.setState({
        categoryDown: res.data,
      })
    }).catch(err => {
      console.log('err', err)
    })
    option = { ...option, params: { code: 'fileType' } }
    axios(option).then(res => {
      this.setState({
        fileTypeDown: res.data,
      })
    }).catch(err => {
      console.log('err', err)
    })
  }
  // 页面初次加载完成时自动调用
  // componentDidMount() {
  //   this.queryList();
  // }

  // 查询当前用户已上传的资源
  queryList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'aduit/queryList',
      payload: { userId },
    });
  };

  // 编辑按钮触发事件
  handleUpdate = (record) => {
    this.setState({
      currentValues: record || {},
      updateVisible: true,
    });
  };

  // 勾选变更触发事件
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 审批同意
  agree = () => {

    this.setState({ buttonLoading: true });

    const { selectedRows } = this.state;
    console.log('{ data: selectedRows, userId }',{ data: selectedRows, userId });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'aduit/agree',
      payload: { data: selectedRows, userId }
    })
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
      buttonLoading: false
    });
  }

  // 审批拒绝
  reject = () => {
    this.setState({ buttonLoading: true });

    const { selectedRows } = this.state;

    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'aduit/reject',
      payload: { data: selectedRows, userId }
    })
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
      buttonLoading: false
    });
  }

  // 编辑页面点击ok的回调
  handleOk = () => {
    // eslint-disable-next-line react/destructuring-assignment
    // this.props.dispatch({
    //   type: 'aduit/update',
    //   payload: fields,
    // });
    // this.setState({
    //   updateVisible: false,
    //   currentValues: {}
    // });
  };

  // 新建或编辑页面点击cancel的回调
  handleCancel = () => {
    this.setState({
      updateVisible: false,
      currentValues: {}
    });
  }

  // 清除勾选的行
  cleanSelectedKeys = () => {
    this.setState({
      selectedRows: [],
      selectedRowKeys: []
    });
  }

  render() {
    const { categoryList: { data }, loading } = this.props
    const { pagination, categoryDown, fileTypeDown, selectedRows, selectedRowKeys, buttonLoading, updateVisible, currentValues } = this.state;
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: this.onSelectChange,
    };
    const parentMethods = {
      handleOk: this.handleOk,
      handleCancel: this.handleCancel,
    };
    const columns = [
      {
        title: '资源名称',
        dataIndex: 'name',
        key: 'nameKey',
        align: 'center',
      },
      {
        title: '所属类别',
        dataIndex: 'category',
        render: text => {
          const temp = categoryDown.filter(item => {
            return item.code === text
          })
          return temp[0] && temp[0].name
        },
        align: 'center',
      },
      {
        title: '文件类型',
        dataIndex: 'fileType',
        key: 'fileTypeKey',
        render: text => {
          const temp = fileTypeDown.filter(item => {
            return item.code === text
          })
          return temp[0] && temp[0].name
        },
        align: 'center',
      },
      {
        title: '下载量',
        dataIndex: 'downloadAmount',
        key: 'downloadAmountKey',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <a onClick={() => this.handleUpdate(record)}>查看</a>
        ),
      },
    ]
    return (
      <div>
        <Card
          title="我的审批列表"
        >
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <div className={styles.tableButton}>
                {selectedRows.length > 0 && (
                  <div>
                    <span>
                      <Button icon='check' type="primary" onClick={this.agree} loading={buttonLoading}>同意</Button>
                    </span>
                    <span>
                      <Button icon='close' type="danger" onClick={this.reject} loading={buttonLoading}>拒绝</Button>
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.tableAlert}>
                <Alert
                  message={
                    <Fragment>
                      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                      <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
                    </Fragment>
                  }
                  type="info"
                  showIcon
                />
              </div>
              <Table
                style={{ align: 'center' }}
                pagination={pagination}
                loading={loading}
                rowSelection={rowSelection}
                dataSource={data}
                columns={columns}
              />
              {
                updateVisible ? (
                  <QueriedEdit {...parentMethods} modalVisible={updateVisible} values={currentValues} />) : null
              }
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  categoryList: state.aduit,
  loading: state.loading.models.aduit,
});
export default connect(mapStateToProps)(Form.create()(Queried));

