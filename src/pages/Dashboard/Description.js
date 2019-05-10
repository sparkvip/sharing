/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import {
  Modal,
  Input,
  Form,
  Button,
  Select,
  Rate,
  Icon,
  Avatar,
  Comment, Tooltip, List
} from 'antd';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'dva';

const { TextArea } = Input;
const localUserName = localStorage.getItem("userName");


const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({
  onChange, onSubmit, submitting, value,
}) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
          Add Comment
      </Button>
    </Form.Item>
  </div>
  );

// context设置页面中新增和编辑的弹窗
@Form.create()
@connect(({ chart }) => ({
  chart,
}))
class Description extends React.Component {
  constructor(props) {
    super(props);
    const { values } = props;
    this.state = {
      comments: [
      //   {
      //   author: '李锦',
      //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      //   content: '这个资源真不错',
      //   datetime: '2019-5-10',
      // },
    ],
      submitting: false,
      value: '',
      values,
      // 所属学院下拉框
      categoryDown: [],
      // 文件类型下拉框
      fileTypeDown: [],
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

    // 查询评论
    const option2 = {
      url: '/api/comment/query',
      method: 'POST',
      params:{id:this.state.values.id},
    }
    axios(option2).then(res => {
      console.log('res',res);
      this.setState({
        comments: res.data,
      })
      console.log('state',this.state);
    })
  }

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });
    const comment = {
      author: localUserName,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content: this.state.value,
      datetime: moment().fromNow(),
    }
    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [
          comment,
          ...this.state.comments,
        ],
      });
    }, 300);
    console.log('comment',{...comment,datetime: null,resourceId:this.state.values.id})

    // 上传评论
    const option = {
      url: '/api/comment/insert',
      method: 'POST',
      params:{...comment,datetime: null,resourceId:this.state.values.id},
    }
    axios(option).then(res => {
      console.log(res.data);
      })
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
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


  render() {
    const { modalVisible, form: { getFieldDecorator }, handleCancel, title } = this.props;
    const { values, fileTypeDown, categoryDown, comments, submitting, value } = this.state;
    console.log('commentsc',comments)
  
    return (
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={700}
      >
        <Form>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源名称'>
            {getFieldDecorator('name', {
              initialValue: values.name
            })(
              <Input style={{ color: 'black' }} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源分类'>
            {getFieldDecorator('category', {
              initialValue: values.category
            })(
              <Select placeholder="请选择" style={{ width: '100%', color: 'black' }} disabled='true'>
                {categoryDown.map(item => (
                  <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源描述'>
            {getFieldDecorator('introduction', {
              initialValue: values.introduction
            })(
              <Input.TextArea style={{ color: 'black' }} rows={4} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='文件类型'>
            {getFieldDecorator('fileType', {
              initialValue: values.fileType
            })(
              <Select placeholder="请选择" disabled='true' style={{ width: '100%', color: 'black' }}>
                {fileTypeDown.map(item => (
                  <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                ))}
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
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='评分'>
            {getFieldDecorator('attribute1', {
              initialValue: values.attribute1
            })(
              <Rate />
            )}
          </Form.Item>
          <Form.Item style={{ marginLeft: '250px' }} labelCol={{ span: 12 }} wrapperCol={{ span: 15 }}>
            <Button type="primary" icon="download" onClick={this.downloadFile}>下载</Button>
          </Form.Item>
        </Form>
        <a id='a_id' />
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={(
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          )}
          content={(
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          )}
        />
      </Modal>
    );
  }
}
export default (Form.create()(Description));