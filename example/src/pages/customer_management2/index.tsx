import { connectToastLoading, MainPage } from '@carefrees/taro-ui';
import MainSearch from './search';
import MainTable from './table';

function Index() {
  return (
    <MainPage bodyStyle={{ overflow: 'hidden' }} search={<MainSearch />}>
      <MainTable />
    </MainPage>
  );
}

export default connectToastLoading(Index, undefined);
