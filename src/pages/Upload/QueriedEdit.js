/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import {
  Modal,
  Input,
  Form,
  Button,
  Radio,
  Select,
} from 'antd';
import axios from 'axios';
import { connect } from 'dva';


// context设置页面中新增和编辑的弹窗
@Form.create()
@connect(({ chart }) => ({
  chart,
}))
class QueriedEdit extends React.Component {
  constructor(props) {
    super(props);
    const { values } = props;
    this.state = {
      values,
      categoryDown: [],
      fileTypeDown: [],
      showIsShare: false
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

  // 更改是否私有选项
  changeAttribute = (e) => {
    if (e.target.value && e.target.value === '0') {
      this.setState({
        showIsShare: true
      })
    } else {
      this.setState({
        showIsShare: false
      })
    }
  }

  // 文件下载
  downloadFile = () => {
    const { values: localValue } = this.state;
    // console.log('localValue',localValue);

    // 可以根据需求传特定的一些参数
    const downloadUrl = '/api/file/download';
    fetch(downloadUrl, {
      method: 'POST',
      body: window.JSON.stringify(localValue),
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((response) => {
      response.blob().then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        // 不能直接创建一个<a>标签
        // const a = document.createElement('a_id');
        const a = document.getElementById('a_id');
        // 无法从返回的文件流中获取文件名
        // let filename = response.headers.get('Content-Disposition');
        const filename = localValue.path;
        a.href = blobUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      });
    }).catch((error) => {
      console.log(error);
    });

  }

  // 点击确认按钮触发的事件
  okHandle = () => {
    const { form, handleOk } = this.props;
    const { values: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const formVals = { ...oldValue, ...fieldsValue };
      handleOk(formVals);
    });
  };

  render() {
    const { modalVisible, form: { getFieldDecorator }, handleCancel, title } = this.props;
    const { values, categoryDown, fileTypeDown, showIsShare } = this.state;
    return (
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={handleCancel}
        width={700}
      >
        <Form>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源名称'>
            {getFieldDecorator('name', {
              initialValue: values.name
            })(
              <Input style={{ color: 'black' }} />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源分类'>
            {getFieldDecorator('category', {
              initialValue: values.category
            })(
              <Select placeholder="请选择">
                {categoryDown ? categoryDown.map(item => (
                  <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                )) : null}
              </Select>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源描述'>
            {getFieldDecorator('introduction', {
              initialValue: values.introduction
            })(
              <Input.TextArea style={{ color: 'black', minHeight: 52 }} rows={4} />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='文件类型'>
            {getFieldDecorator('fileType', {
              initialValue: values.fileType
            })(
              <Select placeholder="请选择">
                {fileTypeDown ? fileTypeDown.map(item => (
                  <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                )) : null}
              </Select>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='上传用户'>
            {getFieldDecorator('userName', {
              initialValue: values.userName
            })(
              <Input style={{ color: 'black' }} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='上传时间'>
            {getFieldDecorator('uploadTime', {
              initialValue: values.uploadTime
            })(
              <Input style={{ color: 'black' }} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='是否公开'>
            {getFieldDecorator('attribute2', {
              initialValue: values.attribute2
            })(
              <Radio.Group disabled='true' onChange={this.changeAttribute}>
                <Radio value="1">
                  是
                </Radio>
                <Radio value="0">
                  否
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='是否加入推荐'>
            {getFieldDecorator('isShared', {
              initialValue: values.isShared
            })(
              // <Radio.Group disabled={showIsShare}>
              <Radio.Group disabled='true'>
                <Radio value="1">
                  是
                </Radio>
                <Radio value="0">
                  否
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item style={{ marginLeft: '250px' }} labelCol={{ span: 12 }} wrapperCol={{ span: 15 }}>
            <Button type="primary" icon="download" onClick={this.downloadFile}>下载</Button>
          </Form.Item>
        </Form>
        <a id='a_id' />
      </Modal>
    );
  }
}
export default (Form.create()(QueriedEdit));