import React from 'react';
import { connect } from 'dva';
import {
  Table,
  Row,
  Col,
  Button,
  Form,
  Input,
  Card,
  Select,
  Icon
} from 'antd';
import styles from './CategoryList.less';

const FormItem = Form.Item;

class CategoryList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true
      },
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

  // 页面初次加载之前自动调用
  componentWillMount() {
    const { downlist: { category, fileType } } = this.props;
    this.setState({
      categoryDown: category,
      fileTypeDown: fileType,
    })
  }

  // 页面初次加载完成时自动调用
  componentDidMount() {
    this.queryAllList();
  }

  // 条件查询
  queryList = (formValues) => {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/queryList',
      payload: formValues,
    });
  };

  // 初始化时查询
  queryAllList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'categoryList/queryList',
    });
  };

  // 更多查询
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
      this.queryList(values);
    });

  };

  // form表单重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.queryAllList();
  };

  // 查询框
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { expand, categoryDown, fileTypeDown } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={18}>
          <Col span={6}>
            <FormItem label="所属类别">
              {getFieldDecorator('category')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {categoryDown.map(item => (
                    <Select.Option key={item.key} value={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="上传用户">
              {getFieldDecorator('userName')(
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
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {fileTypeDown.map(item => (
                    <Select.Option key={item.key} value={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { categoryList: { data }, loading } = this.props
    const { pagination, columns } = this.state;
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryList: state.categoryList,
  downlist: state.downlist.list,
  loading: state.loading.models.categoryList,
});
export default connect(mapStateToProps)(Form.create()(CategoryList));

