import React, { Component } from "react";
import {  Axis, Chart, Geom, Tooltip, View } from 'bizcharts';
import Slider from 'bizcharts-plugin-slider';
import DataSet from '@antv/data-set';
import moment from 'moment';

const data = [{"timestamp":"0x59bce575","totalEthTx":"16","contractTx":"0"},{"timestamp":"0x59bd128f","totalEthTx":"171","contractTx":"0"},{"timestamp":"0x59bd4179","totalEthTx":"87","contractTx":"0"},{"timestamp":"0x59bd6ed9","totalEthTx":"9","contractTx":"1"},{"timestamp":"0x59bd9a4b","totalEthTx":"26","contractTx":"15"},{"timestamp":"0x59bdc578","totalEthTx":"116","contractTx":"1"},{"timestamp":"0x59bdf140","totalEthTx":"172","contractTx":"28"},{"timestamp":"0x59be1df2","totalEthTx":"57","contractTx":"0"},{"timestamp":"0x59be4b7e","totalEthTx":"26","contractTx":"0"},{"timestamp":"0x59be7955","totalEthTx":"65","contractTx":"1"},{"timestamp":"0x59bea6cf","totalEthTx":"53","contractTx":"6"},{"timestamp":"0x59bed3ac","totalEthTx":"76","contractTx":"8"},{"timestamp":"0x59befe5b","totalEthTx":"23","contractTx":"0"},{"timestamp":"0x59bf2a0a","totalEthTx":"169","contractTx":"13"},{"timestamp":"0x59bf5b33","totalEthTx":"96","contractTx":"35"},{"timestamp":"0x59bf86c1","totalEthTx":"41","contractTx":"0"},{"timestamp":"0x59bfb2ce","totalEthTx":"23","contractTx":"0"},{"timestamp":"0x59bfe2a9","totalEthTx":"104","contractTx":"29"},{"timestamp":"0x59c0103b","totalEthTx":"147","contractTx":"21"},{"timestamp":"0x59c03f8a","totalEthTx":"98","contractTx":"7"},{"timestamp":"0x59c06a22","totalEthTx":"102","contractTx":"14"},{"timestamp":"0x59c09781","totalEthTx":"76","contractTx":"11"},{"timestamp":"0x59c0c082","totalEthTx":"139","contractTx":"1"},{"timestamp":"0x59c0ef98","totalEthTx":"42","contractTx":"2"},{"timestamp":"0x59c11cb0","totalEthTx":"49","contractTx":"0"},{"timestamp":"0x59c148b7","totalEthTx":"75","contractTx":"0"},{"timestamp":"0x59c1770b","totalEthTx":"28","contractTx":"11"}];

data.map(d => {
  d.timestamp = parseInt(d.timestamp.replace('0x', ''), 16);
  d.date = moment.unix(d.timestamp).format('YYYY-MM-DD');
  d.totalEthTx = parseInt(d.totalEthTx, 10);
  return d;
});

data.sort((a, b) => a.timestamp - b.timestamp);

const ds = new DataSet({
  state: {
    start: data[0].date,
    end: data[data.length - 1].date
  }
});

const dv = ds.createView();
dv.source(data)
  .transform({
    type: 'filter',
    callback: obj => {
      const date = obj.date;
      return date <= ds.state.end && date >= ds.state.start;
    }
  });

class SliderChart extends Component {
  onChange(obj) {
    const { startText, endText } = obj;
    ds.setState('start', startText);
    ds.setState('end', endText);
  }

  render() {
    return (
      <div style={{ width: '90vw', height: '100vh', margin: '0 auto' }}>
        <Chart animate={false} padding={[40, 40, 40, 40]} data={dv} forceFit>
          <Tooltip showTitle={false} itemTpl='<li data-index={index}><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}{value}</li>' />
          <View start={{x: 0, y: 0}} data={dv} scale={{totalEthTx: {tickCount: 2}}}>
            <Axis name="totalEthTx"/>
            <Axis name="date" tickLine={null} label={null} />
            <Geom
              type='interval'
              position="date*totalEthTx"
              tooltip={['date*totalEthTx', (date, totalEthTx) => {
                return {
                  name: date,
                  value: '<br/><span style="padding-left: 16px">Total Transactions : ' + totalEthTx + '</span><br/>'
                };
              }]}
              shape="candle"
            />
          </View>
        </Chart>
        <Slider padding={[40, 75, 40, 75]} width='auto' height={40} start={ds.state.start} end={ds.state.end}
                xAxis="date" yAxis='totalEthTx' scales={{time: {type: 'timeCat', nice: false,}}} data={data}
                onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}

export default SliderChart;
