import { Link, Table } from 'tdesign-vue-next';
import type { Components } from 'vue-markdown-next';
import { isArray } from 'lodash-es';

// 通过该类型获得 props 的类型提示
export const components: Partial<Components> = {
  a: (props) => {
    return (
      <Link theme={'primary'} target="_blank" href={props.href} size={'medium'} style={{ fontSize: '16px' }}>
        {props.children}
      </Link>
    );
  },
  table: (props) => {
    const { children } = props;
    if (!isArray(children)) {
      return;
    }
    const [tHeader, tBody] = children as any;
    const columns = tHeader.children?.[0].children?.map((item: any, index: number) => ({
      colKey: `data_${index}`,
      title: () => item.children,
      sorter: true,
    }));
    const data = tBody.children?.map((row: any) => {
      const rowData: any = {};
      row.children.forEach((cell: any, index: number) => {
        rowData[`data_${index}`] = cell.children;
      });
      return rowData;
    });
    return <Table columns={columns} data={data} bordered={true}></Table>;
  },
};
