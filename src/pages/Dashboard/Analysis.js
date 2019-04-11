import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const TopSearch = React.lazy(() => import('./TopSearch'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      searchData,
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
              loading={loading}
              visitData2={visitData2}
              selectDate={this.selectDate}
              searchData={searchData}
            />
          </Suspense>
        </div>
      </GridContent>
    );
  }
}

export default Analysis;
