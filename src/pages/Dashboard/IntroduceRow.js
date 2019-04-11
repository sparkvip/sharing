/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: { marginBottom: 24 },
};
// 顶部总下载量、访问量、上传量的3个框
const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title='总下载量'
        action={
          <Tooltip
            title='所有用户下载的资源总量'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => <div>153793</div>}
        footer={
          <Field
            label='日下载量'
            value={`${numeral(12423).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          日同比
          <span className={styles.trendText}>-11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='总访问量'
        action={
          <Tooltip
            title='本平台用户总登录次数'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        footer={
          <Field
            label='日访问量'
            value={numeral(1234).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='总上传量'
        action={
          <Tooltip
            title='所有资源上传总量'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(16560).format('0,0')}
        footer={
          <Field
            label='日上传量'
            value="163"
          />
        }
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
