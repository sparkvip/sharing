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

const userId = localStorage.getItem("userId");

class Apply extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // 所属学院下拉框
      categoryDown: [],
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true
      },
    }
  }

  // 页面初次加载之前自动调用
  componentWillMount() {
    // 获取列表
    this.queryList();
    // 获取下拉框中的值
    this.queryCombox();
  }

  // 获取两个下拉框中的值
  queryCombox = () => {
    const option = {
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
  }


  // 查询当前用户已上传的资源
  queryList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'friend/queryFriend',
      payload: { userId },
    });
  };

  // 勾选变更触发事件
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 删除
  delete = () => {
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



  // 清除勾选的行
  cleanSelectedKeys = () => {
    this.setState({
      selectedRows: [],
      selectedRowKeys: []
    });
  }

  render() {
    const { categoryList: { data }, loading } = this.props
    const { pagination, categoryDown, selectedRows, selectedRowKeys, buttonLoading } = this.state;
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'nameKey',
        align: 'center',
      },
      {
        title: '所属学院',
        dataIndex: 'insititute',
        key: 'insitituteKey',
        render: text => {
          const temp = categoryDown.filter(item => {
            return item.code === text
          })
          return temp[0] && temp[0].name
        },
        align: 'center',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phoneKey',
        align: 'center',
      },
    ]
    return (
      <div>
        <Card
          title="我的好友列表"
        >
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <div className={styles.tableButton}>
                {selectedRows.length > 0 && (
                  <div>
                    <span>
                      <Button icon='close' type="danger" onClick={this.delete} loading={buttonLoading}>删除好友</Button>
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
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  categoryList: state.friend,
  loading: state.loading.models.friend,
});
export default connect(mapStateToProps)(Form.create()(Apply));

