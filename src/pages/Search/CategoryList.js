import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Card,
  Alert,
  Dropdown,
  Menu,
  message,
  Checkbox,
  Select,
  Icon
} from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './CategoryList.less';

const FormItem = Form.Item;
const categoryConst = [{ key: 1, code: 'computer', name: '计算机' }, { key: 2, code: 'INVOKEMETHOD', name: '反射调用类方法' },
{ key: 3, code: 'SYSTEMCOMMAND', name: 'SHELL脚本命令' }, { key: 4, code: 'BATCOMMAND', name: 'BAT脚本命令' },
{ key: 5, code: 'TASKSQL', name: 'SQL语句' }]

class CategoryList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        total: 0,
        page: 0,
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true
      },
      formValues: {}, //条件查询传值对象
      expand: false, // 更多查询是否显示
      columns: [
        {
          title: '资源名称',
          dataIndex: 'name',
          key: 'nameKey',
        },
        {
          title: '所属类别',
          dataIndex: 'category',
          key: 'categoryKey',
        },
        {
          title: '上传用户',
          dataIndex: 'userName',
          key: 'userNameKey',
        },
        {
          title: '文件类型',
          dataIndex: 'fileType',
          key: 'fileTypeKey',
        },
      ]
    }
  }

  // 页面初次加载完成时自动调用
  componentDidMount() {
    this.queryList();
  }
  
  // 初始化时查询
  queryList = () => {
    this.props.dispatch({
      type: 'categoryList/queryList',
    });
  };

  //更多查询
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  // form表单查询
  handleSearch = (e) => {
    e.preventDefault();
    const { form: { validateFields } } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        formValues: values,
      });
      this.queryList();
    });

  };

  // form表单重置
  handleFormReset = (e) => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.queryList();
  };

  // 查询框
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { expand } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={18}>
          <Col span={6}>
            <FormItem label="所属类别">
              {getFieldDecorator('category')(
               <Select placeholder="请选择" style={{ width: '100%' }}>
                  {categoryConst.map(item => (
                    <Select.Option key={item.key} value={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="上传用户">
              {getFieldDecorator('userName')(
                // <Select placeholder="请选择" style={{ width: '100%' }}>
                //   {taskTypeConst.map(item => (
                //     <Select.Option key={item.key} value={item.code}>{item.name}</Select.Option>
                //   ))}
                // </Select>
                <Input placeholder="请输入" />
              )}
            </FormItem>

          </Col>
          <Col span={12}>
            <Button type="primary" htmlType="submit">
              查询
                        </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
                        </Button>
            <Button style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              更多查询 <Icon type={expand ? 'up' : 'down'} />
            </Button>
          </Col>
        </Row>
        <Row gutter={18} style={{ display: expand ? 'inline' : 'none' }}>
          <Col span={6}>
            <FormItem label="文件类型">
              {getFieldDecorator('fileType')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {

    const { categoryList: { data }, loading } = this.props

    const { selectedRowKeys ,selectedRows, pagination, columns } = this.state;

    const parentMethods = {
      handleOk: this.handleOk,
      handleCancel: this.handleCancel,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Table
                style={{ align: 'center' }}
                pagination={pagination}
                loading={loading}
                dataSource={data}
                columns={columns}
              />
            </div>
          </div>
        </Card>
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  categoryList: state.categoryList,
  loading: state.loading.models.categoryList,
});
export default connect(mapStateToProps)(Form.create()(CategoryList));

