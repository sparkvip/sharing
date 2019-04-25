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
const baseUrl = 'http://localhost:8081/';

@connect(({ downlist }) => ({
  downlist: downlist.list,
}))
@Form.create()
class BasicForms extends PureComponent {


  // 页面初次加载之前自动调用
  componentWillMount() {
    const { downlist: { category } } = this.props;
    this.setState({
      categoryDown: category,
    })
  }

  // 点击提交按钮触发的事件
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log('values', values)
      if (!err) {
        const option = {
          url: `/api/resource/insert`,
          method: 'post',
          params: values,
        };
        axios(option).then((res) => {
          message.success('提交成功!');
          console.log("res:", res)
        }).catch(error => {
          message.error('提交失败!');
          message.error(error.message);
        })
      }
    });
  };

  render() {
    const { categoryDown } = this.state;
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
      multiple: true,
      action: `/api/user/test`,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        // console.log('action',info)
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
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
            <FormItem {...formItemLayout} label='资源名称'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '资源名称为必输项',
                  },
                ],
              })(<Input placeholder='资源名称' />)}
            </FormItem>
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
                  {categoryDown.map(item => (
                    <Select.Option key={item.key} value={item.code}>{item.name}</Select.Option>
                  ))}
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
              {getFieldDecorator('file')(
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件至此进行上传</p>
                  <p className="ant-upload-hint">支持单个或批量上传！</p>
                </Dragger>
                // <Upload {...uploadProps}>
                //   <Button>
                //     <Icon type="upload" /> 点击上传
                //   </Button>
                // </Upload>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='是否加入推荐'
              help='是否会展现在推荐页中，需要管理员审核。'
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      是
                    </Radio>
                    <Radio value="2">
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
