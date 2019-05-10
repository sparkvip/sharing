import React, { PureComponent } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  Upload,
  message,
  Icon,
  Select,
  Button,
  Card,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Dragger } = Upload;
const userId = localStorage.getItem("userId");


@connect(({ downlist }) => ({
  downlist: downlist.list,
}))
@Form.create()
class BasicForms extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryDown: [],
      fileTypeDown: []
    }
  }

  // 页面初次加载之前自动调用
  componentWillMount() {
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

  // 点击提交按钮触发的事件
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      // 遍历去除文件名称，存放在数组集合中
      const fileNameArray = values.file.fileList.map((v) => { return v.name; });
      const fileName = fileNameArray && fileNameArray[0];
      // 将file属性制空,path接受文件名称[文件名称用分号隔开]
      const params = { ...values, file: null, name: fileName, path: fileName, userId }
      if (!err) {
        const option = {
          url: `/api/resource/insert`,
          method: 'post',
          params,
        };
        axios(option).then(() => {
          message.success('提交成功!');
          // 提交成功进行表单重置
          form.resetFields();
        }).catch(error => {
          message.error('提交失败!');
          message.error(error.message);
        })
      }
    });
  };

  render() {
    const { categoryDown, fileTypeDown } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    // 上传按钮的属性对象
    const uploadProps = {
      name: 'file',
      multiple: true, // 是否支持多文件上传
      action: `/api/file/upload?userId=${userId}`,
      headers: {
        authorization: 'authorization-text',
      },
      date: { userId },
      onChange(info) {
        // console.log('info.file', info.file)
        // 上传之前调用两次
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        // 后台返回数据时调用
        if (info.file.status === 'done') {
          if (info.file.response === 'success') {
            message.success(`${info.file.name} 文件上传成功`);
            return;
          }
          message.error(`${info.file.name} ${info.file.response}`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
        }
      },
    };

    return (
      <PageHeaderWrapper
        title='资源上传'
        content='1、填写资源相关信息 2、选择资源文件 3、进行上传'
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            {/* <FormItem {...formItemLayout} label='资源名称'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '资源名称为必输项',
                  },
                ],
              })(<Input placeholder='资源名称' />)}
            </FormItem> */}
            <FormItem {...formItemLayout} label='资源分类'>
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '资源分类为必选项',
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {categoryDown ? categoryDown.map(item => (
                    <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                  )) : null}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='资源描述'>
              {getFieldDecorator('introduction')(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='选择文件'>
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                    message: '文件为必选项',
                  },
                ],
              })(
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件至此进行上传</p>
                </Dragger>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='文件类型'>
              {getFieldDecorator('fileType', {
                rules: [
                  {
                    required: true,
                    message: '文件类型为必选项',
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {fileTypeDown ? fileTypeDown.map(item => (
                    <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                  )) : null}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='是否加入推荐'
              help='是否会展现在推荐页中，需要管理员审核。'
            >
              <div>
                {getFieldDecorator('isShared', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      是
                    </Radio>
                    <Radio value="0">
                      否
                    </Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='是否公开'
            >
              <div>
                {getFieldDecorator('attribute2', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      是
                    </Radio>
                    <Radio value="0">
                      否
                    </Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
