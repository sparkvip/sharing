import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';
import Description from './Description';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const TopSearch = React.lazy(() => import('./TopSearch'));


@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      descriptionShow: false,   // 控制资源详情页面是否显示
      currentValues: {}, // 弹框时传递的值
    }
  }

  // 在渲染前调用
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/queryShowData',
    });
  }

  // 在第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });

  }

  // 在组件从 DOM 中移除之前立刻被调用。 
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  // 更改选中行的值
  changeValue = (values) => {
    // console.log('更改选中行的值',values)
    this.setState(
      { currentValues: values, descriptionShow: true }
    );
  }

  // 页面点击cancel的回调
  handleCancel = () => {
    this.setState({
      descriptionShow: false,
      currentValues: {}
  });
  }

  render() {
    const { chart, loading } = this.props;
    const { descriptionShow, currentValues } = this.state
    const parentMethods = {
      handleOk: this.handleOk,
      handleCancel: this.handleCancel,
    };
    const {
      visitData,
      showData
    } = chart;

    return (
      <GridContent>
        {/*  顶部总流量的3个显示框 */}
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={visitData} />
        </Suspense>

        {/* 资源推荐 */}
        <div className={styles.twoColLayout}>
          <Suspense fallback={null}>
            <TopSearch
              changeValue={this.changeValue}
              loading={loading}
              searchData={showData}
            />
          </Suspense>
        </div>
        {
          descriptionShow ? (
            <Description {...parentMethods} modalVisible={descriptionShow} values={currentValues} title='详情页' />) : null
        }
      </GridContent>
    )
  }
}

export default Analysis;
