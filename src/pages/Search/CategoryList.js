import React from 'react';
import axios from 'axios';
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
import  Description from '../Dashboard/Description'

const FormItem = Form.Item;

class CategoryList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // 所属学院下拉框
      categoryDown: [],
      // 文件类型下拉框
      fileTypeDown: [],
      descriptionShow: false,   // 控制资源详情页面是否显示
      currentValues: {}, // 弹框时传递的值
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true
      },
      expand: false, // 更多查询是否显示

    }
  }

  // 页面初次加载之前自动调用
  componentWillMount() {

    // 获取两个下拉框中的值
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
  componentDidMount() {
    this.queryAllList();
  }

  // 更改选中行的值
  changeValue = (values) => {
    // console.log('更改选中行的值',values)
    this.setState(
      { currentValues: values, descriptionShow: true }
    );
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

  // 页面点击cancel的回调
  handleCancel = () => {
    this.setState({
      descriptionShow: false,
      currentValues: {}
  });
  }

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
                    <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
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
                    <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
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
    const { pagination, categoryDown, fileTypeDown,descriptionShow ,currentValues} = this.state;
    const parentMethods = {
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
        title: '上传用户',
        dataIndex: 'userName',
        key: 'userNameKey',
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
    ]
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
                onRow={(record) => { // 行点击事件
                  return {
                    onClick: () => this.changeValue(record)
                  }
                }
                }
              />
              {
                descriptionShow ? (
                  <Description {...parentMethods} modalVisible={descriptionShow} values={currentValues} title='详情页' />) : null
              }
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryList: state.categoryList,
  loading: state.loading.models.categoryList,
});
export default connect(mapStateToProps)(Form.create()(CategoryList));

