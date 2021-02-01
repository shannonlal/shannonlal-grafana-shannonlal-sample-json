import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    console.log(`Options ${JSON.stringify(options)}`);
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    function getRandomInt(max: number) {
      return Math.floor(Math.random() * Math.floor(max));
    }
    console.log(`from: ${from} to: ${to}`);
    // Return a constant for each query.
    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const value1 = getRandomInt(query.constant);
      const value2 = getRandomInt(query.constant);
      return new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [value1, value2], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
